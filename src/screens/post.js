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
import {getGroupPosts, getGroupPostForCheckIn} from '../actions/post';
import PostList from '../components/posts/postList';
import {getGroupPostsFunc} from '../functions/post';
import {userLogout} from '../actions/auth';

class Post extends React.Component {
  state = {
    loading: false,
    refreshing: false,
    post: [],
    count: 0
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
      this.loadPosts(true)
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
      this.loadPosts(false)
      this.setState({loading: false});
    }
  };

  onRefresh = () => {
    const {visibility, auth} = this.props.group.group;
    if (visibility == 'public' || auth != null) {
    this.setState({refreshing: true});
    this.loadPosts(true)
    this.setState({refreshing: false});
    }
  };

  loadPosts = async init => {
    const {userLogout, group, auth, navigation, getGroupPostForCheckIn} = this.props
    const {count, post} = this.state
    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: init ? 0 : count
    }

    const req = await getGroupPostForCheckIn(request)
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load posts at this time, please try again later')
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({post: init ? req.posts : post.concat(req.posts), count: req.count})

  }

  render() {
    const {post, count} = this.state
    const posts = {
      posts: post,
      count: count,
    }
    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView>
          <StatusBar barStyle={'dark-content'} />
          <PostList
            posts={posts}
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
    getGroupPostForCheckIn: data => dispatch(getGroupPostForCheckIn(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Post);
