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
import {userLogout} from '../actions/auth';
import {cleanGroup, findUserGroupsByUserId} from '../actions/group';
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
    this.loadGroupPosts(true);
    this.setState({refreshing: false});
    }
  };

  loadGroupPosts = init => {
    const {token} = this.props.auth;
    const {navigation, getGroupPosts, userLogout} = this.props;
    const {id} = this.props.group.group;
    const data = {
      token: token,
      groupId: id,
      getGroupPosts: getGroupPosts,
      navigation: navigation,
      userLogout: userLogout,
      lastIndexId: init ? null : this.props.post.groupPosts.lastIndexId,
    };
    getGroupPostsFunc(data);
  };

  render() {
    const {group, post, navigation} = this.props;
    const {visibility, auth} = group.group;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {group.group.id ? (
            <PostList
              posts={post.groupPosts}
              group={group.group}
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
  const {group, auth, post} = state;
  return {group, auth, post};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupPosts: data => dispatch(getGroupPosts(data)),
    userLogout: () => dispatch(userLogout()),
    cleanGroup: () => dispatch(cleanGroup()),
    findUserGroupsByUserId: data => dispatch(findUserGroupsByUserId(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Group);
