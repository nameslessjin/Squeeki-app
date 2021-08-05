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
    console.log(reward);
    const {auth, getSingleGroupById, navigation} = this.props;

    // if (from == 'group' && fromId) {
    //   const request = {
    //     id: fromId,
    //     token: auth.token,
    //   };

    //   const req = await getSingleGroupById(request);
    //   this.setState({directToGroup: true});
    //   if (req.errors) {
    //     console.log(req.errors);
    //     alert('Cannot load group at this time, please try again later');
    //     return;
    //   }

    //   navigation.navigate('GroupNavigator');
    // }
  };

  getReward = async id => {
    const {getReward, auth, navigation, isPrivate, prevRoute} = this.props;

    const request = {
      token: auth.token,
      rewardId: id,
      isPrivate,
    };

    const req = await getReward(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward detail at this time, please try again later');
      return;
    }

    navigation.navigate('RewardDetailView', {
      ...req,
      image: req.image ? {uri: req.image} : null,
      prevRoute,
      isPrivate,
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

    const {groupId, type, onRedeemPress} = this.props;
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
      if (type == 'group' || type == 'management') {
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

                {type == 'management' ? null : fromId == groupId ? (
                  <Text style={styles.text}>Group: {groupDisplayName}</Text>
                ) : (
                  <View
                    style={[
                      styles.text,
                      {flexDirection: 'row', alignItems: 'center'},
                    ]}>
                    <Text>Group: </Text>
                    <TouchableOpacity onPress={() => this.getGroup(item)}>
                      <View style={styles.groupNameTag}>
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
              ) : type == 'management' ? (
                <View style={[styles.rightContainer]}>
                  <Image
                    source={icon ? {uri: icon} : singleDefaultIcon()}
                    style={[
                      styles.userIconStyle,
                      {height: 40, borderRadius: 20},
                    ]}
                  />
                  <Text style={styles.text}>{displayName}</Text>
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
                          color: status == 'default' ? 'white' : 'black',
                        }}>
                        {status == 'default' ? 'Redeem' : 'Redeemed'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[styles.rightContainer, {justifyContent: 'center'}]}>
                  <Text style={{color: status == 'default' ? 'black' : 'grey'}}>
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
    const {rewardHistory, onEndReached, type} = this.props;

    let data = [...rewardHistory];

    if (type == 'group') {
      data = [{id: 'header'}].concat(data).concat([{id: 'empty'}]);
    } else if (type == 'user') {
      data = data.concat([{id: 'empty'}]);
    } else if (type == 'management') {
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
