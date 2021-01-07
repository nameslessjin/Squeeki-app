import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Group from '../screens/group';
import React from 'react';
import {StyleSheet} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import HeaderRightButton from '../components/group/headerRight';
// all screens
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class GroupDrawerNavigator extends React.Component {
  onToggleHeaderRightButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    const {auth} = group.group;
    navigation.setOptions({
      headerRight: () =>
        auth == null ? null : (
          <HeaderRightButton onPress={this.onToggleHeaderRightButton} />
        ),
      headerTitle: group.group.groupname,
      headerBackTitleVisible: false,
    });
  }

  componentDidUpdate() {
    const {navigation, group} = this.props;
    const {auth} = group.group;
    navigation.setOptions({
      headerRight: () =>
        auth == null ? null : (
          <HeaderRightButton onPress={this.onToggleHeaderRightButton} />
        ),
    });
  }

  render() {
    const {groupname} = this.props.group.group;

    return (
      <Drawer.Navigator
        initialRouteName="Group"
        drawerPosition="right"
        drawerContent={props => (
          <CustomDrawerContent {...props} {...this.props.group} />
        )}
        drawerStyle={styles.drawerStyle}>
        <Drawer.Screen name={groupname || 'Group'} component={Group} />
      </Drawer.Navigator>
    );
  }
}

function CustomDrawerContent(props) {
  const {auth} = props.group;
  return auth == null ? null : (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Members"
        icon={() => (
          <MaterialIcons name="account-group" color={'grey'} size={25} />
        )}
        labelStyle={styles.labelStyle}
        onPress={() => {
          props.navigation.navigate('Members');
        }}
      />
      <DrawerItem
        label="Nomination"
        icon={() => <MaterialIcons name="poll-box" color={'grey'} size={25} />}
        labelStyle={styles.labelStyle}
        onPress={() => {
          props.navigation.navigate('NominationResults');
        }}
      />
      <DrawerItem
        label="Check In"
        icon={() => (
          <MaterialIcons name="check-bold" color={'grey'} size={25} />
        )}
        labelStyle={styles.labelStyle}
        onPress={() => {
            props.navigation.navigate('CheckIn')
        }}
      />
      <DrawerItem
        label="Reward"
        icon={() => <MaterialIcons name="treasure-chest" color={'grey'} size={25} />}
        labelStyle={styles.labelStyle}
        // onPress={() => {
        //   props.navigation.navigate('GroupSetting');
        // }}
      />
      <DrawerItem
        label="Settings"
        icon={() => <MaterialIcons name="cog" color={'grey'} size={25} />}
        labelStyle={styles.labelStyle}
        onPress={() => {
          props.navigation.navigate('GroupSetting');
        }}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  drawerStyle: {
    width: '50%',
  },
  labelStyle: {
    marginLeft: -25,
  },
});

const mapStateToProps = state => {
  const {group} = state;
  return {group};
};

export default connect(
  mapStateToProps,
  null,
)(GroupDrawerNavigator);
