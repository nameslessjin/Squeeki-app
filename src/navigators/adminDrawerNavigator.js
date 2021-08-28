import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {getTheme} from '../utils/theme';
import AdminHome from '../screens/admin/adminHome';
import HeaderRightButton from '../components/group/headerRight';

const Drawer = createDrawerNavigator();

class AdminDrawerNavigator extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {theme} = this.state;
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
      headerTitle: 'Admin',
    //   headerRight: () => (
    //     <HeaderRightButton
    //       theme={theme}
    //       onPress={this.onToggleHeaderRightButton}
    //     />
    //   ),
    });
  }

  onToggleHeaderRightButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  render() {
    const {auth, metadata} = this.props;
    const {theme} = this.state;
    const {
      searchUserClearance,
      searchGroupClearance,
      searchPostClearance,
      searchCommentClearance,
    } = metadata.securityClearance;
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
          drawerStyle: [styles.drawerStyle, theme.backgroundColor],
          drawerLabelStyle: theme.drawerTextColor,
        }}
        initialRouteName="AdminHome">
        <Drawer.Screen
          name="AdminHome"
          component={AdminHome}
          options={() => ({
            drawerLabel: 'Admin Home',
          })}
        />
        {/* {searchUserClearance ? (
          <Drawer.Screen name="Users" component={AdminHome} />
        ) : null}
        {searchGroupClearance ? (
          <Drawer.Screen name="Groups" component={AdminHome} />
        ) : null}
        {searchPostClearance ? (
          <Drawer.Screen name="Posts" component={AdminHome} />
        ) : null}
        {searchCommentClearance ? (
          <Drawer.Screen name="Comments" component={AdminHome} />
        ) : null} */}
      </Drawer.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  drawerStyle: {
    width: '50%',
  },
});

const mapStateToProps = state => {
  const {auth, metadata} = state;
  return {auth, metadata};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminDrawerNavigator);
