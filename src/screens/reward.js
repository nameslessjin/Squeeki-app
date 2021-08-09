import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {lootRedeemReward, getGroupRewardList} from '../actions/reward';
import {getUserGroupPoint} from '../actions/point';
import RewardList from '../components/reward/rewardList';
import RewardModal from '../components/reward/rewardModal';

const {width, height} = Dimensions.get('screen');

class Reward extends React.Component {
  state = {
    point: 0,
    loading: false,
    modalVisible: false,
    rewardList: [
      {id: '1', listName: 'List 1'},
      {id: '2', listName: 'List 2'},
      {id: '0', listName: 'Redeem List'},
    ],
    result: {
      name: null,
      description: null,
      pointCost: null,
      chanceDisplay: null,
      errorMessage: null,
      image: null,
    },
  };

  componentDidUpdate() {
    const {route, navigation} = this.props;
    if (route.params) {
      const {refresh, groupId} = route.params;
      if (refresh) {
        setTimeout(() => {
          this.getGroupRewardList(groupId);
        }, 100);
        navigation.setParams({refresh: false, groupId: null});
      }
    }
  }

  getGroupRewardList = async groupId => {
    const {auth, group, getGroupRewardList} = this.props;

    const request = {
      token: auth.token,
      groupId: groupId ? groupId : group.group.id,
    };

    const req = await getGroupRewardList(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward list at this time, please try again later');
      return;
    }
  };

  getUserGroupPoint = async () => {
    const {navigation, userLogout, group, auth, getUserGroupPoint} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };
    const req = await getUserGroupPoint(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load points at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  lootRedeemReward = async request => {
    const {lootRedeemReward} = this.props;

    const req = await lootRedeemReward(request);

    if (req.errors) {
      console.log(req.errors);
      alert('An error just occured, please try again later');
      return;
    }

    if (req.errorMessage) {
      alert(req.errorMessage);
      console.log(req);
      return;
    } else {
      console.log('Everything is good');
      console.log(req);
      this.setState({modalVisible: true, result: req});
    }

    this.getGroupRewardList();
    this.getUserGroupPoint();
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onLootRedeemPress = async (type, item) => {
    const {
      id,
      rewardEntryList,
      pointCost,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
    } = item;
    const {point, auth, group} = this.props;
    let request = {};

    // check if there is enough points
    if (point.total_point < pointCost) {
      Alert.alert(
        'Whoops!',
        "You don't have enough points right now, please come back later.",
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ],
      );
      return;
    }

    if (type == 'loot') {
      const GroupRewardList = {
        chance1,
        chance2,
        chance3,
        chance4,
        chance5,
        rewardEntryList: rewardEntryList.map(l => {
          return {chance: parseFloat(l.chance), data: l.data.map(d => d.id)};
        }),
      };
      request = {
        token: auth.token,
        type: 'loot',
        pointCost,
        groupId: group.group.id,
        GroupRewardList,
      };
      Alert.alert(
        'Loot',
        `To loot rewards from this list will cost ${pointCost}pts`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Loot',
            style: 'default',
            onPress: () => this.lootRedeemReward(request),
          },
        ],
      );
    } else {
      request = {
        entryId: id,
        token: auth.token,
        type: 'redeem',
        pointCost,
        groupId: group.group.id,
      };
      Alert.alert(
        'Redeem',
        `To redeem points for the reward will cost ${pointCost}pts`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Redeem',
            style: 'default',
            onPress: () => this.lootRedeemReward(request),
          },
        ],
      );
    }
  };

  render() {
    const {group, reward, navigation, point, auth} = this.props;
    const {modalVisible, result} = this.state;
    const {rewardList} = reward;

    return (
      <View style={[styles.container, {opacity: modalVisible ? 0.5 : 1}]}>
        <StatusBar barStyle={'dark-content'} />

        <RewardList
          rewardList={rewardList}
          navigation={navigation}
          group={group.group}
          onLootRedeemPress={this.onLootRedeemPress}
        />
        <View style={styles.point}>
          <Text>Points: {point.total_point}</Text>
        </View>
        <RewardModal
          modalType={'result'}
          modalVisible={modalVisible}
          result={result}
          onBackdropPress={this.onBackdropPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  point: {
    width: '100%',
    height: 30,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const {group, auth, point, reward} = state;
  return {group, auth, point, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    lootRedeemReward: data => dispatch(lootRedeemReward(data)),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
    getGroupRewardList: data => dispatch(getGroupRewardList(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reward);
