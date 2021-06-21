import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import PostCard from '../posts/postCard';

export default class CommentPost extends React.Component {
  render() {
    const {post, option, navigation, _actionSheetRef} = this.props;
    return (
      <PostCard
        item={post}
        commentTouchable={false}
        option={option}
        navigation={navigation}
        prev_route={'comment'}
        _actionSheetRef={_actionSheetRef}
      />
    );
  }
}

const styles = StyleSheet.create({});
