import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {lootReward} from '../actions/reward';
import {getUserGroupPoint} from '../actions/point';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RewardList from '../components/reward/rewardList';

const {width, height} = Dimensions.get('screen');

class Reward extends React.Component {
  state = {
    point: 0,
    loading: false,
    rewardList: [
      {id: '1', listName: 'List 1'},
      {id: '2', listName: 'List 2'},
      {id: '3', listName: 'List 3'},
    ],
  };

  componentDidMount() {
    const {point} = this.props;
    this.setState({point: point.total_point});
  }

  componentWillUnmount() {
    // get group points
    // this.getUserGroupPoint();
  }

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

  lootReward = async () => {
    const {lootReward, navigation, userLogout, group, auth} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await lootReward(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot loot reward at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({reward: req.reward, point: req.total_point});
  };

  onLootPress = async () => {
    this.setState({loading: true});
    // function loot measure
    await this.lootReward();
    this.setState({loading: false});
  };

  onSettingPress = async list => {
    const {navigation} = this.props;
    const chanceNameList = list.rewardEntryList.map(l => l.title);
    const updateList = {
      listName: list.listName,
      chance1: list.chance1.toString(),
      chance2: list.chance2.toString(),
      chance3: list.chance3.toString(),
      chance4: list.chance4.toString(),
      chance5: list.chance5.toString(),
      chance1Name: chanceNameList[0],
      chance2Name: chanceNameList[1],
      chance3Name: chanceNameList[2],
      chance4Name: chanceNameList[3],
      chance5Name: chanceNameList[4],
    };


    navigation.navigate('RewardListSetting', {
      list: updateList,
    });
  };

  render() {
    const {group, reward, navigation} = this.props;
    const {point, loading} = this.state;
    const {auth, rank_setting} = group.group;
    const {rewardList} = reward;

    // const disabled =
    //   loading || point < 100 || rank_setting.reward_rank_required < auth.rank;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <RewardList
          rewardList={rewardList}
          onSettingPress={this.onSettingPress}
          navigation={navigation}
        />
        <View style={{width: '100%', height: 20, marginBottom: 5}} />
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
});

const mapStateToProps = state => {
  const {group, auth, point, reward} = state;
  return {group, auth, point, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    lootReward: data => dispatch(lootReward(data)),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reward);
