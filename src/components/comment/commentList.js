import React from 'react';
import {FlatList, StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback} from 'react-native';
import CommentCard from './commentCard';
import CommentPost from './commentPost';

const extractKey = ({id}) => id;

export default class CommentList extends React.Component {
  renderItem = ({item}) => {

    const {onCommentLike, onOptionToggle} = this.props

    if (item.id) {
      if (item.type) {
        return <CommentPost post={item} option={false} />;
      }
      return <CommentCard comment={item} onCommentLike={onCommentLike} onOptionToggle={onOptionToggle} />;
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
    const {post, comments, onEndReached, sent} = this.props;
    let data = [];
    if (post.id) {
      if (post.allowComment) {
        data.push(post);
        data = data.concat(comments);
      }
    } else {
      return null
    }

    if (sent) {
      this.scrollToTop(this.instance);
    }


    return post.allowComment ? (
      <FlatList
        style={styles.container}
        data={data}
        ref={c => (this.instance = c)}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        onEndReached={() => onEndReached()}
        onEndReachedThreshold={0.1}
      />
    ) : (
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <CommentPost post={post} option={false} />
        <Text style={styles.commentDisabled}>Comment disabled</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
