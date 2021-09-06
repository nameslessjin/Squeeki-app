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
import {logUserEvent} from '../actions/userEvent';
import {getTheme} from '../utils/theme';

class GroupDrawerNavigator extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  onToggleHeaderRightButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  componentDidMount() {
    const {navigation, group, route} = this.props;
    const {auth, status, id} = group.group;
    const {theme} = this.state;
    navigation.setOptions({
      headerRight: () =>
        auth == null || status != 'active' ? null : (
          <HeaderRightButton
            onPress={this.onToggleHeaderRightButton}
            theme={theme}
          />
        ),
      headerTitle: group.group.display_name,
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });

    this.reloadGroup({groupId: null, isFullRefresh: false});

    if (route.params) {
      if (route.params.log) {
        this.logUserEvent(route.params.log);
      }
    }

    // create user event log for group visit
    const log = {
      triggerId: id,
      trigger: 'group',
      event: 'group_visit',
    };
    this.logUserEvent(log);
  }

  componentDidUpdate(prevProps) {
    const {navigation, group, route} = this.props;
    const {auth, status} = group.group;
    const {theme} = this.state;
    navigation.setOptions({
      headerRight: () =>
        auth == null || status != 'active' ? null : (
          <HeaderRightButton
            onPress={this.onToggleHeaderRightButton}
            theme={theme}
          />
        ),
    });

    if (!prevProps.group.group.auth && group.group.auth) {
      this.reloadGroup({groupId: null, isFullRefresh: false});
    }

    if (route.params) {
      const {refresh, prevRoute} = route.params;
      if (refresh) {
        if (prevRoute == 'GroupSetting') {
          this.reloadGroup({groupId: null, isFullRefresh: true});
        } else if (
          prevRoute == 'PostSetting' ||
          prevRoute == 'Comment' ||
          prevRoute == 'NominationResult' ||
          prevRoute == 'CheckIn' ||
          prevRoute == 'GroupChats' ||
          prevRoute == 'GroupRules' ||
          prevRoute == 'GroupRewards' ||
          prevRoute == 'GroupMembers' ||
          prevRoute == 'Leaderboard' ||
          prevRoute == 'TaskManagement'
        ) {
          this.reloadGroup({groupId: null, isFullRefresh: false});
        }

        navigation.setParams({refresh: false});
      }
    }
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
        prevRoute == 'RewardDetail' ||
        prevRoute == 'RewardDropList' ||
        prevRoute == 'Chat' ||
        prevRoute == 'PostCard' ||
        prevRoute == 'Comment' ||
        prevRoute == 'Home' ||
        prevRoute == 'GroupNavigator'
      ) {
        // MyRewads have no previous group page
        // if has previous group page thus reload group and reward
        // from nongroup/subgroup back to nongroup/subgroup
        if (groupId) {
          this.reloadGroup({groupId, isFullRefresh: true});
        }

        // if the prevRoute is not PostCard or Comment or Chat, pass params back
        // from group to group
        if (
          !(
            prevRoute == 'PostCard' ||
            prevRoute == 'Comment' ||
            prevRoute == 'Chat'
          )
        ) {
          navigation.navigate(prevRoute, {
            refresh: true,
            groupId,
          });
        }
      } else {
        // if the current route is general group page then load groups
        // from group back to groups
        this.loadGroups(true);
      }
    }
  }

  logUserEvent = async log => {
    const {auth, logUserEvent, metadata} = this.props;
    const request = {
      token: auth.token,
      log,
      ip: metadata.IP ? metadata.IP.ip : null,
      userAgent: metadata.userAgent,
    };

    console.log(request);

    const req = logUserEvent(request);
  };

  reloadGroup = async ({groupId, isFullRefresh}) => {
    //reload previous group
    if (groupId) {
      await this.getGroup(groupId);
      this.loadLeaderBoard(groupId);
      this.getUserGroupPoint(groupId);
      return;
    }

    // reload current group
    const {visibility, auth, rank_setting, id} = this.props.group.group;

    if (isFullRefresh) {
      await this.getGroup(id);
    }

    if (visibility || auth != null) {
      this.loadLeaderBoard();

      if (auth != null) {
        this.getUserGroupPoint();
        if (auth.rank <= rank_setting.manage_member_rank_required) {
          this.getGroupJoinRequestCount();
        }
      }
    }
  };

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

  navigateToTabs = destination => {
    const {navigation} = this.props;

    if (destination == 'RewardNavigator') {
      navigation.push(destination);
    } else {
      navigation.navigate(destination);
    }

    navigation.dispatch(DrawerActions.closeDrawer());
  };

  CustomDrawerContent = props => {
    const {group, group_join_request_count} = this.props.group;
    const {auth, rank_setting} = group;
    const {theme} = this.state;
    return auth == null ? null : (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Rules"
          icon={() => (
            <MaterialIcons
              name="script-text"
              size={25}
              style={theme.groupDrawerTagIconColor}
            />
          )}
          labelStyle={[styles.labelStyle, theme.drawerTextColor]}
          onPress={() => {
            this.navigateToTabs('GroupRules');
          }}
        />
        <DrawerItem
          label={({focused, color}) => (
            <Text style={[styles.labelStyle, theme.drawerTextColor]}>
              Members{' '}
              {auth.rank <= rank_setting.manage_member_rank_required &&
              group_join_request_count > 0 ? (
                <View style={styles.notification}>
                  <Text style={styles.notificationText}>
                    {group_join_request_count}
                  </Text>
                </View>
              ) : null}
            </Text>
          )}
          icon={() => (
            <MaterialIcons
              name="account-group"
              style={theme.groupDrawerTagIconColor}
              size={25}
            />
          )}
          labelStyle={[styles.labelStyle, theme.drawerTextColor]}
          onPress={() => {
            this.navigateToTabs('Members');
          }}
        />
        <DrawerItem
          label="Group Chats"
          icon={() => (
            <MaterialIcons
              name="chat"
              style={theme.groupDrawerTagIconColor}
              size={25}
            />
          )}
          labelStyle={[styles.labelStyle, theme.drawerTextColor]}
          onPress={() => {
            this.navigateToTabs('Chats');
          }}
        />
        <DrawerItem
          label="Nomination"
          icon={() => (
            <MaterialIcons
              name="poll-box"
              style={theme.groupDrawerTagIconColor}
              size={25}
            />
          )}
          labelStyle={[styles.labelStyle, theme.drawerTextColor]}
          onPress={() => {
            this.navigateToTabs('NominationResults');
          }}
        />
        <DrawerItem
          label="Check In"
          icon={() => (
            <MaterialIcons
              name="check-bold"
              style={theme.groupDrawerTagIconColor}
              size={25}
            />
          )}
          labelStyle={[styles.labelStyle, theme.drawerTextColor]}
          onPress={() => {
            this.navigateToTabs('CheckIn');
          }}
        />
        <DrawerItem
          label="Rewards"
          icon={() => (
            <MaterialIcons
              name="treasure-chest"
              style={theme.groupDrawerTagIconColor}
              size={25}
            />
          )}
          labelStyle={[styles.labelStyle, theme.drawerTextColor]}
          onPress={() => {
            this.navigateToTabs('RewardNavigator');
          }}
        />
        <DrawerItem
          label="Settings"
          icon={() => (
            <MaterialIcons
              name="cog"
              style={theme.groupDrawerTagIconColor}
              size={25}
            />
          )}
          labelStyle={[styles.labelStyle, theme.drawerTextColor]}
          onPress={() => {
            this.navigateToTabs('GroupSetting');
          }}
        />
      </DrawerContentScrollView>
    );
  };

  render() {
    const {groupname, display_name} = this.props.group.group;
    const {theme} = this.state;
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
          drawerStyle: [styles.drawerStyle, theme.backgroundColor],
        }}
        initialRouteName="Group"
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
  const {group, auth, post, metadata} = state;
  return {group, auth, post, metadata};
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
    logUserEvent: data => dispatch(logUserEvent(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupDrawerNavigator);
