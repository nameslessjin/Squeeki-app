import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Home from '../screens/home';
import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import HeaderLeftButton from '../components/home/headerLeft';
import Groups from '../screens/groups';
import Chats from '../screens/chats';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {connect} from 'react-redux';
import {changeScreen} from '../actions/screen';
import GroupRightButton from '../components/groups/headerRight';
import HeaderRightButton from '../components/chat/headerRightButton';
import {userLogout} from '../actions/auth';
import {socket} from '../../server_config';
import {unsubSocket} from '../functions/chat';
import {singleDefaultIcon} from '../utils/defaultIcon';
import MyReward from '../screens/myReward';
import {getTheme} from '../utils/theme';

const {height} = Dimensions.get('screen');

class HomeDrawerNavigator extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  onToggleHeaderLeftButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  onToggleGroupsRightButton = async () => {
    const {navigation} = this.props;
    navigation.navigate('Search', {prevRoute: 'groups'});
  };

  onToggleHomeRightButton = () => {
    const {navigation} = this.props;
    navigation.navigate('PostSetting', {
      create: true,
      groupId: null,
    });
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButton
          onPress={this.onToggleHeaderLeftButton}
          theme={theme}
        />
      ),
      // headerRight: () => <HomeHeaderRightButton onPress={this.onToggleHomeRightButton} />,
      headerBackTitleVisible: false,
      headerTitle: 'Squeeki',

      headerStyle: theme.backgroundColor,
      headerTintColor: theme.textColor.color,
    });

    // delete this once the recommendation page is done
    // setTimeout(() => {
    //   this.props.navigation.dispatch(DrawerActions.openDrawer());
    // }, 100);

    socket.init();
  }

  getHeaderTitle = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    return routeName;
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
    const name = this.getHeaderTitle(this.props.route);
    const {navigation, currentScreen, auth} = this.props;
    const {theme} = this.state;
    if (name != currentScreen.currentScreen) {
      this.props.changeScreen(name);
    }
    if (name == 'Home') {
      navigation.setOptions({
        headerRight: null,
        headerTitle: 'Squeeki',
      });
      this.unsubSocket();
    } else if (name == 'Profile') {
      navigation.setOptions({
        headerRight: null,
        headerTitle: 'My Profile',
      });
      this.unsubSocket();
    } else if (name == 'Groups') {
      navigation.setOptions({
        headerRight: () => (
          <GroupRightButton
            onPress={this.onToggleGroupsRightButton}
            theme={theme}
          />
        ),
        headerTitle: 'My Groups',
      });

      this.unsubSocket();
    } else if (name == 'MyRewards') {
      navigation.setOptions({
        headerRight: null,
        headerTitle: 'My Rewards',
      });

      this.unsubSocket();
    } else if (name == 'Chats') {
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            onPress={() =>
              navigation.navigate('HomeDrawerNavigator', {
                screen: 'Chats',
                params: {modalVisible: true},
              })
            }
            type={'create'}
            theme={theme}
          />
        ),
        headerTitle: 'My Chats',
      });
    }

    // update theme
    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      console.log(theme);
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
    const {logout, auth, metadata} = this.props;
    const {theme} = this.state;
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: [{width: 200}, theme.backgroundColor],
          drawerLabelStyle: theme.drawerTextColor,
        }}
        initialRouteName="Home"
        drawerContent={props => (
          <CustomDrawerContent
            {...props}
            logout={logout}
            auth={auth}
            theme={theme}
          />
        )}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Groups" component={Groups} />
        <Drawer.Screen name="Chats" component={Chats} />
        <Drawer.Screen
          name="MyRewards"
          component={MyReward}
          options={() => ({
            drawerLabel: 'My Rewards',
          })}
        />
        {metadata.securityClearance ? (
          <Drawer.Screen name="Admin" component={Chats} />
        ) : null}
      </Drawer.Navigator>
    );
  }
}

function CustomDrawerContent(props) {
  const {logout, navigation, auth, theme} = props;
  const {displayName, icon} = auth.user;
  return (
    <DrawerContentScrollView
      {...props}
      style={[
        {bottom: Platform.OS == 'android' ? 0 : height * 0.05},
        theme.backgroundColor,
      ]}>
      {displayName ? (
        <DrawerItem
          label={displayName}
          labelStyle={{color: 'black'}}
          icon={() => (
            <View style={styles.profile}>
              <Image
                source={icon ? {uri: icon.uri} : singleDefaultIcon()}
                style={styles.imageStyle}
              />
              <Text style={[styles.displayName, theme.textColor]}>
                {displayName}
              </Text>
            </View>
          )}
          onPress={() => navigation.navigate('Profile')}
        />
      ) : null}
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: 7,
        }}>
        <View
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: 'grey',
            width: '85%',
          }}
        />
      </View>
      <DrawerItemList {...props} />

      <DrawerItem
        label="Settings"
        labelStyle={theme.drawerTextColor}
        onPress={() => {
          navigation.navigate('UserSettings');
        }}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  drawerStyle: {
    width: '50%',
    flex: 1,
    paddingTop: 0,
  },
  labelStyle: {
    color: 'red',
  },
  imageStyle: {
    height: 75,
    aspectRatio: 1,
    borderRadius: 37,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    minHeight: 110,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  displayName: {
    marginTop: 5,
    fontSize: 18,
  },
  darkModeColorHeader: {
    backgroundColor: '#1d2027',
  },
});

const mapStateToProps = state => {
  const {currentScreen, auth, chat, group, metadata} = state;
  return {currentScreen, auth, chat, group, metadata};
};

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: screen => dispatch(changeScreen(screen)),
    logout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeDrawerNavigator);
