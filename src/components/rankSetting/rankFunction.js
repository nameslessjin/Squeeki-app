import React from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('screen')

export default class RankFunction extends React.Component {
  render() {
    const {type, value, onPress, rankName} = this.props;
    let name;
    if (type == 'post') {
      name = 'Create Post';
    } else if (type == 'priority1') {
      name = 'Create priority 1 post';
    } else if (type == 'priority2') {
      name = 'Create priority 2 post';
    } else if (type == 'priority3') {
      name = 'Create priority 3 post';
    } else if (type == 'manage_reward') {
      name = 'Manage reward';
    } else if (type == 'member') {
      name = 'Manage member';
    } else if (type == 'nominate') {
      name = 'Nominate peer';
    } else if (type == 'group') {
      name = 'Edit group';
    } else if (type == 'manage_post') {
      name = 'Manage Post';
    } else if (type == 'manage_comment') {
      name = 'Manage Comment';
    } else if (type == 'manage_check_in') {
      name = 'Manage Check-in';
    } else if (type == 'manage_chat') {
      name = 'Manage Chat';
    } else if (type == 'manage_task') {
      name = 'Manage Task';
    }

    let rankTitle = rankName.rank1Name;
    if (value == 1) {
      rankTitle = rankName.rank1Name;
    } else if (value == 2) {
      rankTitle = rankName.rank2Name;
    } else if (value == 3) {
      rankTitle = rankName.rank3Name;
    } else if (value == 4) {
      rankTitle = rankName.rank4Name;
    } else if (value == 5) {
      rankTitle = rankName.rank5Name;
    } else if (value == 6) {
      rankTitle = rankName.rank6Name;
    } else if (value == 7) {
      rankTitle = rankName.rank7Name;
    }

    return (
      <TouchableWithoutFeedback onPress={() => onPress(type)}>
        <View style={styles.container}>
          <Text style={styles.text}>{name}</Text>
          <View style={styles.rankContainer}>
            <Text>{rankTitle}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 45,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  text: {
    width: width * 0.4
  },
  rankContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 45,
    width: width * 0.6 - 15,
  },
});
