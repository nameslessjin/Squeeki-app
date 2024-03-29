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
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {connect} from 'react-redux';
import {changeScreen} from '../actions/screen';
import {userLogout} from '../actions/auth';
import {singleDefaultIcon} from '../utils/defaultIcon';
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
      headerBackTitleVisible: false,
      headerTitle: 'Squeeki',

      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  getHeaderTitle = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    return routeName;
  };

  componentDidUpdate(prevProps, prevState) {
    const {navigation, auth} = this.props;

    // update theme
    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      console.log(theme);
      navigation.setOptions({
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
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

  onPress = navigateTo => {
    const {navigation} = this.props;
    navigation.navigate(navigateTo);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  CustomDrawerContent = props => {
    const {auth, metadata} = this.props;
    const {theme} = this.state;
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
            onPress={() => this.onPress('Profile')}
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
          label="My Rewards"
          labelStyle={theme.drawerTextColor}
          onPress={() => this.onPress('MyRewards')}
        />

        <DrawerItem
          label="Settings"
          labelStyle={theme.drawerTextColor}
          onPress={() => this.onPress('UserSettings')}
        />

        {metadata.securityClearance ? (
          metadata.securityClearance.status == 'active' ? (
            <DrawerItem
              label="Admin"
              labelStyle={theme.drawerTextColor}
              onPress={() => this.onPress('AdminDrawerNavigator')}
            />
          ) : null
        ) : null}
      </DrawerContentScrollView>
    );
  };

  render() {
    const {theme} = this.state;
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: [{width: 200}, theme.backgroundColor],
          drawerLabelStyle: theme.drawerTextColor,
        }}
        initialRouteName="Home"
        drawerContent={props => this.CustomDrawerContent(props)}>
        <Drawer.Screen
          name="Home"
          component={Home}
          options={() => ({
            drawerLabel: '',
            drawerItemStyle: {width: 0, height: 0},
          })}
        />
      </Drawer.Navigator>
    );
  }
}

// function CustomDrawerContent(props) {
//   const {logout, navigation, auth, theme, metadata} = props;
//   const {displayName, icon} = auth.user;
//   return (
//     <DrawerContentScrollView
//       {...props}
//       style={[
//         {bottom: Platform.OS == 'android' ? 0 : height * 0.05},
//         theme.backgroundColor,
//       ]}>
//       {displayName ? (
//         <DrawerItem
//           label={displayName}
//           labelStyle={{color: 'black'}}
//           icon={() => (
//             <View style={styles.profile}>
//               <Image
//                 source={icon ? {uri: icon.uri} : singleDefaultIcon()}
//                 style={styles.imageStyle}
//               />
//               <Text style={[styles.displayName, theme.textColor]}>
//                 {displayName}
//               </Text>
//             </View>
//           )}
//           onPress={() => this.onPress('Profile')}
//         />
//       ) : null}
//       <View
//         style={{
//           width: '100%',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: 7,
//         }}>
//         <View
//           style={{
//             borderBottomWidth: StyleSheet.hairlineWidth,
//             borderColor: 'grey',
//             width: '85%',
//           }}
//         />
//       </View>
//       <DrawerItemList {...props} />

//       <DrawerItem
//         label="My Rewards"
//         labelStyle={theme.drawerTextColor}
//         onPress={() => this.onPress('MyRewards')}
//       />

//       <DrawerItem
//         label="Settings"
//         labelStyle={theme.drawerTextColor}
//         onPress={() => this.onPress('UserSettings')}
//       />

//       {metadata.securityClearance ? (
//         metadata.securityClearance.status == 'active' ? (
//           <DrawerItem
//             label="Admin"
//             labelStyle={theme.drawerTextColor}
//             onPress={() => this.onPress('AdminDrawerNavigator')}
//           />
//         ) : null
//       ) : null}
//     </DrawerContentScrollView>
//   );
// }

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
