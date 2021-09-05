import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {singleDefaultIcon} from '../../utils/defaultIcon';
import {dateConversion} from '../../utils/time';
import {connect} from 'react-redux';
import {getSingleGroupById} from '../../actions/group';
import {getReward} from '../../actions/reward';

class RewardHistoryCard extends React.Component {
  getGroup = async reward => {
    const {from, fromId, id} = reward;
    const {auth, getSingleGroupById, navigation, prevRoute, group} = this.props;

    if (from == 'group' && fromId) {
      const request = {
        id: fromId,
        token: auth.token,
      };

      const req = await getSingleGroupById(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Cannot load group at this time, please try again later');
        return;
      }

      // log the redirection event on certain route
      // route: RewardHistory, MyGroupRewards, MyRewards
      let log = null;
      if (
        prevRoute == 'RewardHistory' ||
        prevRoute == 'MyGroupRewards' ||
        prevRoute == 'MyRewards'
      ) {
        log = {
          effectId: fromId,
          effectIdType: 'group',
          causeId: id,
          causeIdType: 'reward',
          event: 'redirection_reward_to_group',
        };
      }

      // redirect to group
      navigation.push('GroupNavigator', {
        prevRoute,
        groupId: group.group.id,
        log,
      });
    }
  };

  getReward = async id => {
    const {getReward, auth, navigation, prevRoute} = this.props;

    const request = {
      token: auth.token,
      rewardId: id,
    };

    const req = await getReward(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward detail at this time, please try again later');
      return;
    }

    navigation.navigate('RewardDetail', {
      ...req,
      image: req.image ? {uri: req.image} : null,
      prevRoute,
    });
  };

  render() {
    const {item, theme, prevRoute, groupId, onRedeemPress} = this.props;

    const {
      id,
      name,
      winner,
      chance,
      pointCost,
      groupDisplayName,
      createdAt,
      fromId,
      status,
    } = item;

    let displayName = null;
    let icon = null;
    let userId = null;

    if (prevRoute == 'RewardHistory' || prevRoute == 'RewardManagement' || prevRoute == 'GroupNavigator') {
      displayName = winner.displayName;
      icon = winner.icon;
      userId = winner.userId;
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => this.getReward(id)}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: chance
                  ? parseInt(chance) <= 10
                    ? '#fab1a0'
                    : theme.backgroundColor.backgroundColor
                  : theme.backgroundColor.backgroundColor,
              },
              theme.shadowColor,
            ]}>
            <View style={styles.rewardInfoContainer}>
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: '500',
                    color:
                      parseInt(chance) <= 10 ? 'black' : theme.textColor.color,
                  },
                ]}>
                {name}
              </Text>
              {chance ? (
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
                    },
                  ]}>
                  Chance To Win: {chance}%
                </Text>
              ) : (
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
                    },
                  ]}>
                  Point Cost: {pointCost}pts
                </Text>
              )}

              {prevRoute == 'RewardManagement' ? null : fromId ==
                groupId ? null : (
                <View
                  style={[
                    styles.text,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      color:
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
                    },
                  ]}>
                  <Text
                    style={{
                      color:
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
                    }}>
                    From:{' '}
                  </Text>
                  <TouchableOpacity onPress={() => this.getGroup(item)}>
                    <View style={styles.groupNameTag}>
                      <Text style={{color: 'white'}}>{groupDisplayName}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <Text
                style={[
                  styles.text,
                  {
                    color:
                      parseInt(chance) <= 10 ? 'black' : theme.textColor.color,
                  },
                ]}>
                On: {dateConversion(createdAt, 'reward')}
              </Text>
            </View>
            {prevRoute == 'RewardHistory' || prevRoute == 'GroupNavigator' ? (
              <View style={styles.rightContainer}>
                <Image
                  source={icon ? {uri: icon} : singleDefaultIcon()}
                  style={styles.userIconStyle}
                />
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
                    },
                  ]}>
                  {displayName}
                </Text>
              </View>
            ) : prevRoute == 'RewardManagement' ? (
              <View style={[styles.rightContainer]}>
                <Image
                  source={icon ? {uri: icon} : singleDefaultIcon()}
                  style={[styles.userIconStyle, {height: 40, borderRadius: 20}]}
                />
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
                    },
                  ]}>
                  {displayName}
                </Text>
                <TouchableOpacity
                  onPress={() => onRedeemPress(id)}
                  disabled={status != 'default'}>
                  <View
                    style={[
                      styles.text,
                      status == 'default' ? styles.groupNameTag : null,
                    ]}>
                    <Text
                      style={{
                        color: status == 'default' ? 'white' : 'grey',
                      }}>
                      {status == 'default' ? 'Redeem' : 'Redeemed'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.rightContainer, {justifyContent: 'center'}]}>
                <Text
                  style={{
                    color:
                      status == 'default'
                        ? parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color
                        : 'grey',
                  }}>
                  {status == 'default' ? 'Available' : 'Redeemed'}
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 200,
    padding: 10,
  },
  card: {
    width: '100%',
    maxHeight: 180,
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
  rewardInfoContainer: {
    width: '70%',
    maxHeight: 180,
  },
  text: {
    marginTop: 3,
  },
  groupNameTag: {
    backgroundColor: '#1e90ff',
    borderRadius: 7,
    padding: 2,
    paddingHorizontal: 5,
  },
  rightContainer: {
    width: '30%',
    maxHeight: 180,
    alignItems: 'center',
  },
  userIconStyle: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
    getReward: data => dispatch(getReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardHistoryCard);
