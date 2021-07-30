import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getGroupRewardHistory} from '../actions/reward';
import RewardHistoryList from '../components/reward/rewardHistoryList';

class RewardHistory extends React.Component {
  state = {
    loading: false,
    count: 0,
    reward: [],
  };

  componentDidMount() {
    const {navigation} = this.props;
    // console.log('reward history launched');
    this.loadGroupRewardHistory(true);
  }

  loadGroupRewardHistory = async init => {
    const {count} = this.state;
    const {group, getGroupRewardHistory, auth} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: init ? 0 : count,
      init,
    };

    const req = await getGroupRewardHistory(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward history at this time, please try again later');
      return;
    }
  };

  onEndReached = () => {
    // this.loadGroupRewardHistory(false);
  };

  render() {
    const {reward} = this.props;

    console.log(reward.rewardHistory)
    return (
      <View style={{backgroundColor: 'white'}}>
        <StatusBar barStyle={'dark-content'} />
        <RewardHistoryList rewardHistory={reward.rewardHistory || []} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  const {group, auth, reward} = state;
  return {group, auth, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupRewardHistory: data => dispatch(getGroupRewardHistory(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardHistory);
