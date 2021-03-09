import React from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';

export default class RankFunction extends React.Component {
  render() {
    const {type, value, onPress} = this.props;
    let name;
    if (type == 'post') {
      name = 'Create Post';
    } else if (type == 'priority1') {
      name = 'Create priority 1 post';
    } else if (type == 'priority2') {
      name = 'Create priority 2 post';
    } else if (type == 'priority3') {
      name = 'Create priority 3 post';
    } else if (type == 'reward') {
      name = 'Loot reward';
    } else if (type == 'member') {
      name = 'Manage member'
    } else if (type == 'nominate') {
      name = 'Nominate peer'
    } else if (type == 'group'){
      name = 'Edit group'
    } else if (type == 'manage_post'){
      name = 'Manage Post'
    } else if (type == 'manage_comment'){
      name = 'Manage Comment'
    } else if (type == 'manage_check_in'){
      name = 'Manage Check-in'
    } else if (type == 'manage_chat'){
      name = 'Manage Chat'
    }

    return (
      <TouchableWithoutFeedback onPress={() => onPress(type)}>
        <View style={styles.container}>
          <Text>{name}</Text>
          <View style={styles.rankContainer}>
            <Text>{value}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  rankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 45,
  },
});
