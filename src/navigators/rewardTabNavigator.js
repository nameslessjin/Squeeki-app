import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Reward from '../screens/reward';
import RewardHistory from '../screens/rewardHistory';
import TopRightButton from '../components/reward/topRightButton';
import {
  getGroupRewardList,
  getGroupRewardHistory,
  getUserRewardHistory,
} from '../actions/reward';
import {userLogout} from '../actions/auth';
import {TouchableWithoutFeedback, View, TouchableOpacity} from 'react-native';
import MyReward from '../screens/myReward';
import RewardManagement from '../screens/rewardManagement';

const Tabs = createBottomTabNavigator();

class RewardTabNavigator extends React.Component {
  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerTitle: 'Reward',
      headerBackTitleVisible: false,
    });
  }

  getRouteName = () => {
    const routeName =
      getFocusedRouteNameFromRoute(this.props.route) ?? 'Rewards';
    return routeName;
  };

  componentDidUpdate() {
    const routeName = this.getRouteName();
    const {navigation, group} = this.props;

    if (routeName == 'Rewards') {
      const hasRewardManagementAuthority =
        group.group.auth.rank <=
        group.group.rank_setting.manage_reward_rank_required;
      navigation.setOptions({
        headerRight: () =>
          hasRewardManagementAuthority ? (
            <TopRightButton type={'add'} onPress={this.onTopRightButtonPress} />
          ) : null,
      });
    } else {
      navigation.setOptions({
        headerRight: null,
      });
    }
  }

  getGroupRewardList = async () => {
    const {auth, group, getGroupRewardList, navigation} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    navigation.navigate('Rewards');

    const req = await getGroupRewardList(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward list at this time, please try again later');
      return;
    }
  };

  loadGroupRewardHistory = async () => {
    const {group, getGroupRewardHistory, auth, navigation} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: 0,
      init: true,
    };

    navigation.navigate('History');

    const req = await getGroupRewardHistory(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward history at this time, please try again later');
      return;
    }
  };

  loadUserRewardHistory = async () => {
    const {group, getUserRewardHistory, auth, navigation} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: 0,
      init: true,
    };

    navigation.navigate('MyRewards');

    const req = await getUserRewardHistory(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward history at this time, please try again later');
      return;
    }
  };

  onTopRightButtonPress = () => {
    const {navigation} = this.props;
    const routeName = this.getRouteName();

    if (routeName == 'Rewards') {
      navigation.navigate('RewardSetting');
    }
  };

  render() {
    const {group} = this.props;
    const hasRewardManagementAuthority =
      group.group.auth.rank <=
      group.group.rank_setting.manage_reward_rank_required;

    return (
      <Tabs.Navigator
        initialRouteName="History"
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          headerShown: false,
        }}>
        <Tabs.Screen
          name="History"
          component={RewardHistory}
          options={{
            tabBarIcon: ({focused, color, size}) => {
              return (
                <MaterialIcons
                  name={'format-list-bulleted'}
                  size={25}
                  color={color}
                />
              );
            },
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={this.loadGroupRewardHistory}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Rewards"
          component={Reward}
          options={{
            tabBarIcon: ({focused, color, size}) => {
              return (
                <MaterialIcons
                  name={'treasure-chest'}
                  size={25}
                  color={color}
                />
              );
            },
            tabBarButton: props => (
              <TouchableOpacity {...props} onPress={this.getGroupRewardList} />
            ),
          }}
        />
        <Tabs.Screen
          name="MyRewards"
          component={MyReward}
          options={{
            tabBarLabel: 'My Rewards',
            tabBarIcon: ({focused, color, size}) => {
              return <MaterialIcons name={'book'} size={25} color={color} />;
            },
            tabBarButton: props => (
              <TouchableOpacity
                {...props}
                onPress={this.loadUserRewardHistory}
              />
            ),
          }}
        />
        {hasRewardManagementAuthority ? (
          <Tabs.Screen
            name="RewardManagement"
            component={RewardManagement}
            options={{
              tabBarLabel: 'Management',
              tabBarIcon: ({focused, color, size}) => {
                return (
                  <MaterialIcons
                    name={'book-multiple'}
                    size={25}
                    color={color}
                  />
                );
              },
              tabBarButton: props => <TouchableOpacity {...props} />,
            }}
          />
        ) : null}
      </Tabs.Navigator>
    );
  }
}

const mapStateToProps = state => {
  const {auth, group, reward} = state;
  return {auth, group, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupRewardList: data => dispatch(getGroupRewardList(data)),
    userLogout: () => dispatch(userLogout()),
    getGroupRewardHistory: data => dispatch(getGroupRewardHistory(data)),
    getUserRewardHistory: data => dispatch(getUserRewardHistory(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardTabNavigator);
