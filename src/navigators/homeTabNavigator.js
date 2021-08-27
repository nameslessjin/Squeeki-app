import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect} from 'react-redux';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../screens/home';
import Groups from '../screens/groups';
import Chats from '../screens/chats';
import GroupRightButton from '../components/groups/headerRight';
import HeaderRightButton from '../components/chat/headerRightButton';
import {getTheme} from '../utils/theme';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {Tab} from 'react-native-elements/dist/tab/Tab';
import {socket} from '../../server_config';
import {unsubSocket} from '../functions/chat';
import {changeScreen} from '../actions/screen';
import HomeDrawerNavigator from '../navigators/homeDrawerNavigator';
import HeaderLeftButton from '../components/home/headerLeft';
import {DrawerActions} from '@react-navigation/native';

const Tabs = createBottomTabNavigator();

class HomeTabNavigator extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerTitle: 'Squeeki',
      headerBackTitleVisible: false,
      headerStyle: theme.backgroundColor,
      headerTintColor: theme.textColor.color,
    });
    socket.init();
  }

  getRouteName = () => {
    const routeName =
      getFocusedRouteNameFromRoute(this.props.route) ?? 'HomeDrawerNavigator';
    return routeName;
  };

  onToggleHeaderLeftButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  onToggleGroupsRightButton = async () => {
    const {navigation} = this.props;
    navigation.navigate('Search', {prevRoute: 'groups'});
  };

  unsubSocket = () => {
    const {chat, group, currentScreen} = this.props;

    if (currentScreen.currentScreen == 'Chats') {
      // if not in group all chats in chat.chats
      let socket_chat_id = chat.chats;

      // if in group only the one with proper rank or people who added to chat
      if (group.group.auth) {
        socket_chat_id = chat.chats.filter(c => c.available);
      }
      socket_chat_id = socket_chat_id.map(c => c.id);
      unsubSocket(socket_chat_id);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const routeName = this.getRouteName();
    const {navigation, currentScreen} = this.props;
    const {theme} = this.state;
    if (routeName != currentScreen.currentScreen) {
      this.props.changeScreen(routeName);
    }

    if (routeName == 'HomeDrawerNavigator') {
      navigation.setOptions({
        headerTitle: 'Squeeki',
        headerRight: null,
        headerLeft: () => (
          <HeaderLeftButton
            onPress={this.onToggleHeaderLeftButton}
            theme={theme}
          />
        ),
      });
      this.unsubSocket();
    } else if (routeName == 'Groups') {
      navigation.setOptions({
        headerRight: () => (
          <GroupRightButton
            onPress={this.onToggleGroupsRightButton}
            theme={theme}
          />
        ),
        headerLeft: null,
        headerTitle: 'My Groups',
      });

      this.unsubSocket();
    } else if (routeName == 'Chats') {
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            onPress={() =>
              navigation.navigate('HomeTabNavigator', {
                screen: 'Chats',
                params: {modalVisible: true},
              })
            }
            type={'create'}
            theme={theme}
          />
        ),
        headerLeft: null,
        headerTitle: 'My Chats',
      });
    }

    // update theme
    if (prevProps.auth.user.theme != this.props.auth.user.theme) {
      const theme = getTheme(this.props.auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: theme.backgroundColor,
        headerTintColor: theme.textColor.color,
        headerLeft: () => (
          <HeaderLeftButton
            onPress={this.onToggleHeaderLeftButton}
            theme={theme}
          />
        ),
      });
    }
  }

  render() {
    const {theme} = this.state;

    return (
      <Tabs.Navigator
        initialRouteName="HomeDrawerNavigator"
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'grey',
          headerShown: false,
          tabBarStyle: theme.backgroundColor,
        }}>
        <Tabs.Screen
          name="HomeDrawerNavigator"
          component={HomeDrawerNavigator}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({focused, color, size}) => {
              return <MaterialIcons name={'home'} size={25} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="Groups"
          component={Groups}
          options={{
            tabBarIcon: ({focused, color, size}) => {
              return (
                <MaterialIcons
                  name={'account-multiple'}
                  size={25}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="Chats"
          component={Chats}
          options={{
            tabBarIcon: ({focused, color, size}) => {
              return <MaterialIcons name={'chat'} size={25} color={color} />;
            },
          }}
        />
      </Tabs.Navigator>
    );
  }
}

const mapStateToProps = state => {
  const {currentScreen, auth, chat, group} = state;
  return {currentScreen, auth, chat, group};
};

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: screen => dispatch(changeScreen(screen)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeTabNavigator);
