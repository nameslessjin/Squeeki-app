import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  ActivityIndicator,
  StatusBar,
  AppState,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {getFeed} from '../actions/post';
import PostList from '../components/posts/postList';
import {getFeedFunc} from '../functions/post';
import {userLogout} from '../actions/auth';
import {
  getLastVersion,
  getUserStatus,
  getSecurityClearance,
} from '../actions/security';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {requestNotificationPermission} from '../functions/permission';
import {registerDeviceForNotification} from '../actions/user';
import HomeModal from '../components/home/homeModal';
import {getTheme} from '../utils/theme';

class Home extends React.Component {
  state = {
    loading: false,
    refreshing: false,
    appState: AppState.currentState,
    modalVisible: false,
    theme: getTheme(this.props.auth.user.theme),
    type: 'update',
  };

  componentDidMount() {
    this.loadFeed(true);
    this.getNotificationToken();
    this.getLastVersion();
    this.checkAuth();
    this.getSecurityClearance()

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
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
        this.setState({modalVisible: false});
      }
    } catch (err) {
      console.log(err);
      this.setState({modalVisible: true, type: 'error'});
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
      this.checkAuth();
      this.getSecurityClearance()
      this.loadFeed(true);
    }
    this.setState({appState: nextAppState});
  };

  componentDidUpdate(prevProps, prevState) {
    const {currentScreen, auth, navigation} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'Home' &&
      prevScreen.currentScreen != 'Home'
    ) {
      this.loadFeed(true);
    }

    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: theme.backgroundColor,
        headerTintColor: theme.textColor.color,
      });
    }
  }

  onEndReached = () => {
    this.setState({loading: true});
    this.loadFeed(false);
    this.setState({loading: false});
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadFeed(true);
    this.setState({refreshing: false});
  };

  loadFeed = init => {
    const {getFeed, navigation, userLogout, auth, post} = this.props;
    const data = {
      token: auth.token,
      getFeed: getFeed,
      navigation: navigation,
      userLogout: userLogout,
      count: init ? 0 : post.feed.count,
    };

    getFeedFunc(data);
  };

  render() {
    const {feed} = this.props.post;
    const {modalVisible, theme, type} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.greyArea]}>
          <StatusBar barStyle={'dark-content'} />
          <PostList
            posts={feed}
            navigation={this.props.navigation}
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            prevRoute={'Home'}
          />
          {this.state.loading ? (
            <ActivityIndicator animating={true} color={'grey'} />
          ) : null}
          {modalVisible ? (
            <HomeModal type={type} modalVisible={modalVisible} theme={theme} />
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
