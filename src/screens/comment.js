import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {getPost} from '../actions/post';
import {
  getComments,
  createComment,
  cleanComment,
  deleteComment,
  reportComment,
  likeComment,
} from '../actions/comment';
import {userLogout} from '../actions/auth';
import {getCommentsFunc} from '../functions/comment';
import CommentList from '../components/comment/commentList';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentModal from '../components/comment/commentModal';
import { getSundays } from '../utils/time'
import { getUserGroupPoint } from '../actions/point'

class Comment extends React.Component {
  componentDidMount() {
    this.getPostComment();
    this.inputHeight = 35;
    const {navigation} = this.props;

    navigation.setOptions({
      headerBackTitleVisible: false,
    });
  }

  componentWillUnmount() {
    const {group} = this.props.group
    if (group.id != null){
      this.getUserGroupPoint()
    }
    this.props.cleanComment();
  }

  state = {
    newComment: '',
    post: {
      allowComment: true,
    },
    loading: false,
    comments: [],
    inputHeight: 35,
    sent: false,
    modalVisible: false,
    comment_uid: '',
    commentId: ''
  };

  getUserGroupPoint = async() => {
    const {group, auth, getUserGroupPoint, navigation, userLogout } = this.props

    const request = {
      token: auth.token,
      groupId: group.group.id
    }

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      alert(req.errors[0].message);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

  }

  getPostComment = async init => {
    const {getPost, getComments, navigation, userLogout} = this.props;
    const {postId} = this.props.route.params;
    const {count} = this.props.comment.comments;
    const {token} = this.props.auth;
    const data = {
      token: token,
      postId: postId,
      count: count,
    };
    const postData = await getPost(data);
    if (postData.errors) {
      alert(postData.errors[0].message);
      if (postData.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    const post = postData.data.getPost;

    this.setState({post: post});

    Keyboard.dismiss();
  };

  componentDidUpdate(prevProps, prevState) {
    const prevComment = prevProps.comment;
    const {comment} = this.props;
    if (prevComment.comments != comment.comments) {
      this.setState(prevState => ({
        comments: comment.comments.comments,
      }));
    }
  }

  onCommentLike = async commentId => {
    const {navigation, auth, likeComment} = this.props;
    const request = {
      token: auth.token,
      commentId: commentId,
    };

    const req = await likeComment(request);
    if (req.errors) {
      alert(req.errors[0].message);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  onCommentDelete = async () => {
    const {navigation, auth, deleteComment} = this.props;
    const {commentId} = this.state
    const request = {
      token: auth.token,
      commentId: commentId
    }

    const req = await deleteComment(request);
    if (req.errors) {
      alert(req.errors[0].message);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.onBackdropPress()

  }

  onCommentReport = async (content) => {
    const {navigation, auth, reportComment} = this.props
    const {commentId} = this.state
    const request = {
      token: auth.token,
      commentId: commentId,
      content: content.trim()
    }

    const req = await reportComment(request);
    if (req.errors) {
      alert(req.errors[0].message);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

  }

  onEndReached = () => {
    this.setState({loading: true});
    const {count} = this.props.comment.comments;
    const {token} = this.props.auth;
    const {postId} = this.props.route.params;
    const {getComments, navigation, userLogout} = this.props;
    const data = {
      token: token,
      postId: postId,
      count: count,
    };

    const input = {
      data: data,
      getComments: getComments,
      navigation: navigation,
      userLogout: userLogout,
    };

    getCommentsFunc(input);
    this.setState({loading: false});
  };

  updateComment = data => {
    this.setState({newComment: data});
  };

  onSend = async () => {
    const {navigation, userLogout} = this.props;
    const {newComment} = this.state;
    const {token} = this.props.auth;
    const {postId} = this.props.route.params;
    const data = {
      comment: newComment,
      token: token,
      postId: postId,
      count: 0,
    };
    this.setState({sent: true});
    Keyboard.dismiss();
    const comment = await this.props.createComment(data);
    if (comment.errors) {
      alert(comment.errors[0].message);
      if (comment.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({newComment: '', sent: false});
  };

  onOptionToggle = data => {
    const {commentId, userId} = data
    this.setState({
      modalVisible: true,
      comment_uid: userId,
      commentId: commentId
    });
    Keyboard.dismiss();
  };

  onBackdropPress = () => {
    this.setState({
      modalVisible: false,
    });
    Keyboard.dismiss();
  };

  render() {
    const {container} = styles;
    const {
      comments,
      post,
      inputHeight,
      newComment,
      sent,
      modalVisible,
      comment_uid
    } = this.state;
    const disabled = newComment.trim().length == 0;

    getSundays()
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'overflow'}
          keyboardVerticalOffset={35}>
          <StatusBar barStyle={'dark-content'} />
          <CommentList
            post={post}
            comments={comments}
            onEndReached={this.onEndReached}
            sent={sent}
            onCommentLike={this.onCommentLike}
            onOptionToggle={this.onOptionToggle}
          />
          {post.allowComment ? (
            <View style={styles.textInputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {height: Math.max(35, inputHeight + 10)},
                ]}
                placeholder={'Add a comment ...'}
                placeholderTextColor={'#7f8fa6'}
                multiline={true}
                maxLength={250}
                onContentSizeChange={e =>
                  this.setState({
                    inputHeight: e.nativeEvent.contentSize.height,
                  })
                }
                onChangeText={text => this.setState({newComment: text})}
                value={newComment}
              />
              {sent ? (
                <ActivityIndicator animating={true} />
              ) : (
                <TouchableOpacity disabled={disabled} onPress={this.onSend}>
                  <MaterialIcons
                    name={
                      disabled
                        ? 'arrow-up-drop-circle-outline'
                        : 'arrow-up-drop-circle'
                    }
                    size={30}
                    color={disabled ? '#718093' : '#273c75'}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          <CommentModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            comment_uid={comment_uid}
            postOwner={post.user}
            userId = {this.props.auth.user.id}
            onCommentDelete={this.onCommentDelete}
            onCommentReport={this.onCommentReport}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  textInputContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Platform.OS == 'ios' ? 55 : 20,
  },
  textInput: {
    lineHeight: 16,
    fontSize: 16,
    marginLeft: 10,
    width: '85%',
    // borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    borderRadius: 10,
    padding: 5,
    paddingTop: 10,
    
  },
});

const mapStateToProps = state => {
  const {auth, post, comment, group} = state;
  return {auth, post, comment, group};
};
const mapDispatchToProps = dispatch => {
  return {
    getPost: data => dispatch(getPost(data)),
    getComments: data => dispatch(getComments(data)),
    createComment: data => dispatch(createComment(data)),
    userLogout: () => dispatch(userLogout()),
    cleanComment: () => dispatch(cleanComment()),
    likeComment: data => dispatch(likeComment(data)),
    deleteComment: data => dispatch(deleteComment(data)),
    reportComment: data => dispatch(reportComment(data)),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Comment);
