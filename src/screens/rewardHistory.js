import React from 'react';
import {StyleSheet, View, StatusBar, Text} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getGroupRewardHistory} from '../actions/reward';
import RewardHistoryList from '../components/reward/rewardHistoryList';
import {getTheme} from '../utils/theme'

class RewardHistory extends React.Component {
  state = {
    loading: false,
    theme: getTheme(this.props.auth.user.theme)
  };

  componentDidMount() {
    const {navigation} = this.props;
    this.loadGroupRewardHistory(true);
  }

  componentDidUpdate() {
    const {route, navigation} = this.props;
    if (route.params) {
      const {refresh, groupId} = route.params;
      if (refresh) {
        setTimeout(() => {
          this.loadGroupRewardHistory(true, groupId);
        }, 100);
        navigation.setParams({refresh: false, groupId: null});
      }
    }
  }

  loadGroupRewardHistory = async (init, groupId) => {
    const {group, getGroupRewardHistory, auth, reward} = this.props;

    const request = {
      token: auth.token,
      groupId: groupId ? groupId : group.group.id,
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

  onEndReached = () => {
    this.loadGroupRewardHistory(false);
  };

  render() {
    const {reward, group, navigation} = this.props;
    const {theme} = this.state
    return (
      <View style={[{backgroundColor: 'white'}, theme.greyArea]}>
        <StatusBar barStyle={'dark-content'} />
        {reward.groupRewardHistory.length == 0 ? (
          <View style={styles.container}>
            <Text style={[styles.text, theme.textColor]}>No one has won any reward yet</Text>
          </View>
        ) : (
          <RewardHistoryList
            rewardHistory={reward.groupRewardHistory || []}
            groupId={group.group.id}
            onEndReached={this.onEndReached}
            navigation={navigation}
            prevRoute={'RewardHistory'}
            theme={theme}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardHistory);
