import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import {getUserRewardHistory, getReward} from '../actions/reward';
import RewardHistoryList from '../components/reward/rewardHistoryList';

class MyReward extends React.Component {
  componentDidUpdate(prevProps) {
    const {currentScreen} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'MyRewards' &&
      prevScreen.currentScreen != 'MyRewards'
    ) {
      this.loadUserRewardHistory(true);
    }
  }

  loadUserRewardHistory = async init => {
    const {group, getUserRewardHistory, auth, reward} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: init ? 0 : reward.userRewardHistoryCount,
      init,
    };

    const req = await getUserRewardHistory(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward history at this time, please try again later');
      return;
    }
  };

  onEndReached = () => {
    this.loadUserRewardHistory(false);
  };

  getReward = async id => {
    const {getReward, auth, navigation} = this.props;

    const request = {
      token: auth.token,
      rewardId: id,
      isPrivate: true,
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
      isPrivate: true,
    });
  };

  render() {
    const {reward, group} = this.props;
    return (
      <View style={{backgroundColor: 'white'}}>
        {reward.userRewardHistory.length == 0 ? (
          <View style={styles.container}>
            <Text style={styles.text}>You have not won any reward yet</Text>
          </View>
        ) : (
          <RewardHistoryList
            rewardHistory={reward.userRewardHistory || []}
            getReward={this.getReward}
            groupId={group.group.id}
            onEndReached={this.onEndReached}
            type={'user'}
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
  const {group, auth, reward, currentScreen} = state;
  return {group, auth, reward, currentScreen};
};

const mapDispatchToProps = dispatch => {
  return {
    getUserRewardHistory: data => dispatch(getUserRewardHistory(data)),
    userLogout: () => dispatch(userLogout()),
    getReward: data => dispatch(getReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyReward);
