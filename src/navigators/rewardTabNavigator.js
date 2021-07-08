import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Reward from '../screens/reward';
import RewardList from '../screens/rewardList';
import RewardHistory from '../screens/rewardHistory';
import TopRightButton from '../components/reward/topRightButton';
import {getGroupReward} from '../actions/reward';
import {loadGroupRewardsFunc} from '../functions/reward';
import {userLogout} from '../actions/auth';
import {TouchableWithoutFeedback, View} from 'react-native';

const Tabs = createBottomTabNavigator();

class RewardTabNavigator extends React.Component {
  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerTitle: 'Reward',
      headerBackTitleVisible: false,
      // headerRight: () => (
      //   <TopRightButton type={'history'} onPress={this.onTopRightButtonPress} />
      // ),
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
      navigation.setOptions({
        headerRight: () =>
          group.group.auth.rank <= 1 ? (
            <TopRightButton type={'add'} onPress={this.onTopRightButtonPress} />
          ) : null,
      });
    } else if (routeName == 'History') {
      navigation.setOptions({
        headerRight: null
      });
    }
  }

  // loadGroupReward = () => {
  //   const {
  //     group,
  //     auth,
  //     userLogout,
  //     navigation,
  //     reward,
  //     getGroupReward,
  //   } = this.props;

  //   const data = {
  //     group,
  //     userLogout,
  //     auth,
  //     navigation,
  //     count: 0,
  //     func: getGroupReward,
  //     redeemed: false,
  //   };

  //   loadGroupRewardsFunc(data);
  // };

  onTopRightButtonPress = () => {
    const {navigation} = this.props;
    const routeName = this.getRouteName();

    if (routeName.toLowerCase() == 'reward') {
      navigation.navigate('RewardSetting')
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
    // getGroupReward: data => dispatch(getGroupReward(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardTabNavigator);
