import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import PostCard from '../posts/postCard';

export default class CommentPost extends React.Component {
  render() {
    const {post, option} = this.props;
    return <PostCard item={post} commentTouchable={false} option={option} />;
  }
}

const styles = StyleSheet.create({});
