import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {getGroupPosts} from '../actions/post';
import PostList from '../components/posts/postList';
import {getGroupPostsFunc} from '../functions/post';
import {loadLeaderBoardFunc} from '../functions/point';
import {getGroupJoinRequestCountFunc} from '../functions/group';
import {userLogout} from '../actions/auth';
import {getGroupJoinRequestCount} from '../actions/group';
import {getUserGroupPoint, getGroupPointLeaderBoard} from '../actions/point';

class Group extends React.Component {
  state = {
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerBackTitleVisible: false,
    });

    Keyboard.dismiss();

    // set this just in case of redirect from an old group to a new group but group is not yet load
    setTimeout(() => {
      const {group} = this.props.group;
      if (group.id) {
        this.loadGroupPosts(true);
      }
    }, 100);
  }

  getUserGroupPoint = async () => {
    const {auth, group, getUserGroupPoint} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      alert(req.errors[0].message);
      return;
    }
  };

  getGroupJoinRequestCount = () => {
    const {
      getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    } = this.props;
    const data = {
      func: getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    };
    getGroupJoinRequestCountFunc(data);
  };

  loadLeaderBoard = () => {
    const {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
    } = this.props;
    const data = {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
      count: 0,
      limit: 3,
      period: 'month',
    };

    loadLeaderBoardFunc(data);
  };

  onAddPost = () => {
    const {navigation} = this.props;
    const {id} = this.props.group.group;
    navigation.navigate('PostSetting', {
      groupId: id,
      create: true,
    });
  };

  onEndReached = () => {
    const {visibility, auth} = this.props.group.group;
    if (visibility == 'public' || auth != null) {
      this.loadGroupPosts(false);
    }
  };

  onRefresh = () => {
    const {visibility, auth} = this.props.group.group;
    if (visibility == 'public' || auth != null) {
      this.setState({refreshing: true});
      this.loadLeaderBoard();
      this.loadGroupPosts(true);
      this.getUserGroupPoint();
      this.getGroupJoinRequestCount();
      this.setState({refreshing: false});
    }
  };

  loadGroupPosts = async init => {
    const {
      navigation,
      getGroupPosts,
      userLogout,
      getUserGroupPoint,
      auth,
      group,
      post,
    } = this.props;
    const data = {
      token: auth.token,
      groupId: group.group.id,
      getGroupPosts,
      navigation,
      userLogout,
      getUserGroupPoint,
      count: init ? 0 : post.groupPosts.count,
      init,
    };

    this.setState({loading: true});
    // if it is not init load and count is 0, not loading, else load
    if (!(!init && post.groupPosts.count == 0)) {
      await getGroupPostsFunc(data);
    }
    this.setState({loading: false});
  };

  render() {
    const {group, post, navigation, point} = this.props;
    const {refreshing} = this.state;

    return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        {group.group.id ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <PostList
              posts={post.groupPosts}
              group={group.group}
              point={point}
              navigation={navigation}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              refreshing={refreshing}
              onAddPost={this.onAddPost}
            />
          </TouchableWithoutFeedback>
        ) : null}
        {/* {loading ? <ActivityIndicator animating={loading} /> : null} */}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  noPostStyle: {
    // marginBottom: 200,
    color: 'grey',
    fontStyle: 'italic',
  },
});

const mapStateToProps = state => {
  const {group, auth, post, point} = state;
  return {group, auth, post, point};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupPosts: data => dispatch(getGroupPosts(data)),
    userLogout: () => dispatch(userLogout()),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
    getGroupPointLeaderBoard: data => dispatch(getGroupPointLeaderBoard(data)),
    getGroupJoinRequestCount: data => dispatch(getGroupJoinRequestCount(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Group);
