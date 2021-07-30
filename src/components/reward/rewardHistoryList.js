import React from 'react';
import {
  FlatList,
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import {dateConversion} from '../../utils/time';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const extractKey = ({id}) => id;

export default class RewardHistoryList extends React.Component {
  renderItem = ({item}) => {
    const {
      name,
      id,
      winner,
      chance,
      pointCost,
      groupDisplayName,
      createdAt,
    } = item;

    if (id == 'header') {
      return (
        <View style={styles.header}>
          <View style={styles.rewardInfoContainer}>
            <Text style={styles.headerText}>Reward</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={[styles.headerText, {color: '#EA2027'}]}>Winner</Text>
          </View>
        </View>
      );
    } else if (id == 'empty') {
      return <View style={styles.empty} />;
    } else {
      const {displayName, icon, userId} = winner;
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.rewardInfoContainer}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>{name}</Text>
              {pointCost ? (
                <Text style={styles.text}>Redeemed For {pointCost}pts</Text>
              ) : (
                <Text style={styles.text}>Loot Chance: {chance}%</Text>
              )}
              <Text style={styles.text}>From: {groupDisplayName}</Text>
              <Text style={styles.text}>
                On: {dateConversion(createdAt, 'reward')}
              </Text>
            </View>
            <View style={styles.userInfoContainer}>
              <Image
                source={icon ? {uri: icon} : singleDefaultIcon()}
                style={styles.userIconStyle}
              />
              <Text style={styles.text}>{displayName}</Text>
            </View>
          </View>
        </View>
      );
    }
  };

  render() {
    const {rewardHistory} = this.props;
    let data = [{id: 'header'}];
    data = data.concat(rewardHistory).concat([{id: 'empty'}]);
    return (
      <FlatList
        keyExtractor={extractKey}
        renderItem={this.renderItem}
        data={data}
        showsVerticalScrollIndicator={false}
        style={{width: '100%', height: '100%'}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 150,
    padding: 10,
  },
  card: {
    width: '100%',
    maxHeight: 130,
    shadowColor: '#000',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 7,
  },
  text: {
    marginTop: 3,
  },
  rewardInfoContainer: {
    width: '70%',
    maxHeight: 130,
  },
  userInfoContainer: {
    width: '30%',
    maxHeight: 130,
    alignItems: 'center',
  },
  userIconStyle: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  header: {
    width: '100%',
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 17,
    flexDirection: 'row',
  },
  empty: {
    width: '100%',
    height: 200,
  },
});
