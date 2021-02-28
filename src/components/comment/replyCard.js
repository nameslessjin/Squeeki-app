import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import ReplyProfile from './ReplyProfile';
import ReplyUsername from './ReplyUsername';
import ReplyFooter from './ReplyFooter';

export default class ReplyCard extends React.Component {
  state = {
    loading: false,
    ...this.props.item,
  };

  onReplyLike = async () => {
    const {onReplyLike} = this.props;
    const {id} = this.state;
    this.setState({loading: true});
    await onReplyLike(id);
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
    const {user, id} = this.state;
    const {onOptionToggle} = this.props;
    onOptionToggle({commentId: id, userId: user.id});
  };

  render() {
    const {
      loading,
      liked,
      likeCount,
      id,
      content,
      createdAt,
      user,
    } = this.state;
    const {onReplyPress, commentId} = this.props;
    const {icon} = user;

    return (
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <ReplyProfile icon={icon} />

          <View style={styles.rightContainer}>
            <ReplyUsername createdAt={createdAt} user={user} />

            <View style={styles.replyContainer}>
              <Text style={styles.replyStyle}>{content}</Text>
            </View>

            <ReplyFooter
              loading={loading}
              onReplyLike={this.onReplyLike}
              liked={liked}
              likeCount={likeCount}
              onOptionToggle={this.onOptionToggle}
              onReplyPress={onReplyPress}
              commentId={commentId}
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
    // minHeight: 100,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  rightContainer: {
    width: '85%',
  },
  replyContainer: {
    width: '100%',
  },
  replyStyle: {
    lineHeight: 20,
  },
});
