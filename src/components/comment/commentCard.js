import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import CommentProfile from './commentProfile';
import CommentUsername from './commentUsername';
import CommentFooter from './commentFooter';
import ReplyList from './replyList';
import {connect} from 'react-redux';
import {getReplies} from '../../actions/comment';
import ParsedText from 'react-native-parsed-text';
import {
  onUrlPress,
  onLinkPhoneLongPress,
  renderText,
  onPhonePress,
  onEmailPress,
} from '../chat/render';
import {getSingleGroupById} from '../../actions/group';
import {getTheme} from '../../utils/theme';

class CommentCard extends React.Component {
  state = {
    comment: this.props.comment,
    loading: false,
    ...this.props.comment,
    reply_loading: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    this._actionSheetRef = undefined;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.comment != this.props.comment) {
      this.setState(prevState => {
        return {
          ...prevState,
          ...this.props.comment,
        };
      });
    }
  }

  onCommentLike = async () => {
    const {onCommentLike, comment} = this.props;

    this.setState({loading: true});
    await onCommentLike(comment.id);
    this.setState({loading: false});

    this.setState(prevState => {
      return {
        ...prevState,
        liked: !prevState.liked,
        likeCount: prevState.liked
          ? prevState.likeCount - 1
          : prevState.likeCount + 1,
      };
    });
  };

  onGetReplies = async () => {
    const {auth, getReplies, postId} = this.props;
    const request = {
      token: auth.token,
      count: this.state.reply ? this.state.reply.replies.length : 0,
      postId: postId,
      replyId: this.state.id,
      commentId: null,
    };

    this.setState({reply_loading: true});
    const req = await getReplies(request);

    if (req.errors) {
      console.log(req.errors[0].message);
      alert('Cannot get replies at this time, please try again later');
      this.setState({reply_loading: false});
      return;
    }
    this.setState({reply_loading: false});
  };

  onOptionToggle = () => {
    const {user, id} = this.state.comment;
    const {onOptionToggle} = this.props;
    onOptionToggle({commentId: id, userId: user.id});
  };

  getGroup = async (id, replyId) => {
    const {auth, getSingleGroupById, navigation, group} = this.props;
    const request = {
      id,
      token: auth.token,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      alert('Cannot load group at this time, please try again later');
      return;
    }

    // create user event log
    const log = {
      trigger: 'comment',
      triggerId: replyId ? replyId : this.state.id,
      event: 'redirection_comment_at_group',
      effectIdType: 'group',
      effectId: id,
    };

    navigation.push('GroupNavigator', {
      prevRoute: 'Comment',
      groupId: group.group.id,
      log
    });
  };

  onAtUserNGroupHightlightPress = (content, replyId) => {
    const components = content.substr(1, content.length - 2).split(':');

    const atText = components[0];
    const displayName = components[1];
    const id = components[2];

    // @username check
    if (atText[0] == '@') {
      // this.onPressAvatar({_id: id});
    } else if (atText[0] == 'g' && atText[1] == '@') {
      // g@groupname check
      this.getGroup(id, replyId);
    }
  };

  render() {
    const {
      loading,
      liked,
      likeCount,
      reply_loading,
      reply,
      num_of_replies,
      id,
      content,
      createdAt,
      user,
      theme,
    } = this.state;

    const {container, commentContainer, rightContainer, commentStyle} = styles;
    const {
      onCommentReplyPress,
      onCommentLike,
      onOptionToggle,
      _actionSheetRef,
    } = this.props;
    let replies = [];
    if (num_of_replies > 0 && reply) {
      replies = reply.replies;
    }
    const {icon} = user;

    return (
      <TouchableWithoutFeedback>
        <View style={container}>
          <CommentProfile icon={icon} />

          <View style={rightContainer}>
            <CommentUsername createdAt={createdAt} user={user} theme={theme} />

            <View style={commentContainer}>
              <ParsedText
                style={[commentStyle, theme.textColor]}
                parse={[
                  {
                    type: 'url',
                    style: {color: '#1e90ff'},
                    onPress: onUrlPress,
                    onLongPress: url =>
                      onLinkPhoneLongPress({type: 'url', content: url}),
                  },
                  {
                    type: 'phone',
                    style: {color: '#1e90ff'},
                    onPress: phone => onPhonePress({phone, ..._actionSheetRef}),
                    onLongPress: phone =>
                      onLinkPhoneLongPress({type: 'phone', content: phone}),
                  },
                  {
                    type: 'email',
                    style: {color: '#1e90ff'},
                    onPress: onEmailPress,
                    onLongPress: email =>
                      onLinkPhoneLongPress({type: 'email', content: email}),
                  },
                  {
                    pattern: /\[(@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
                    style: {color: '#1e90ff'},
                    renderText: renderText,
                  },
                  {
                    pattern: /\[(g@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
                    style: {color: '#1e90ff', fontWeight: '500'},
                    renderText: renderText,
                    onPress: m => this.onAtUserNGroupHightlightPress(m),
                  },
                ]}
                childrenProps={{allowFontScaling: false}}>
                {content}
              </ParsedText>
            </View>

            <CommentFooter
              loading={loading}
              onCommentLike={this.onCommentLike}
              liked={liked}
              likeCount={likeCount}
              onOptionToggle={this.onOptionToggle}
              onCommentReplyPress={onCommentReplyPress}
              commentId={id}
              user={user}
              theme={theme}
            />

            <ReplyList
              replies={replies}
              onReplyLike={onCommentLike}
              onOptionToggle={onOptionToggle}
              onReplyPress={onCommentReplyPress}
              commentId={id}
              _actionSheetRef={_actionSheetRef}
              onAtUserNGroupHightlightPress={this.onAtUserNGroupHightlightPress}
              theme={theme}
            />

            {/* //reply list */}
            {replies.length < num_of_replies ? (
              reply_loading ? (
                <ActivityIndicator animating={true} color={'grey'} />
              ) : (
                <TouchableOpacity onPress={this.onGetReplies}>
                  <View
                    style={{
                      width: '100%',
                      marginTop: 5,
                    }}>
                    <Text style={{color: 'grey'}}>View more replies</Text>
                  </View>
                </TouchableOpacity>
              )
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  const {comment, auth, group} = state;
  return {postId: comment.postId, auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    getReplies: data => dispatch(getReplies(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
  };
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 100,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
    // get rid of margin
    marginVertical: 10,
  },
  commentContainer: {
    width: '100%',
  },
  rightContainer: {
    width: '85%',
  },
  commentStyle: {
    lineHeight: 20,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentCard);
