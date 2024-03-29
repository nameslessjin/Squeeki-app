import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import PostCard from '../posts/postCard';

export default class CommentPost extends React.Component {
  render() {
    const {post, option, navigation, _actionSheetRef, from} = this.props;
    return (
      <PostCard
        item={post}
        commentTouchable={false}
        option={option}
        navigation={navigation}
        prevRoute={'Comment'}
        from={from}
        _actionSheetRef={_actionSheetRef}
      />
    );
  }
}

const styles = StyleSheet.create({});
