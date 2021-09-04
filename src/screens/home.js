import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
  AppState,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {getFeed} from '../actions/post';
import {getGroupRecommendation} from '../actions/group';
import PostList from '../components/posts/postList';
import {getFeedFunc} from '../functions/post';
import {userLogout, signin} from '../actions/auth';
import {
  getLastVersion,
  getUserStatus,
  getSecurityClearance,
  updateLocationReducer,
  getIpAddress,
} from '../actions/security';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {
  requestNotificationPermission,
  hasLocationPermission,
} from '../functions/permission';
import {registerDeviceForNotification} from '../actions/user';
import HomeModal from '../components/home/homeModal';
import {getTheme} from '../utils/theme';
import Geolocation from 'react-native-geolocation-service';
import {logUserEvent} from '../actions/userEvent';

class Home extends React.Component {
  state = {
    loading: false,
    refreshing: false,
    appState: AppState.currentState,
    modalVisible: false,
    theme: getTheme(this.props.auth.user.theme),
    type: 'update',
    position: null,
    recommendedGroups: [],
    ip: null,
  };

  componentDidMount() {
    const {auth, navigation} = this.props;
    if (auth.token) {
      this.getNotificationToken();
      this.getLastVersion();
      this.login();
      this.props.getIpAddress();
      this.getSecurityClearance();
      this.watchId = null;
      this.getLocation();

      setTimeout(() => {
        this.getGroupRecommendation();
        this.loadFeed(true);
        // this.logUserEvent({event: 'onScreen'});
      }, 2500);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  login = async () => {
    const {auth, signin, navigation, userLogout} = this.props;
    const request = {
      token: auth.token,
    };

    const req = await signin(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot find user account');
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
      return;
    }

    if (req.status != 'active') {
      this.setState({modalVisible: true, type: 'account'});
    } else {
      if (!(this.state.type == 'update' && this.state.modalVisible)) {
        this.setState({modalVisible: false});
      }
    }
  };

  getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        this.setState({position});
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        distanceFilter: 0,
      },
    );
  };

  removeLocationUpdate = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  };

  getGroupRecommendation = async () => {
    const {position} = this.state;
    const {getGroupRecommendation, auth, metadata} = this.props;
    const request = {
      token: auth.token,
      count: 0,
      lat: position
        ? position.coords.latitude
        : metadata.IP
        ? metadata.IP.latitude
        : null,
      lng: position
        ? position.coords.longitude
        : metadata.IP
        ? metadata.IP.longitude
        : null,
    };

    const req = await getGroupRecommendation(request);
    if (req.errors) {
      console.log(req.errors);
      return;
    }

    this.setState({recommendedGroups: req.groups});
  };

  logUserEvent = log => {
    const {auth, logUserEvent, metadata} = this.props;
    const request = {
      token: auth.token,
      log,
      ip: metadata.IP ? metadata.IP.ip : null,
    };

    const req = logUserEvent(request);
  };

  componentWillUnmount() {
    console.log('App is closed');
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  getSecurityClearance = async () => {
    const {getSecurityClearance, auth} = this.props;
    const request = {
      token: auth.token,
    };

    const req = await getSecurityClearance(request);
    if (req.errors) {
      console.log(req.errors);
      return;
    }
  };

  checkAuth = async () => {
    const {auth, getUserStatus} = this.props;

    const request = {
      token: auth.token,
    };

    // if user status is no longer active, lock user out
    try {
      const req = await getUserStatus(request);
      if (req.errors) {
        console.log(req.errors);
        this.setState({modalVisible: true, type: 'error'});
        return;
      }
      if (req.status != 'active') {
        this.setState({modalVisible: true, type: 'account'});
      } else {
        if (!(this.state.type == 'update' && this.state.modalVisible)) {
          this.setState({modalVisible: false});
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({modalVisible: true, type: 'error'});
      return;
    }
  };

  getLastVersion = async () => {
    const {getLastVersion, metadata} = this.props;

    // if user version is incorrect, lock user out
    try {
      const req = await getLastVersion();
      if (req.errors) {
        console.log(req.errors);
        alert('Server is under maintenance, please try again later');
        return;
      }

      const {serverVersion, IOSVersion, AndroidVersion} = req;

      if (Platform.OS == 'ios') {
        if (metadata.version.IOSVersion != IOSVersion) {
          this.setState({modalVisible: true, type: 'update'});
        }
      } else {
        if (metadata.version.AndroidVersion != AndroidVersion) {
          this.setState({modalVisible: true, type: 'update'});
        }
      }
    } catch (err) {
      console.log(err);
      this.setState({modalVisible: true, type: 'error'});
      return;
    }
  };

  getNotificationToken = async () => {
    const permission = await requestNotificationPermission();
    if (permission) {
      const FCMtoken = await messaging().getToken();
      const {
        auth,
        registerDeviceForNotification,
        userLogout,
        navigation,
      } = this.props;
      const data = {
        token: auth.token,
        FCMtoken: FCMtoken,
        deviceId: DeviceInfo.getDeviceId(),
      };

      const notificationData = await registerDeviceForNotification(data);
      if (notificationData.errors) {
        // alert(notificationData.errors[0].message);
        if (notificationData.errors[0].message == 'Not Authenticated') {
          userLogout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
        }
        return;
      }
    }
  };

  _handleAppStateChange = nextAppState => {
    const {appState} = this.state;
    if (appState.match(/(inactive|background)/) && nextAppState === 'active') {
      this.getLastVersion();
      this.props.getIpAddress();
      this.checkAuth();
      this.getSecurityClearance();

      this.getLocation();
      setTimeout(() => {
        this.getGroupRecommendation();
        this.loadFeed(true);
        // this.logUserEvent({event: 'onScreen'});
      }, 1000);

    } else if (nextAppState !== 'active') {
      if (Platform.OS == 'ios') {
        if (nextAppState == 'inactive') {
          // this.logUserEvent({event: 'offScreen'});
        }
      } else {
        if (nextAppState == 'background') {
          // this.logUserEvent({event: 'offScreen'});
        }
      }
      this.removeLocationUpdate();
    }
    this.setState({appState: nextAppState});
  };

  componentDidUpdate(prevProps, prevState) {
    const {currentScreen, auth, navigation} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'HomeDrawerNavigator' &&
      prevScreen.currentScreen != 'HomeDrawerNavigator'
    ) {
      this.onRefresh();
    }

    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
        headerTintColor: theme.textColor.color,
      });
    }

    if (this.props.route.params) {
      const {refresh, prevRoute} = this.props.route.params;
      if (refresh) {
        if (prevRoute == 'PostSetting') {
          this.onRefresh();
          navigation.setParams({refresh: false});
        }
      }
    }
  }

  onEndReached = () => {
    this.setState({loading: true});
    this.loadFeed(false);
    this.setState({loading: false});
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getLocation();
    setTimeout(() => {
      this.getGroupRecommendation();
      this.loadFeed(true);
    }, 1000);
    this.setState({refreshing: false});
  };

  loadFeed = init => {
    const {getFeed, navigation, userLogout, auth, post, metadata} = this.props;
    const {position} = this.state;
    const data = {
      token: auth.token,
      getFeed: getFeed,
      navigation: navigation,
      userLogout: userLogout,
      count: init ? 0 : post.feed.count,
      lat: position
        ? position.coords.latitude
        : metadata.IP
        ? metadata.IP.latitude
        : null,
      lng: position
        ? position.coords.longitude
        : metadata.IP
        ? metadata.IP.longitude
        : null,
    };

    getFeedFunc(data);
  };

  render() {
    const {auth, post, navigation} = this.props;
    const {feed} = post;
    const {modalVisible, theme, type, recommendedGroups, position} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
          <StatusBar
            barStyle={
              auth
                ? auth.user.theme == 'darkMode'
                  ? 'light-content'
                  : 'dark-content'
                : 'dark-content'
            }
          />
          <PostList
            recommendedGroups={recommendedGroups || null}
            posts={feed}
            navigation={this.props.navigation}
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            prevRoute={'Home'}
            theme={theme}
            position={position}
          />
          {this.state.loading ? (
            <ActivityIndicator animating={true} color={'grey'} />
          ) : null}
          {modalVisible ? (
            <HomeModal
              type={type}
              modalVisible={modalVisible}
              theme={theme}
              userLogout={this.props.userLogout}
              navigation={navigation}
            />
          ) : null}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  noPostStyle: {
    marginTop: 100,
    color: 'grey',
    fontStyle: 'italic',
  },
});

const mapStateToProps = state => {
  const {currentScreen, auth, post, metadata} = state;
  return {currentScreen, post, auth, metadata};
};

const mapDispatchToProps = dispatch => {
  return {
    getFeed: data => dispatch(getFeed(data)),
    userLogout: () => dispatch(userLogout()),
    registerDeviceForNotification: data =>
      dispatch(registerDeviceForNotification(data)),
    getLastVersion: () => dispatch(getLastVersion()),
    getUserStatus: data => dispatch(getUserStatus(data)),
    getSecurityClearance: data => dispatch(getSecurityClearance(data)),
    updateLocationReducer: data => dispatch(updateLocationReducer(data)),
    logUserEvent: data => dispatch(logUserEvent(data)),
    getGroupRecommendation: data => dispatch(getGroupRecommendation(data)),
    getIpAddress: data => dispatch(getIpAddress(data)),
    signin: data => dispatch(signin(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
