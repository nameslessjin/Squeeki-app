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

class CommentCard extends React.Component {
  state = {
    comment: this.props.comment,
    loading: false,
    ...this.props.comment,
    reply_loading: false,
  };

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
    const {replies, count} = this.state.reply
    const request = {
      token: auth.token,
      count: replies.length,
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
    const {onCommentReplyPress, onCommentLike, onOptionToggle} = this.props;
    const {replies} = reply;
    const {icon} = user;

    return (
      <TouchableWithoutFeedback>
        <View style={container}>
          <CommentProfile icon={icon} />

          <View style={rightContainer}>
            <CommentUsername createdAt={createdAt} user={user} />

            <View style={commentContainer}>
              <Text style={commentStyle}>{content}</Text>
            </View>

            <CommentFooter
              loading={loading}
              onCommentLike={this.onCommentLike}
              liked={liked}
              likeCount={likeCount}
              onOptionToggle={this.onOptionToggle}
              onCommentReplyPress={onCommentReplyPress}
              commentId={id}
            />

            <ReplyList
              replies={replies}
              onReplyLike={onCommentLike}
              onOptionToggle={onOptionToggle}
              onReplyPress={onCommentReplyPress}
              commentId={id}
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
