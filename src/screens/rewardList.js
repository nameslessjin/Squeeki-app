import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {getGroupReward, deleteGroupReward, getMonthlyGiftCardCount} from '../actions/reward';
import {userLogout} from '../actions/auth';
import {loadGroupRewardsFunc} from '../functions/reward';
import List from '../components/reward/rewardList';
import RewardModal from '../components/reward/rewardModal'

class RewardList extends React.Component {
  state = {
    modalVisible: false,
    remaining_gift_card_count: 0
  };

  componentDidMount() {
    this.loadGroupReward(true, false);
    this.getMonthlyGiftCardCount()
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

  getMonthlyGiftCardCount = async() => {
    const {getMonthlyGiftCardCount, group, auth, userLogout, navigation} = this.props
    const request = {
      token: auth.token,
      groupId: group.group.id
    }

    const req = await getMonthlyGiftCardCount(request);
    if (req.errors) {
      alert('Failed to get remaining monthly giftcards')
      // alert(req.errors[0].message);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.setState({remaining_gift_card_count: req})
  }

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

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onQuestionMarkPress = () => {
    this.setState({modalVisible: true});
  };

  onEndReached = redeemed => {
    this.loadGroupReward(false, redeemed == null ? false : redeemed);
  };

  render() {
    const {reward, group} = this.props;
    const {rewards} = reward;
    const {modalVisible, remaining_gift_card_count} = this.state


    return (
      <View>
        <StatusBar barStyle={'dark-content'} />
        <List
          rewards={rewards}
          auth={group.group.auth}
          onDeleteReward={this.onDeleteReward}
          onEndReached={this.onEndReached}
          loadGroupReward={this.loadGroupReward}
          route={'list'}
          onQuestionMarkPress={this.onQuestionMarkPress}
          remaining_gift_card_count={remaining_gift_card_count}
        />
        <RewardModal modalVisible={modalVisible} onBackdropPress={this.onBackdropPress} />
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
    getMonthlyGiftCardCount: data => dispatch(getMonthlyGiftCardCount(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardList);
