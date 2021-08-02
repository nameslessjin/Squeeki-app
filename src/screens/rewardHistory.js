import React from 'react';
import {StyleSheet, View, StatusBar, Text} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getGroupRewardHistory, getReward} from '../actions/reward';
import RewardHistoryList from '../components/reward/rewardHistoryList';

class RewardHistory extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    this.loadGroupRewardHistory(true);
  }

  loadGroupRewardHistory = async init => {
    const {group, getGroupRewardHistory, auth, reward} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: init ? 0 : reward.groupRewardHistoryCount,
      init,
    };

    const req = await getGroupRewardHistory(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward history at this time, please try again later');
      return;
    }
  };

  getReward = async id => {
    const {getReward, auth, navigation} = this.props;

    const request = {
      token: auth.token,
      rewardId: id,
      isPrivate: false,
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
      prevRoute: 'history',
      isPrivate: false,
    });
  };

  onEndReached = () => {
    this.loadGroupRewardHistory(false);
  };

  render() {
    const {reward, group} = this.props;

    return (
      <View style={{backgroundColor: 'white'}}>
        <StatusBar barStyle={'dark-content'} />
        {reward.groupRewardHistory.length == 0 ? (
          <View style={styles.container}>
            <Text style={styles.text}>No one has won any reward yet</Text>
          </View>
        ) : (
          <RewardHistoryList
            rewardHistory={reward.groupRewardHistory || []}
            getReward={this.getReward}
            groupId={group.group.id}
            onEndReached={this.onEndReached}
            type={'group'}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  text: {
    fontStyle: 'italic',
    marginTop: 200,
    color: 'grey',
  },
});

const mapStateToProps = state => {
  const {group, auth, reward} = state;
  return {group, auth, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupRewardHistory: data => dispatch(getGroupRewardHistory(data)),
    userLogout: () => dispatch(userLogout()),
    getReward: data => dispatch(getReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardHistory);
