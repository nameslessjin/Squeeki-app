import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width} = Dimensions.get('screen');

export default class NominationResultsCard extends React.Component {
  render() {
    const {
      nominee_name,
      vote,
      total_vote_count,
      max,
      most_recent,
      onPress,
      nomineeId,
      time,
      nominationId,
    } = this.props;
    const percentage = vote / total_vote_count;

    // change vote for large number
    return (
      <TouchableOpacity
        onPress={() =>
          onPress({
            nomineeId: nomineeId,
            time: time,
            nominationId: nominationId,
          })
        }>
        <View style={styles.container}>
          <View style={styles.name_vote}>
            <View style={{maxWidth: width - 140}}>
              <Text>{nominee_name}</Text>
            </View>
            <View style={{maxWidth: 90}}>
              <Text>Vote: {vote}</Text>
            </View>
          </View>
          <View
            style={[
              styles.bar,
              {
                backgroundColor: most_recent
                  ? max
                    ? '#ff7675'
                    : '#c7ecee'
                  : '#b8e994',
                width: percentage * width - 23,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  name_vote: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    minHeight: 40,
    zIndex: 1,
  },
  bar: {
    zIndex: 0,
    minHeight: 40,
    position: 'absolute',
  },
});
