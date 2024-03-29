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
import {getTheme} from '../utils/theme';

const Tabs = createBottomTabNavigator();

class RewardTabNavigator extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state
    navigation.setOptions({
      headerTitle: 'Reward',
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  getRouteName = () => {
    const routeName =
      getFocusedRouteNameFromRoute(this.props.route) ?? 'RewardHistory';
    return routeName;
  };

  componentDidUpdate() {
    const routeName = this.getRouteName();
    const {theme} = this.state;
    const {navigation, group} = this.props;
    const hasRewardManagementAuthority = group.group.auth
      ? group.group.auth.rank <=
        group.group.rank_setting.manage_reward_rank_required
      : false;

    if (routeName == 'RewardList') {
      navigation.setOptions({
        headerRight: () =>
          hasRewardManagementAuthority ? (
            <TopRightButton
              type={'add'}
              onPress={this.onTopRightButtonPress}
              theme={theme}
            />
          ) : null,
      });
    } else if (routeName == 'RewardManagement') {
      navigation.setOptions({
        headerRight: () =>
          hasRewardManagementAuthority ? (
            <TopRightButton
              type={'gift'}
              onPress={this.onTopRightButtonPress}
              theme={theme}
            />
          ) : null,
      });
    } else {
      navigation.setOptions({
        headerRight: null,
      });
    }
  }

  componentWillUnmount() {
    const {group, navigation} = this.props;
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'GroupRewards',
      });
    }
  }

  getGroupRewardList = async () => {
    const {auth, group, getGroupRewardList, navigation} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    navigation.navigate('RewardList', {
      prevRoute: 'RewardList',
    });

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

    navigation.navigate('RewardHistory');

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

    navigation.navigate('MyGroupRewards');

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

    if (routeName == 'RewardList') {
      navigation.navigate('RewardSetting', {prevRoute: 'RewardList'});
    } else if (routeName == 'RewardManagement') {
      // direct to gifted reward management page
      navigation.navigate('RewardDropList', {
        prevRoute: 'RewardManagement',
      });
    }
  };

  render() {
    const {group} = this.props;
    const {theme} = this.state
    const hasRewardManagementAuthority = group.group.auth
      ? group.group.auth.rank <=
        group.group.rank_setting.manage_reward_rank_required
      : false;

    return (
      <Tabs.Navigator
        initialRouteName="RewardHistory"
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          headerShown: false,
          tabBarStyle: [theme.backgroundColor, {borderTopColor: 'transparent'}],
        }}>
        <Tabs.Screen
          name="RewardHistory"
          component={RewardHistory}
          options={{
            tabBarLabel: 'History',
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
          name="RewardList"
          component={Reward}
          options={{
            tabBarLabel: 'Rewards',
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
          name="MyGroupRewards"
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
