import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Reward from '../screens/reward';
import RewardHistory from '../screens/rewardHistory';
import TopRightButton from '../components/reward/topRightButton';
import {getGroupRewardList} from '../actions/reward';
import {loadGroupRewardsFunc} from '../functions/reward';
import {userLogout} from '../actions/auth';
import {TouchableWithoutFeedback, View, TouchableOpacity} from 'react-native';

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
      getFocusedRouteNameFromRoute(this.props.route) ?? 'reward';
    return routeName;
  };

  componentDidUpdate() {
    const routeName = this.getRouteName();
    const {navigation, group} = this.props;

    if (routeName == 'Reward') {
      const hasRewardManagementAuthority =
        group.group.auth.rank <=
        group.group.rank_setting.manage_reward_rank_required;
      navigation.setOptions({
        headerRight: () =>
          hasRewardManagementAuthority ? (
            <TopRightButton type={'add'} onPress={this.onTopRightButtonPress} />
          ) : null,
      });
    } else if (routeName == 'History') {
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

    navigation.navigate('Reward');

    const req = await getGroupRewardList(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get reward list at this time, please try again later');
      return;
    }
  };

  onTopRightButtonPress = () => {
    const {navigation} = this.props;
    const routeName = this.getRouteName();

    if (routeName.toLowerCase() == 'reward') {
      navigation.navigate('RewardSetting');
    }
  };

  render() {
    return (
      <Tabs.Navigator
        initialRouteName="History"
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
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
          }}
        />
        <Tabs.Screen
          name="Reward"
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardTabNavigator);
