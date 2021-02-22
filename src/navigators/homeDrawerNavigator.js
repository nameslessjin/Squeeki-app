import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Home from '../screens/home';
import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Image, View} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import HeaderLeftButton from '../components/home/headerLeft';
import Groups from '../screens/groups';
import Terms from '../screens/terms';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {connect} from 'react-redux';
import {changeScreen} from '../actions/screen';
import GroupRightButton from '../components/groups/headerRight';
import {userLogout} from '../actions/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class HomeDrawerNavigator extends React.Component {

  state = {
    icon_option: 'emoticon-cool-outline',
  }

  onToggleHeaderLeftButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  onToggleGroupsRightButton = async () => {
    const {navigation} = this.props;
    navigation.navigate('Search');
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
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButton onPress={this.onToggleHeaderLeftButton} />
      ),
      // headerRight: () => <HomeHeaderRightButton onPress={this.onToggleHomeRightButton} />,
      headerBackTitleVisible: false,
    });

    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]});

  }

  getHeaderTitle = route => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
    return routeName;
  };

  componentDidUpdate(prevProps, prevState) {
    const name = this.getHeaderTitle(this.props.route);
    const {navigation} = this.props;
    const {currentScreen} = this.props;
    if (name != currentScreen.currentScreen) {
      this.props.changeScreen(name);
    }
    if (name == 'Home') {
      // navigation.setOptions({
      //   headerRight: () => <HomeHeaderRightButton onPress={this.onToggleHomeRightButton} />,
      // });
      navigation.setOptions({
        headerRight: null,
      });
    } else if (name == 'Profile') {
      navigation.setOptions({
        headerRight: null,
      });
    } else if (name == 'Groups') {
      navigation.setOptions({
        headerRight: () => (
          <GroupRightButton onPress={this.onToggleGroupsRightButton} />
        ),
      });
    }
  }

  updateProlfeButton = () => {
    this.setState({update: true});
  };

  render() {
    const {logout, auth} = this.props;
    const {icon_option} = this.state
    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => (
          <CustomDrawerContent {...props} logout={logout} auth={auth} icon_option={icon_option}/>
        )}
        drawerStyle={styles.drawerStyle}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Groups" component={Groups} />
        {/* <Drawer.Screen name="Profile" component={Profile} /> */}
        <Drawer.Screen name="Terms" component={Terms} />
      </Drawer.Navigator>
    );
  }
}

function CustomDrawerContent(props) {
  const {logout, navigation, auth, icon_option} = props;
  const {displayName, icon} = auth.user;
  return (
    <DrawerContentScrollView {...props} style={{bottom: 50}} >
      <DrawerItem
        label={displayName}
        labelStyle={{color: 'black'}}
        icon={() => (
          <View style={styles.profile}>
            {icon != null ?
            <Image source={{uri: icon.uri}} style={styles.imageStyle} />: <MaterialIcons name={icon_option} size={75} />}
            <Text style={styles.displayName} >{displayName}</Text>
          </View>
        )}
        onPress = {() => navigation.navigate('Profile')}
      />
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        labelStyle={styles.labelStyle}
        onPress={() => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
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
    paddingTop: 0
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
    padding: 5,

  },
  displayName: {
    marginTop: 5,
    fontSize: 18
  }
});

const mapStateToProps = state => {
  const {currentScreen, auth} = state;
  return {currentScreen, auth};
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
