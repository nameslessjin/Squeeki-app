import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import Card from './responseCard';

const extractKey = ({userId}) => userId;

export default class TaskResponseList extends React.Component {
  renderItem = ({item}) => {
    const {onPress} = this.props
    return <Card {...item} onPress={onPress} />;
  };

  render() {
    const {taskResponse, onEndReached} = this.props;
    return (
      <FlatList
        data={taskResponse}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReached}
      />
    );
  }
}
