import React from 'react';
import {
  FlatList,
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
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
      fromId,
      status,
    } = item;

    const {getReward, groupId, type} = this.props;
    let displayName = null;
    let icon = null;
    let userId = null;

    if (id == 'header') {
      return (
        <View style={styles.header}>
          <View style={styles.rewardInfoContainer}>
            <Text style={styles.headerText}>Reward</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.headerText, {color: '#EA2027'}]}>Winner</Text>
          </View>
        </View>
      );
    } else if (id == 'empty') {
      return <View style={styles.empty} />;
    } else {
      if (type == 'group') {
        displayName = winner.displayName;
        icon = winner.icon;
        userId = winner.userId;
      }

      return (
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={() => getReward(id)}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: chance
                    ? parseInt(chance) <= 10
                      ? '#fab1a0'
                      : 'white'
                    : 'white',
                },
              ]}>
              <View style={styles.rewardInfoContainer}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>{name}</Text>
                {chance ? (
                  <Text style={styles.text}>Chance To Win: {chance}%</Text>
                ) : (
                  <Text style={styles.text}>Point Cost: {pointCost}pts</Text>
                )}
                {fromId == groupId ? (
                  <Text style={styles.text}>Group: {groupDisplayName}</Text>
                ) : (
                  <View style={{flexDirection: 'row', marginTop: 3}}>
                    <Text>Group: </Text>
                    <TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: '#1e90ff',
                          borderRadius: 5,
                          padding: 2,
                        }}>
                        <Text style={{color: 'white'}}>{groupDisplayName}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.text}>
                  On: {dateConversion(createdAt, 'reward')}
                </Text>
              </View>
              {type == 'group' ? (
                <View style={styles.rightContainer}>
                  <Image
                    source={icon ? {uri: icon} : singleDefaultIcon()}
                    style={styles.userIconStyle}
                  />
                  <Text style={styles.text}>{displayName}</Text>
                </View>
              ) : (
                <View
                  style={[styles.rightContainer, {justifyContent: 'center'}]}>
                  <Text style={{color: status == 'default' ? 'black' : 'grey'}}>
                    {status == 'default' ? 'Available' : 'Used'}
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
  };

  render() {
    const {rewardHistory, onEndReached, type} = this.props;

    let data = [...rewardHistory];

    if (type == 'group') {
      data = [{id: 'header'}].concat(data).concat([{id: 'empty'}]);
    } else if (type == 'user') {
      data = data.concat([{id: 'empty'}]);
    }

    return (
      <FlatList
        keyExtractor={extractKey}
        renderItem={this.renderItem}
        data={data}
        showsVerticalScrollIndicator={false}
        style={{width: '100%', height: '100%'}}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
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
  rightContainer: {
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
