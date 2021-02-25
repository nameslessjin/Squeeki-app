import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import CommentProfile from './commentProfile';
import CommentUsername from './commentUsername';
import CommentFooter from './commentFooter';

export default class CommentCard extends React.Component {
  state = {
    comment: this.props.comment,
    loading: false,
    ...this.props.comment,
  };

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

  onOptionToggle = () => {
    const {user, id} = this.state.comment;
    const {onOptionToggle} = this.props;
    onOptionToggle({commentId: id, userId: user.id});
  };

  

  render() {
    const {comment, loading, liked, likeCount} = this.state;
    const {container, commentContainer, rightContainer, commentStyle} = styles;
    const {onCommentReplyPress} = this.props
    const {user} = comment;
    const {icon} = user;
    const {id, content, createdAt} = comment

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

          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 200,
    minHeight: 100,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  commentContainer: {
    width: '100%',
    maxHeight: 100,
  },
  rightContainer: {
    width: '85%',
    maxHeight: 200,
  },
  commentStyle: {
    lineHeight: 20,
  },
});
