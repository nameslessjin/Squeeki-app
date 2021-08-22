import React from 'react';
import {
  FlatList,
  View,
  TouchableWithoutFeedback,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {dateConversion} from '../../utils/time';
import {singleDefaultIcon} from '../../utils/defaultIcon';
import {getSingleGroupById} from '../../actions/group';
import {getReward} from '../../actions/reward';
import {connect} from 'react-redux';

const extractKey = ({id}) => id;

class RewardHistoryList extends React.Component {
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

    const {groupId, onRedeemPress, prevRoute, theme} = this.props;
    let displayName = null;
    let icon = null;
    let userId = null;

    if (id == 'header') {
      return (
        <View style={styles.header}>
          <View style={styles.rewardInfoContainer}>
            <Text style={[styles.headerText, theme.textColor]}>Reward</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.headerText, {color: '#EA2027'}]}>Winner</Text>
          </View>
        </View>
      );
    } else if (id == 'empty') {
      return <View style={styles.empty} />;
    } else {
      if (prevRoute == 'RewardHistory' || prevRoute == 'RewardManagement') {
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
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
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
                        parseInt(chance) <= 10
                          ? 'black'
                          : theme.textColor.color,
                    },
                  ]}>
                  On: {dateConversion(createdAt, 'reward')}
                </Text>
              </View>
              {prevRoute == 'RewardHistory' ? (
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
                    style={[
                      styles.userIconStyle,
                      {height: 40, borderRadius: 20},
                    ]}
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
                <View
                  style={[styles.rightContainer, {justifyContent: 'center'}]}>
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
  };

  render() {
    const {rewardHistory, onEndReached, prevRoute} = this.props;

    let data = [...rewardHistory];

    if (prevRoute == 'RewardHistory') {
      data = [{id: 'header'}].concat(data).concat([{id: 'empty'}]);
    } else {
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
  text: {
    marginTop: 3,
  },
  rewardInfoContainer: {
    width: '70%',
    maxHeight: 180,
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
  groupNameTag: {
    backgroundColor: '#1e90ff',
    borderRadius: 7,
    padding: 2,
    paddingHorizontal: 5,
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
)(RewardHistoryList);
