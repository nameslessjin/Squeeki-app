import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Home from '../screens/home';
import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import HeaderLeftButton from '../components/home/headerLeft';
import Groups from '../screens/groups';
import Terms from '../screens/terms'
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {connect} from 'react-redux';
import {changeScreen} from '../actions/screen';
import HomeHeaderRightButton from '../components/home/headerRight';
import GroupRightButton from '../components/groups/headerRight';
import {userLogout} from '../actions/auth';
import Profile from '../screens/profile'
import ProfileButton from '../components/profile/profileButton'

class HomeDrawerNavigator extends React.Component {

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
    })
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButton onPress={this.onToggleHeaderLeftButton} />
      ),
      // headerRight: () => <HomeHeaderRightButton onPress={this.onToggleHomeRightButton} />,
    });
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
    } else if (name == 'Profile'){
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
    this.setState({update: true})
  }

  render() {

    return (
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={props => (
          <CustomDrawerContent
            {...props}
            logout={this.props.logout}
          />
        )}
        drawerStyle = {styles.drawerStyle}
      >
        <Drawer.Screen name="Home" component={Home}/>
        <Drawer.Screen name="Groups" component={Groups}/>
        <Drawer.Screen name="Profile" component={Profile}/>
        <Drawer.Screen name="Terms" component={Terms}/>
      </Drawer.Navigator>
    );
  }
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        labelStyle={styles.labelStyle}
        onPress={() => {
          props.logout();
          props.navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    })
        }}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  drawerStyle: {
    width: '50%'
  },
  labelStyle: {
    color: 'red'
  }
})

const mapStateToProps = state => {
  const {currentScreen} = state;
  return {currentScreen};
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
