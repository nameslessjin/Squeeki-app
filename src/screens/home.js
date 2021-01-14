import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {getFeed} from '../actions/post';
import PostList from '../components/posts/postList';
import {getFeedFunc} from '../functions/post';
import {userLogout} from '../actions/auth';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {requestNotificationPermission} from '../functions/permission';
import {registerDeviceForNotification} from '../actions/user';

class Home extends React.Component {
  state = {
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    this.setState({loading: true})
    this.loadFeed(true);
    this.setState({loading: false})
    this.getNotificationToken();
  }

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
        alert(notificationData.errors[0].message);
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

  componentDidUpdate(prevProps, prevState) {
    const {currentScreen} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'Home' &&
      prevScreen.currentScreen != 'Home'
    ) {
      this.loadFeed(true);
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
      count: init ? 0 : post.feed.count
    };

    getFeedFunc(data);

  };

  render() {
    const {feed} = this.props.post;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {feed.posts.length == 0 ? (
            <Text style={styles.noPostStyle}>There is not any post yet</Text>
          ) : (
            <PostList
              posts={feed}
              navigation={this.props.navigation}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
            />
          )}

          {this.state.loading ? (
            <ActivityIndicator animating={true} />
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
  const {currentScreen, auth, post} = state;
  return {currentScreen, post, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getFeed: data => dispatch(getFeed(data)),
    userLogout: () => dispatch(userLogout()),
    registerDeviceForNotification: data =>
      dispatch(registerDeviceForNotification(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
