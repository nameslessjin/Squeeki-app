import React from 'react';
import {View, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getGroupMembers} from '../actions/user';
import {getGroupMembersFunc} from '../functions/user';
import MemberList from '../components/users/members/memberList';
import AddButton from '../components/users/members/addButton';

class Users extends React.Component {
  state = {
    loading: false,
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
      group.group.auth.rank <= 2 ? (
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
  }

  componentDidUpdate() {
    const {navigation, group} = this.props;
    const {group_join_request_count} = group;
    const button =
      group.group.auth.rank <= 2 ? (
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
    this.setState({loading: true});
    this.loadGroupMembers(false);
    this.setState({loading: false});
  };

  render() {
    const {user, navigation, group} = this.props;
    return (
      <View style={{width: '100%', height: '100%'}}>
        <StatusBar barStyle={'dark-content'} />
        <MemberList
          members={user.members}
          navigation={navigation}
          onEndReached={this.onEndReached}
          group={group.group}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Users);
