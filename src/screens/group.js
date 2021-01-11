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
import {userLogout} from '../actions/auth';
import {cleanGroup, findUserGroupsByUserId} from '../actions/group';
import { getUserGroupPoint, getGroupPointLeaderBoard} from '../actions/point'
import {invalidAuthentication} from '../functions/auth';

class Group extends React.Component {
  state = {
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    const {groupname, visibility, auth} = this.props.group.group;
    const {navigation, group} = this.props;


    navigation.setOptions({
      headerTitle: groupname,
      headerBackTitleVisible: false
    });

    if (visibility == 'public' || auth != null) {
      this.setState({loading: true});
      this.loadGroupPosts(true);
      this.loadLeaderBoard()
      this.setState({loading: false});
    }

    Keyboard.dismiss();
  }

  componentWillUnmount() {
    this.props.cleanGroup();
    this.loadGroups(true);
  }

  loadGroups = async init => {
    const {token} = this.props.auth;
    const {findUserGroupsByUserId, navigation, userLogout} = this.props;
    const groupsData = await findUserGroupsByUserId({
      token: token,
      lastIndexId: init ? null : this.props.group.groups.lastIndexId,
    });

    invalidAuthentication({
      queryResult: groupsData,
      userLogout: userLogout,
      navigation: navigation,
    });
  };

  loadLeaderBoard = () => {
    const { userLogout, auth, getGroupPointLeaderBoard, navigation, group } = this.props
    const data = {
      userLogout: userLogout,
      auth: auth,
      getGroupPointLeaderBoard: getGroupPointLeaderBoard,
      navigation: navigation,
      group: group,
      count: 0,
      limit: 3,
      period: 'month'
    }

    loadLeaderBoardFunc(data)

  }

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
      this.setState({loading: true});
      this.loadGroupPosts(false);
      this.setState({loading: false});
    }
  };

  onRefresh = () => {
    const {visibility, auth} = this.props.group.group;
    if (visibility == 'public' || auth != null) {
    this.setState({refreshing: true});
    this.loadLeaderBoard()
    this.loadGroupPosts(true);
    this.setState({refreshing: false});
    }
  };

  loadGroupPosts = init => {
    const {token} = this.props.auth;
    const {navigation, getGroupPosts, userLogout, getUserGroupPoint} = this.props;
    const {id} = this.props.group.group;
    const data = {
      token: token,
      groupId: id,
      getGroupPosts: getGroupPosts,
      navigation: navigation,
      userLogout: userLogout,
      getUserGroupPoint: getUserGroupPoint,
      lastIndexId: init ? null : this.props.post.groupPosts.lastIndexId,
      init: init
    };
    getGroupPostsFunc(data);
  };

  render() {
    const {group, post, navigation, point} = this.props;
    const {visibility, auth} = group.group;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {group.group.id ? (
            <PostList
              posts={post.groupPosts}
              group={group.group}
              point={point}
              navigation={navigation}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
              onAddPost={this.onAddPost}
            />
          ) : null}
          {this.props.post.groupPosts.count == 0 && auth != null ? (
            <Text style={styles.noPostStyle}>There are not any post yet</Text>
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
    backgroundColor: 'white',
  },
  noPostStyle: {
    marginBottom: 300,
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
    cleanGroup: () => dispatch(cleanGroup()),
    findUserGroupsByUserId: data => dispatch(findUserGroupsByUserId(data)),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
    getGroupPointLeaderBoard: data => dispatch(getGroupPointLeaderBoard(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Group);
