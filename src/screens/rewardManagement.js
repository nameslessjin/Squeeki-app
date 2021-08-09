import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import SearchBar from '../components/reward/rewardSearchBar';
import {searchReward, redeemUserReward} from '../actions/reward';
import RewardHistoryList from '../components/reward/rewardHistoryList';

class RewardManagement extends React.Component {
  state = {
    searchTerm: '',
    rewardList: [],
    count: 0,
  };

  onChange = async text => {
    const term = text.trim();
    this.setState({searchTerm: text});
    if (term.length < 3) {
      this.setState({rewardList: [], count: 0});
      return;
    }

    this.onSearchReward(true, term);
  };

  onSearchReward = async (init, term) => {
    const {auth, group, searchReward} = this.props;
    const {searchTerm} = this.state;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: init ? 0 : this.state.count,
      searchTerm: term ? term : searchTerm.trim(),
    };

    const req = await searchReward(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot search rewards at this time, please try again later');
      return;
    }

    this.setState(prevState => ({
      count: req.count,
      rewardList: init ? req.reward : prevState.rewardList.concat(req.reward),
    }));
  };

  onEndReached = () => {
    this.onSearchReward(false);
  };

  redeemUserReward = async id => {
    const {redeemUserReward, auth, group} = this.props;

    const request = {
      token: auth.token,
      rewardId: id,
    };

    const hasRewardManagementAuthority = group.group.auth
      ? group.group.auth.rank <=
        group.group.rank_setting.manage_reward_rank_required
      : false;

    if (!hasRewardManagementAuthority) {
      alert(
        'Your current rank is below allowed rank to manage rewards, please check with the group owner',
      );
      return;
    }

    const req = await redeemUserReward(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot redeem user reward at this time, please try again later');
      return;
    }

    this.setState(prevState => {
      return {
        rewardList: prevState.rewardList.map(r => {
          if (r.id == id) {
            return {
              ...r,
              status: 'redeemed',
            };
          }
          return r;
        }),
      };
    });
  };

  onRedeemPress = id => {
    Alert.alert(
      'Redeem Reward',
      'Redeem this reward for user after providing the described product or service',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          style: 'default',
          onPress: () => this.redeemUserReward(id),
        },
      ],
    );
  };

  render() {
    const {searchTerm, rewardList} = this.state;
    const {group, navigation} = this.props;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.optionArea}>
            <SearchBar onChange={this.onChange} value={searchTerm} />
          </View>
          <RewardHistoryList
            rewardHistory={rewardList || []}
            groupId={group.group.id}
            navigation={navigation}
            onEndReached={this.onEndReached}
            onRedeemPress={this.onRedeemPress}
            prevRoute={'RewardManagement'}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  optionArea: {
    width: '90%',
    height: '5%',
    marginTop: '3%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS == 'ios' ? 10 : 20,
    // backgroundColor: 'white'
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    searchReward: data => dispatch(searchReward(data)),
    redeemUserReward: data => dispatch(redeemUserReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardManagement);
