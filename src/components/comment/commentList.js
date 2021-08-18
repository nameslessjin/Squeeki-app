import React from 'react';
import {FlatList, StyleSheet, View, Text, Platform} from 'react-native';
import CommentCard from './commentCard';
import CommentPost from './commentPost';

const extractKey = ({id}) => id;

export default class CommentList extends React.Component {
  renderItem = ({item}) => {
    const {
      onCommentLike,
      onOptionToggle,
      navigation,
      onCommentReplyPress,
      replyId,
      _actionSheetRef,
    } = this.props;
    if (item.id) {
      if (item.id == 'commentDisabled') {
        return (
          <View style={styles.postOnlyContainer}>
            <Text style={styles.commentDisabled}>Comment Disabled</Text>
          </View>
        );
      }

      if (item.type) {
        return (
          <CommentPost
            post={item}
            option={false}
            navigation={navigation}
            _actionSheetRef={_actionSheetRef}
          />
        );
      }

      return (
        <CommentCard
          comment={item}
          onCommentLike={onCommentLike}
          onOptionToggle={onOptionToggle}
          onCommentReplyPress={onCommentReplyPress}
          replyId={replyId}
          _actionSheetRef={_actionSheetRef}
          navigation={navigation}
        />
      );
    }
    return;
  };

  scrollToTop = () => {
    this.instance.scrollToIndex({
      index: 0,
      viewPosition: 0,
    });
  };

  render() {
    const {
      post,
      comments,
      onEndReached,
      sent,
      navigation,
      replyId,
    } = this.props;
    let data = [];
    if (post.id) {
      if (post.allowComment) {
        data.push(post);
        data = data.concat(comments);
      } else {
        data.push(post);
        data.push({id: 'commentDisabled'});
      }
    }

    if (sent && !replyId) {
      this.scrollToTop(this.instance);
    }

    return (
      <FlatList
        style={styles.container}
        data={data}
        ref={c => (this.instance = c)}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        onEndReached={() => onEndReached()}
        onEndReachedThreshold={0}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    marginBottom: Platform.OS == 'ios' ? 55 : 20,
  },
  postOnlyContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  commentDisabled: {
    marginTop: 100,
    color: 'grey',
    fontStyle: 'italic',
  },
});
