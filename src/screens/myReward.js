import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';
import {getUserRewardHistory} from '../actions/reward';
import RewardHistoryList from '../components/reward/rewardHistoryList';
import {getTheme} from '../utils/theme';
class MyReward extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidUpdate(prevProps) {
    const {currentScreen, route, navigation, auth} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'MyRewards' &&
      prevScreen.currentScreen != 'MyRewards'
    ) {
      this.loadUserRewardHistory(true);
    }

    if (route.params) {
      const {refresh, groupId} = route.params;
      if (refresh) {
        // setTimeout(() => {
        //   this.loadUserRewardHistory(true, groupId);
        // }, 100);
        this.loadUserRewardHistory(true, groupId);
        navigation.setParams({refresh: false, groupId: null});
      }
    }

    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: theme.backgroundColor,
        headerTintColor: theme.textColor.color,
      });
    }
  }

  loadUserRewardHistory = async (init, groupId) => {
    const {group, getUserRewardHistory, auth, reward} = this.props;

    const request = {
      token: auth.token,
      groupId: groupId ? groupId : group.group.id,
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

  render() {
    const {reward, group, navigation} = this.props;
    const {theme} = this.state;
    return (
      <View style={theme.greyArea}>
        {reward.userRewardHistory.length == 0 ? (
          <View style={styles.container}>
            <Text style={styles.text}>You have not won any reward yet</Text>
          </View>
        ) : (
          <RewardHistoryList
            rewardHistory={reward.userRewardHistory || []}
            groupId={group.group.id}
            onEndReached={this.onEndReached}
            navigation={navigation}
            prevRoute={group.group.id ? 'MyGroupRewards' : 'MyRewards'}
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
  const {group, auth, reward, currentScreen} = state;
  return {group, auth, reward, currentScreen};
};

const mapDispatchToProps = dispatch => {
  return {
    getUserRewardHistory: data => dispatch(getUserRewardHistory(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyReward);
