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

class CommentCard extends React.Component {
  state = {
    comment: this.props.comment,
    loading: false,
    ...this.props.comment,
    reply_loading: false,
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
            <CommentUsername createdAt={createdAt} user={user} />

            <View style={commentContainer}>
              <ParsedText
                style={commentStyle}
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
            />

            <ReplyList
              replies={replies}
              onReplyLike={onCommentLike}
              onOptionToggle={onOptionToggle}
              onReplyPress={onCommentReplyPress}
              commentId={id}
              _actionSheetRef={_actionSheetRef}
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
  const {comment, auth} = state;
  return {postId: comment.postId, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getReplies: data => dispatch(getReplies(data)),
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
