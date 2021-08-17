import React from 'react';
import {View, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getGroupMembers} from '../actions/user';
import {getGroupMembersFunc} from '../functions/user';
import {getGroupJoinRequestCountFunc} from '../functions/group';
import {getGroupJoinRequestCount, getGroupRankName} from '../actions/group';
import MemberList from '../components/users/members/memberList';
import AddButton from '../components/users/members/addButton';
import {searchGroupMembers, cleanMembers} from '../actions/user';

class Users extends React.Component {
  state = {
    loading: false,
    search_term: '',
    searched_users: [],
    count: 0,
  };

  onSearchChange = async (text, init = true) => {
    const {search_term} = this.state;
    const term = text != null ? text.trim() : search_term.trim();
    if (text != null) {
      this.setState({search_term: text});
    }

    if (term.length < 3) {
      this.setState({searched_users: [], count: 0});
      return;
    }

    const {
      auth,
      navigation,
      userLogout,
      group,
      searchGroupMembers,
    } = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
      search_term: term,
      count: init ? 0 : this.state.count,
    };

    const req = await searchGroupMembers(request);
    if (req.errors) {
      console.log(req.errors);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    const {count, members} = req;

    this.setState(prevState => {
      return {
        count: count,
        searched_users:
          count == 10 ? members : prevState.searched_users.concat(members),
      };
    });
  };

  onPress = () => {
    const {navigation, group} = this.props;
    navigation.navigate('SearchUser', {
      group: group.group,
      prev_route: 'members',
    });
  };

  onJoinRequestPress = () => {
    const {navigation} = this.props;
    // go to join request page
    navigation.navigate('GroupJoinRequest');
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    const {group_join_request_count} = group;
    const button =
      group.group.auth.rank <=
      group.group.rank_setting.manage_member_rank_required ? (
        <AddButton
          onPress={this.onPress}
          onJoinRequestPress={this.onJoinRequestPress}
          group_join_request_count={group_join_request_count}
        />
      ) : null;
    navigation.setOptions({
      headerRight: () => button,
      headerBackTitleVisible: false,
    });
    this.loadGroupMembers(true);
    this.getGroupJoinRequestCount();
    this.getGroupRankName();
  }

  componentWillUnmount() {
    const {group, navigation, cleanMembers} = this.props;
    cleanMembers();
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'GroupMembers',
      });
    }
  }

  getGroupRankName = async () => {
    const {getGroupRankName, auth, group} = this.props;
    const request = {
      groupId: group.group.id,
      token: auth.token,
    };

    const req = await getGroupRankName(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get rank names at this time, please try again later');
      return;
    }
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

  componentDidUpdate() {
    const {navigation, group} = this.props;
    const {group_join_request_count} = group;
    const button =
      group.group.auth.rank <=
      group.group.rank_setting.manage_member_rank_required ? (
        <AddButton
          onPress={this.onPress}
          onJoinRequestPress={this.onJoinRequestPress}
          group_join_request_count={group_join_request_count}
        />
      ) : null;
    navigation.setOptions({
      headerRight: () => button,
      headerBackTitleVisible: false,
    });
  }

  loadGroupMembers = init => {
    const {
      navigation,
      getGroupMembers,
      auth,
      group,
      userLogout,
      user,
    } = this.props;
    const {id} = group.group;
    const {token} = auth;
    const data = {
      token: token,
      groupId: id,
      getGroupMembers: getGroupMembers,
      navigation: navigation,
      userLogout: userLogout,
      count: init ? 0 : user.members.count,
    };
    getGroupMembersFunc(data);
  };

  onEndReached = () => {
    const {searched_users} = this.state;
    this.setState({loading: true});
    if (searched_users.length == 0) {
      this.loadGroupMembers(false);
    } else {
      this.onSearchChange(null, false);
    }
    this.setState({loading: false});
  };

  render() {
    const {user, navigation, group} = this.props;
    const {search_term, searched_users} = this.state;
    const members =
      searched_users.length == 0 ? user.members.members : searched_users;

    return (
      <View style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
        <StatusBar barStyle={'dark-content'} />
        <MemberList
          members={members}
          navigation={navigation}
          onEndReached={this.onEndReached}
          group={group.group}
          onSearchChange={this.onSearchChange}
          search_term={search_term}
          rankName={group.rankName}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {auth, group, user} = state;
  return {auth, group, user};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupMembers: data => dispatch(getGroupMembers(data)),
    userLogout: () => dispatch(userLogout()),
    searchGroupMembers: data => dispatch(searchGroupMembers(data)),
    getGroupJoinRequestCount: data => dispatch(getGroupJoinRequestCount(data)),
    getGroupRankName: data => dispatch(getGroupRankName(data)),
    cleanMembers: () => dispatch(cleanMembers()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Users);
