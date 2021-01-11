import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {getGroupReward, deleteGroupReward} from '../actions/reward';
import {userLogout} from '../actions/auth';
import {loadGroupRewardsFunc} from '../functions/reward';
import List from '../components/reward/rewardList';

class RewardList extends React.Component {
  componentDidMount() {
    this.loadGroupReward(true, false);
  }

  loadGroupReward = (init, redeemed) => {
    const {
      group,
      auth,
      userLogout,
      navigation,
      getGroupReward,
      reward,
    } = this.props;
    const data = {
      group,
      userLogout,
      auth,
      navigation,
      count: init ? 0 : reward.count,
      func: getGroupReward,
      redeemed: redeemed,
    };

    loadGroupRewardsFunc(data);
  };

  onDeleteReward = async rewardId => {
    const {auth, deleteGroupReward, userLogout, navigation} = this.props;
    const request = {
      token: auth.token,
      rewardId: rewardId,
    };

    const req = await deleteGroupReward(request);
    if (req.errors) {
      alert(req.errors[0].message);
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

  onEndReached = redeemed => {
    this.loadGroupReward(false, redeemed == null ? false : redeemed);
  };

  render() {
    const {reward, group} = this.props;
    const {rewards} = reward;

    return (
      <View>
        <StatusBar barStyle={'dark-content'} />
        <List
          rewards={rewards}
          auth={group.group.auth}
          onDeleteReward={this.onDeleteReward}
          onEndReached={this.onEndReached}
          loadGroupReward={this.loadGroupReward}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {group, auth, reward} = state;
  return {group, auth, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupReward: data => dispatch(getGroupReward(data)),
    userLogout: () => dispatch(userLogout()),
    deleteGroupReward: data => dispatch(deleteGroupReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardList);
