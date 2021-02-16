import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import PostCard from '../posts/postCard';

export default class CommentPost extends React.Component {
  render() {
    const {post, option, navigation} = this.props;
    return <PostCard item={post} commentTouchable={false} option={option} navigation={navigation} prev_route={'comment'} />;
  }
}

const styles = StyleSheet.create({});
