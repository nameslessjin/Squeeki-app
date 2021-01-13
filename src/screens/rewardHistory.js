import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingViewBase,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {loadGroupRewardsFunc} from '../functions/reward';
import {getUserGroupRewardHistory} from '../actions/reward';
import List from '../components/reward/rewardList';

class RewardHistory extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    const {navigation} = this.props
    navigation.setOptions({
      headerTitle: 'History'
    })

    this.loadUserGroupRewardHistory(true);
  }

  loadUserGroupRewardHistory = init => {
    const {
      group,
      auth,
      userLogout,
      navigation,
      getUserGroupRewardHistory,
      reward,
    } = this.props;
    const data = {
      group,
      userLogout,
      auth,
      navigation,
      count: init ? 0 : reward.history_count,
      func: getUserGroupRewardHistory,
    };

    loadGroupRewardsFunc(data);
  };

  onEndReached = () => {
    this.loadUserGroupRewardHistory(false);
  };

  render() {
    const {reward} = this.props;
    const {history} = reward;
    return (
      <View>
        <StatusBar barStyle={'dark-content'} />
        <List rewards={history} onEndReached={this.onEndReached} auth={null} route={'history'}/>
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
    getUserGroupRewardHistory: data =>
      dispatch(getUserGroupRewardHistory(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardHistory);
