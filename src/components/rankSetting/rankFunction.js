import React from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';

export default class RankFunction extends React.Component {
  render() {
    const {type, value, onPress} = this.props;
    let name;
    if (type == 'post') {
      name = 'Create Post rank';
    } else if (type == 'priority1') {
      name = 'Create priority 1 rank';
    } else if (type == 'priority2') {
      name = 'Create priority 2 rank';
    } else if (type == 'priority3') {
      name = 'Create priority 3 rank';
    } else if (type == 'reward') {
      name = 'Loot reward rank';
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
