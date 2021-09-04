import React, {useRef} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TextInput,
  Platform,
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
import CommentModal from '../components/comment/commentModal';
import {detectAtPeopleNGroup} from '../utils/detect';
import {getUserGroupPoint} from '../actions/point';
import ReplyIndicator from '../components/comment/replyIndicator';
import SendButton from '../components/comment/sendButton';
import {searchAtUser} from '../actions/user';
import AtList from '../components/comment/AtList';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {searchAtGroup} from '../actions/group';
import {getTheme} from '../utils/theme';

const {height, width} = Dimensions.get('screen');

class Comment extends React.Component {
  state = {
    newComment: '',
    post: {
      allowComment: true,
    },
    loading: false,
    inputHeight: 35,
    barHeight: 35,
    sent: false,
    modalVisible: false,
    comment_uid: '',
    commentId: '',
    replyId: null,
    searchTerm: '',
    searchIndex: -1,
    atSearchResult: [],
    replyType: 'comment',
    replyTo: '',
    atListShow: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    this.getPostComment();
    this.inputHeight = 35;
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
    this._actionSheetRef = undefined;
  }

  componentWillUnmount() {
    const {group, navigation} = this.props;
    if (group.group.id != null) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'Comment',
      });
    }
    this.props.cleanComment();

    // get post
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      searchTerm,
      inputHeight,
      barHeight,
      atListShow,
      atSearchResult,
    } = this.state;
    // check for search term
    if (prevState.searchTerm != searchTerm && searchTerm.length >= 2) {
      this.onAtSearch();
    }

    // input tool bar height adjustment
    if (barHeight < inputHeight) {
      this.setState({barHeight: inputHeight});
    }
    if (prevState.inputHeight > inputHeight) {
      this.setState({barHeight: inputHeight});
    }
    if (
      prevState.atSearchResult.length != atSearchResult.length &&
      atListShow
    ) {
      let newBarHeight = inputHeight;
      if (atSearchResult.length < 3) {
        newBarHeight =
          newBarHeight + atSearchResult.length * 50 + 15 - (inputHeight - 35);
      } else {
        newBarHeight = 190;
      }
      this.setState({
        barHeight: newBarHeight,
      });
    }
    if (!atListShow && prevState.atListShow != atListShow) {
      this.setState({barHeight: inputHeight});
    }
  }

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
      console.log(postData.errors[0].message);
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
  onCommentReplyPress = (replyId, type, replyTo) => {
    this.inputRef.focus();
    this.setState({replyId, replyType: type, replyTo});

    if (type == 'reply' && this.props.auth.user.username != replyTo) {
      this.setState({newComment: `@${replyTo} `});
    }
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
    this.setState({sent: true, atListShow: false});
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
      atListShow: false,
    });
    Keyboard.dismiss();
  };

  onBackdropPress = () => {
    this.setState({
      modalVisible: false,
      atListShow: false,
    });
    Keyboard.dismiss();
  };

  onCancelReply = () => {
    this.setState({newComment: '', replyId: null});
  };

  onChangeText = value => {
    const {replyId} = this.state;
    const {searchTerm, searchIndex} = detectAtPeopleNGroup({
      prevText: this.state.newComment,
      currentText: value,
    });

    // @user
    if (searchTerm[0] == '@') {
      this.setState({searchTerm, searchIndex});
    } else if (
      (searchTerm[0] == 'g' || searchTerm[0] == 'G') &&
      searchTerm[1] == '@'
    ) {
      // g@groupname
      this.setState({searchTerm, searchIndex});
    } else {
      this.setState({searchTerm: '', searchIndex: -1, atSearchResult: []});
    }

    // make sure the numer of lines and length of content is limited
    const isReply = replyId ? true : false;
    const lineCount = value.split(/\r\n|\r|\n/).length;
    const valueSplit = value.substr(0, 1000).split('\n');
    if (isReply) {
      if (lineCount >= 35) {
        this.setState({newComment: valueSplit.slice(0, 35).join('\n')});
        return;
      }
    } else {
      if (lineCount >= 30) {
        this.setState({newComment: valueSplit.slice(0, 30).join('\n')});
        return;
      }
    }

    this.setState({newComment: value.substr(0, 1000)});
  };

  onAtSearch = async () => {
    const {searchTerm} = this.state;
    const {group, searchAtUser, auth, searchAtGroup} = this.props;

    const request = {
      groupId: group.group.id,
      searchTerm:
        searchTerm[0] == '@'
          ? searchTerm.substr(1, searchTerm.length)
          : searchTerm.substr(2, searchTerm.length),
      token: auth.token,
    };

    const result =
      searchTerm[0] == '@'
        ? await searchAtUser(request)
        : await searchAtGroup(request);
    if (result.errors) {
      console.log(result.errors);
      return;
    }

    this.setState({atSearchResult: result, atListShow: result.length > 0});
  };

  onAtPress = item => {
    const {username, id, groupname} = item;
    const {searchIndex, newComment, atListShow} = this.state;

    let updatedComment = newComment.split(' ');
    updatedComment[searchIndex] = username ? `@${username}` : `g@${groupname}`;
    updatedComment = updatedComment.join(' ') + ' ';
    this.setState({
      atSearchResult: [],
      newComment: updatedComment.substr(0, 1000),
      atListShow: false,
    });
  };

  onBackgroundPress = () => {
    this.setState({atListShow: false});
    Keyboard.dismiss();
  };

  inputHeightAdjustment = e => {
    const {newComment, replyId} = this.state;
    const isReply = replyId ? true : false;
    const inputBarWidth = isReply ? width - 100 : width - 50;
    const height = e.nativeEvent.contentSize.height;
    let inputHeight = height + 15;

    // when copy paste large number of text.  More than 5 lines
    if ((newComment.length * 9) / inputBarWidth > 5) {
      inputHeight = 150;
    }

    this.setState(prevState => ({
      inputHeight: inputHeight <= 150 ? inputHeight : prevState.inputHeight,
    }));
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
      atSearchResult,
      replyType,
      replyTo,
      theme,
      atListShow,
      barHeight,
    } = this.state;
    const disabled = newComment.trim().length == 0 || newComment.length > 1000;
    const {navigation, group, comment, route} = this.props;
    const isReply = replyId ? true : false;

    return (
      <ActionSheetProvider
        ref={component => (this._actionSheetRef = component)}>
        <TouchableWithoutFeedback onPress={this.onBackgroundPress}>
          <KeyboardAvoidingView
            style={[container, theme.backgroundColor]}
            behavior={Platform.OS == 'ios' ? 'padding' : 'overflow'}
            keyboardVerticalOffset={35}>

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
              _actionSheetRef={this._actionSheetRef}
              theme={theme}
              from={route ? route.params.from : null}
            />

            {post.allowComment && !modalVisible ? (
              <View style={[styles.inputBarContainer, theme.backgroundColor]}>
                <ReplyIndicator
                  isReply={isReply}
                  inputHeight={inputHeight - 5}
                  onCancelReply={this.onCancelReply}
                  replyType={replyType}
                  replyTo={replyTo}
                />

                <View
                  style={[
                    styles.textInputContainer,
                    {
                      width: isReply ? width - 100 : width - 50,
                      height: Math.max(35, barHeight),
                    },
                  ]}>
                  {atListShow ? (
                    <AtList
                      atSearchResult={atSearchResult}
                      onAtPress={this.onAtPress}
                      theme={theme}
                    />
                  ) : null}
                  <TextInput
                    style={[styles.textInput, theme.textColor]}
                    ref={r => (this.inputRef = r)}
                    placeholder={
                      isReply ? 'Reply a comment ...' : 'Add a comment ...'
                    }
                    placeholderTextColor={'#7f8fa6'}
                    multiline={true}
                    maxLength={1000}
                    onContentSizeChange={e => this.inputHeightAdjustment(e)}
                    onChangeText={this.onChangeText}
                    value={newComment}
                    onEndEditing={() => this.setState({atListShow: false})}
                  />
                </View>
                <SendButton
                  sent={sent}
                  disabled={disabled}
                  onSend={this.onSend}
                  inputHeight={inputHeight - 5}
                />
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
                theme={theme}
              />
            ) : null}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ActionSheetProvider>
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
    alignItems: 'flex-end',
    // position: 'relative',
    bottom: Platform.OS == 'ios' ? 55 : 20,
    justifyContent: 'center',
  },
  textInputContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 1,
    // backgroundColor: 'blue',
    // backgroundColor: 'transparent'
  },
  textInput: {
    maxHeight: 150,
    fontSize: 16,
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    borderRadius: 10,
    padding: 5,
    paddingLeft: 8,
    // backgroundColor: 'blue',
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
    searchAtUser: data => dispatch(searchAtUser(data)),
    searchAtGroup: data => dispatch(searchAtGroup(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Comment);
