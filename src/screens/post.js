import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {getGroupPosts} from '../actions/post';
import PostList from '../components/posts/postList';
import {getGroupPostsFunc} from '../functions/post';
import {userLogout} from '../actions/auth';

class Post extends React.Component {
  state = {
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    const {visibility, auth} = this.props.group.group;
    const {navigation} = this.props;

    navigation.setOptions({
      headerTitle: 'Posts',
      headerBackTitleVisible: false,
    });

    if (visibility == 'public' || auth != null) {
      this.setState({loading: true});
      this.loadGroupPosts(true);
      this.setState({loading: false});
    }

    Keyboard.dismiss();
  }

  onPostSelect = (post) => {
    const {navigation} = this.props;
    navigation.navigate('CheckInSetting', {
      post: post
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
    const {post} = this.props;

    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView>
          <StatusBar barStyle={'dark-content'} />
          <PostList
            posts={post.groupPosts}
            group={null}
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            selectionMode={true}
            onPostSelect={this.onPostSelect}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  const {group, auth, post} = state;
  return {group, auth, post};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupPosts: data => dispatch(getGroupPosts(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Post);
