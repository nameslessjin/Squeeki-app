import React, {useRef} from 'react';
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
  Dimensions,
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
  replyComment,
} from '../actions/comment';
import {userLogout} from '../actions/auth';
import {getCommentsFunc} from '../functions/comment';
import CommentList from '../components/comment/commentList';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentModal from '../components/comment/commentModal';
import {getSundays} from '../utils/time';
import {getUserGroupPoint} from '../actions/point';

const {height, width} = Dimensions.get('screen');

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
    const {group} = this.props.group;
    if (group.id != null) {
      this.getUserGroupPoint();
    }
    this.props.cleanComment();

    // get post
  }

  state = {
    newComment: '',
    post: {
      allowComment: true,
    },
    loading: false,
    inputHeight: 35,
    sent: false,
    modalVisible: false,
    comment_uid: '',
    commentId: '',
    replyId: null,
  };

  getUserGroupPoint = async () => {
    const {group, auth, getUserGroupPoint, navigation, userLogout} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load points at this time, please try again later');
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

  getPostComment = async init => {
    const {getPost, navigation, userLogout} = this.props;
    const {postId} = this.props.route.params;
    const {token} = this.props.auth;
    const data = {
      token: token,
      postId: postId,
    };
    const postData = await getPost(data);
    if (postData.errors) {
      // alert(postData.errors[0].message);
      alert('Cannot load comments at this time, please try again later');
      if (postData.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({post: postData});

    Keyboard.dismiss();
  };

  onCommentLike = async commentId => {
    const {navigation, auth, likeComment} = this.props;
    const request = {
      token: auth.token,
      commentId: commentId,
    };

    const req = await likeComment(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot like comment at this time, please try again later');
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
    const {commentId} = this.state;
    const request = {
      token: auth.token,
      commentId: commentId,
    };

    const req = await deleteComment(request);
    if (req.errors) {
      console.log(req.errors[0].message);
      alert('Cannot delete comment at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.onBackdropPress();
  };

  // action on reply button on the left side of input bar pressed
  onCommentReplyPress = replyId => {
    this.inputRef.focus();
    this.setState({replyId: replyId});
  };

  onCommentReport = async content => {
    const {navigation, auth, reportComment} = this.props;
    const {commentId} = this.state;
    const request = {
      token: auth.token,
      commentId: commentId,
      content: content.trim(),
    };

    const req = await reportComment(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot report comment at this time, please try again later');
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
    const {navigation, userLogout, createComment, replyComment} = this.props;
    const {newComment, replyId} = this.state;
    const {token} = this.props.auth;
    const {postId} = this.props.route.params;
    const data = {
      content: newComment,
      token: token,
      postId: postId,
      replyId,
    };
    this.setState({sent: true});
    Keyboard.dismiss();
    const comment = replyId
      ? await replyComment(data)
      : await createComment(data);
    if (comment.errors) {
      console.log(comment.errors[0].message);
      alert('Cannot send comment at this time, please try again later');
      if (comment.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    this.setState({newComment: '', sent: false, replyId: null});
  };

  onOptionToggle = data => {
    const {commentId, userId} = data;
    this.setState({
      modalVisible: true,
      comment_uid: userId,
      commentId: commentId,
    });
    Keyboard.dismiss();
  };

  onBackdropPress = () => {
    this.setState({
      modalVisible: false,
    });
    Keyboard.dismiss();
  };

  onCancelReply = () => {
    this.setState({newComment: '', replyId: null});
  };

  render() {
    const {container} = styles;
    const {
      post,
      inputHeight,
      newComment,
      sent,
      modalVisible,
      comment_uid,
      replyId,
    } = this.state;
    const disabled = newComment.trim().length == 0;
    const {navigation, group, comment} = this.props;
    const isReply = replyId ? true : false;
    getSundays();

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'overflow'}
          keyboardVerticalOffset={35}>
          <StatusBar barStyle={'dark-content'} />

          <CommentList
            post={post}
            comments={comment.comments.comments}
            onEndReached={this.onEndReached}
            sent={sent}
            onCommentLike={this.onCommentLike}
            onOptionToggle={this.onOptionToggle}
            navigation={navigation}
            onCommentReplyPress={this.onCommentReplyPress}
            replyId={replyId}
          />

          {post.allowComment && !modalVisible ? (
            <View style={styles.inputBarContainer}>
              {isReply ? (
                <View
                  style={[
                    styles.replyIndicatorContainer,
                    {
                      height: Math.max(40, inputHeight),
                    },
                  ]}>
                  <TouchableOpacity onPress={this.onCancelReply}>
                    <View style={styles.replyButton}>
                      <Text style={styles.replyText}>REPLY:</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View
                style={[
                  styles.textInputContainer,
                  {
                    width: isReply ? width - 100 : width - 50,
                    height: Math.max(40, inputHeight),
                  },
                ]}>
                <TextInput
                  style={[styles.textInput]}
                  ref={r => (this.inputRef = r)}
                  placeholder={
                    isReply ? 'Reply a comment ...' : 'Add a comment ...'
                  }
                  placeholderTextColor={'#7f8fa6'}
                  multiline={true}
                  maxLength={255}
                  onContentSizeChange={e =>
                    this.setState({
                      inputHeight: e.nativeEvent.contentSize.height + 15,
                    })
                  }
                  onChangeText={text => this.setState({newComment: text})}
                  value={newComment}
                />
              </View>
              <View
                style={[
                  styles.sendButtonContainer,
                  {
                    height: Math.max(40, inputHeight),
                  },
                ]}>
                {sent ? (
                  <ActivityIndicator
                    animating={true}
                    style={{marginBottom: 5}}
                    color={'grey'}
                  />
                ) : (
                  <TouchableOpacity
                    disabled={disabled}
                    onPress={this.onSend}
                    style={{marginBottom: 5}}>
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
            </View>
          ) : null}
          {modalVisible ? (
            <CommentModal
              modalVisible={modalVisible}
              onBackdropPress={this.onBackdropPress}
              comment_uid={comment_uid}
              postOwner={post.user}
              userId={this.props.auth.user.id}
              onCommentDelete={this.onCommentDelete}
              onCommentReport={this.onCommentReport}
              rank_in_group={group.group.auth ? group.group.auth.rank : null}
              rank_required={
                group.group.rank_setting
                  ? group.group.rank_setting.manage_comment_rank_required
                  : null
              }
            />
          ) : null}
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
  inputBarContainer: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    // position: 'relative',
    bottom: Platform.OS == 'ios' ? 55 : 20,
    justifyContent: 'center',
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    fontSize: 16,
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    borderRadius: 10,
    padding: 5,
    paddingLeft: 8,
  },
  sendButtonContainer: {
    width: 35,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  replyIndicatorContainer: {
    justifyContent: 'center',
    width: 50,
    alignItems: 'center',
    marginRight: 3,
  },
  replyText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  replyButton: {
    backgroundColor: '#e84118',
    width: 50,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
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
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
    replyComment: data => dispatch(replyComment(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Comment);
