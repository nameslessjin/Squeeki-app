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
    const {display_name, visibility, auth, id} = this.props.group.group;
    const {navigation, group} = this.props;

    navigation.setOptions({
      headerTitle: display_name,
      headerBackTitleVisible: false,
    });

    if (visibility == 'public' || auth != null) {
      this.loadGroupPosts(true);
      // this.loadLeaderBoard();

      if (auth != null) {
        if (auth.rank <= 2) {
          this.getGroupJoinRequestCount();
        }
      }
    }

    Keyboard.dismiss();
  }

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
      getGroupPosts: getGroupPosts,
      navigation: navigation,
      userLogout: userLogout,
      getUserGroupPoint: getUserGroupPoint,
      count: init ? 0 : post.groupPosts.count,
      init: init,
    };

    this.setState({loading: true});
    await getGroupPostsFunc(data);
    this.setState({loading: false});
  };

  render() {
    const {group, post, navigation, point} = this.props;
    const {visibility, auth} = group.group;
    const {loading, refreshing} = this.state;

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
