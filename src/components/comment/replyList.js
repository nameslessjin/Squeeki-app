import React from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import ReplyCard from './replyCard';

const extractKey = ({id}) => id;

export default class ReplyList extends React.Component {
  renderItem = ({item}) => {
    const {onReplyLike, onOptionToggle, navigation, onReplyPress, commentId} = this.props;

    // return with item
    return (
      <ReplyCard
        item={item}
        onReplyLike={onReplyLike}
        onOptionToggle={onOptionToggle}
        navigation={navigation}
        onReplyPress={onReplyPress}
        commentId={commentId}
      />
    );
  };

  render() {
    const {replies} = this.props;

    return (
      <FlatList
        style={{
          borderLeftWidth: StyleSheet.hairlineWidth,
          borderLeftColor: 'grey',
        }}
        data={replies}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
