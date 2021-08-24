import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
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

class AdminDrawerNavigator extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  render() {
    return <View />;
  }
}

const mapStateToProps = state => {
  const {currentScreen, auth} = state;
  return {currentScreen, auth};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminDrawerNavigator);
