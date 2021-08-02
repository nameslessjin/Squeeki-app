import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Group from '../screens/group';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
      headerTitle: group.group.display_name,
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

  CustomDrawerContent = props => {
    const {group, group_join_request_count} = this.props.group;
    const {auth} = group;

    return auth == null ? null : (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Rules"
          icon={() => (
            <MaterialIcons name="script-text" color={'grey'} size={25} />
          )}
          labelStyle={styles.labelStyle}
          onPress={() => {
            props.navigation.navigate('GroupRules');
          }}
        />
        <DrawerItem
          label={({focused, color}) => (
            <Text style={styles.labelStyle}>
              Members{' '}
              {auth.rank <= 2 && group_join_request_count > 0 ? (
                <View style={styles.notification}>
                  <Text style={styles.notificationText}>
                    {group_join_request_count}
                  </Text>
                </View>
              ) : null}
            </Text>
          )}
          icon={() => (
            <MaterialIcons name="account-group" color={'grey'} size={25} />
          )}
          labelStyle={styles.labelStyle}
          onPress={() => {
            props.navigation.navigate('Members');
          }}
        />
        <DrawerItem
          label="Chats"
          icon={() => <MaterialIcons name="chat" color={'grey'} size={25} />}
          labelStyle={styles.labelStyle}
          onPress={() => {
            props.navigation.navigate('Chats');
          }}
        />
        <DrawerItem
          label="Nomination"
          icon={() => (
            <MaterialIcons name="poll-box" color={'grey'} size={25} />
          )}
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
            props.navigation.navigate('CheckIn');
          }}
        />
        <DrawerItem
          label="Reward"
          icon={() => (
            <MaterialIcons name="treasure-chest" color={'grey'} size={25} />
          )}
          labelStyle={styles.labelStyle}
          onPress={() => {
            props.navigation.navigate('RewardNavigator');
          }}
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
  };

  render() {
    const {groupname, display_name} = this.props.group.group;

    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
          drawerStyle: styles.drawerStyle,
        }}
        initialRouteName="Group"
        drawerPosition="right"
        drawerContent={props => this.CustomDrawerContent(props)}>
        <Drawer.Screen name={display_name || 'Group'} component={Group} />
      </Drawer.Navigator>
    );
  }
}

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  drawerStyle: {
    width: '50%',
  },
  labelStyle: {
    marginLeft: -25,
    color: 'grey',
    fontWeight: '600',
  },
  notification: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 3,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA2027',
  },
  notificationText: {
    color: 'white',
    fontWeight: '500',
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
