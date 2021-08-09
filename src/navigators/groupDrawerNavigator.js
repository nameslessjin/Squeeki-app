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
import {
  cleanGroup,
  findUserGroupsByUserId,
  getSingleGroupById,
  getGroupJoinRequestCount,
} from '../actions/group';
import {userLogout} from '../actions/auth';
import {invalidAuthentication} from '../functions/auth';
import {getUserGroupPoint, getGroupPointLeaderBoard} from '../actions/point';
import {loadLeaderBoardFunc} from '../functions/point';
import {getGroupJoinRequestCountFunc} from '../functions/group';

class GroupDrawerNavigator extends React.Component {
  onToggleHeaderRightButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    const {auth, display_name, visibility, rank_setting} = group.group;
    navigation.setOptions({
      headerRight: () =>
        auth == null ? null : (
          <HeaderRightButton onPress={this.onToggleHeaderRightButton} />
        ),
      headerTitle: group.group.display_name,
      headerBackTitleVisible: false,
    });

    if (visibility == 'public' || auth != null) {
      this.loadLeaderBoard();

      if (auth != null) {
        this.getUserGroupPoint();
        if (auth.rank <= rank_setting.manage_member_rank_required) {
          this.getGroupJoinRequestCount();
        }
      }
    }
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

  componentWillUnmount() {
    const {route, navigation, cleanGroup} = this.props;
    if (route.params) {
      const {prevRoute, groupId} = route.params;
      cleanGroup();

      if (
        prevRoute == 'RewardHistory' ||
        prevRoute == 'MyGroupRewards' ||
        prevRoute == 'MyRewards' ||
        prevRoute == 'RewardList' ||
        prevRoute == 'RewardDetail'
      ) {
        // MyRewads have no previous group page
        // if has previous group page thus reload group and reward
        if (groupId) {
          this.getGroup(groupId);
        }
        navigation.navigate(prevRoute, {
          refresh: true,
          groupId,
        });
      } else {
        // if the current route is general group page then load groups
        this.loadGroups(true);
      }
    }
  }

  getGroup = async groupId => {
    const {auth, getSingleGroupById} = this.props;
    const request = {
      id: groupId,
      token: auth.token,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot load group at this time, please try again later');
      return;
    }

    this.loadLeaderBoard(groupId);
    this.getUserGroupPoint(groupId);
  };

  getUserGroupPoint = async groupId => {
    const {auth, group, getUserGroupPoint} = this.props;
    const request = {
      token: auth.token,
      groupId: groupId ? groupId : group.group.id,
    };

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      alert(req.errors[0].message);
      return;
    }
  };

  loadLeaderBoard = groupId => {
    const {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
    } = this.props;
    const data = {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group: groupId ? {group: {id: groupId}} : group,
      count: 0,
      limit: 3,
      period: 'month',
    };

    loadLeaderBoardFunc(data);
  };

  getGroupJoinRequestCount = () => {
    const {
      getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    } = this.props;
    const data = {
      func: getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    };
    getGroupJoinRequestCountFunc(data);
  };

  loadGroups = async init => {
    const {
      findUserGroupsByUserId,
      navigation,
      userLogout,
      auth,
      group,
    } = this.props;
    const groupsData = await findUserGroupsByUserId({
      token: auth.token,
      count: init ? 0 : group.groups.count,
    });

    invalidAuthentication({
      queryResult: groupsData,
      userLogout: userLogout,
      navigation: navigation,
    });
  };

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
          label="Rewards"
          icon={() => (
            <MaterialIcons name="treasure-chest" color={'grey'} size={25} />
          )}
          labelStyle={styles.labelStyle}
          onPress={() => {
            props.navigation.push('RewardNavigator');
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
  const {group, auth, post} = state;
  return {group, auth, post};
};

const mapDispatchToProps = dispatch => {
  return {
    findUserGroupsByUserId: data => dispatch(findUserGroupsByUserId(data)),
    cleanGroup: () => dispatch(cleanGroup()),
    userLogout: () => dispatch(userLogout()),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
    getGroupPointLeaderBoard: data => dispatch(getGroupPointLeaderBoard(data)),
    getGroupJoinRequestCount: data => dispatch(getGroupJoinRequestCount(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupDrawerNavigator);
