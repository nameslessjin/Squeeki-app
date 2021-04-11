import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import UserSearchBar from '../components/users/userSearch/searchBar';
import DoneButton from '../components/users/userSearch/doneButton';
import {searchUser, addMembers, getGroupMembers} from '../actions/user';
import {userCheckInBatch, getGroupCheckInResult} from '../actions/checkin';
import {getSingleChat} from '../actions/chat';
import {createUserChat} from '../actions/chat';
import {searchUserFunc, getGroupMembersFunc} from '../functions/user';
import UserList from '../components/users/userList';
import DisplayNameList from '../components/users/userSearch/displayNameList';
import { StackActions } from '@react-navigation/native';
import { unsubSocket } from '../functions/chat'

class UserSearch extends React.Component {
  state = {
    searchTerm: '',
    usersData: [],
    count: 0,
    chosenUser: [],
    group: null,
    chatId: null,
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {chosenUser} = this.state;
    const {params} = this.props.route;
    if (params) {
      // group and pre_route is passed in every instance
      const {group, prev_route, chatId} = params;
      this.setState({group: group, prev_route: prev_route, chatId});

      // // if it is chat from group then load group members
      if (
        (prev_route == 'chatMembers' ||
          prev_route == 'CheckInResult' ||
          prev_route == 'PostSetting') &&
        group != null
      ) {
        this.onSearchChange('');
      }
    }

    const button =
      params.prev_route == 'PostSetting' || params.prev_route == 'DM' ? null : (
        <DoneButton
          disabled={chosenUser.length == 0}
          onPress={this.onAddMembers}
        />
      );
    navigation.setOptions({
      headerTitle:
        params.prev_route == 'PostSetting' ? 'Pick nominee' : 'Search User',
      headerRight: () => button,
      headerBackTitleVisible: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {navigation} = this.props;
    const {chosenUser, prev_route, searchTerm} = this.state;
    if (prevState.searchTerm != searchTerm) {
      this.setState({usersData: [], count: 0});
    }
    const button =
      prev_route == 'PostSetting' || prev_route == 'DM' ? null : (
        <DoneButton
          disabled={chosenUser.length == 0}
          onPress={this.onAddMembers}
        />
      );
    navigation.setOptions({
      headerRight: () => button,
    });
  }

  componentWillUnmount() {
    const {prev_route} = this.state;
    if (prev_route == 'PostSetting') {
    } else if (prev_route == 'members') {
      this.loadGroupMembers(true);
    } else if (prev_route == 'CheckInResult') {
      this.loadCheckInResult(true);
    } else if (prev_route == 'chatMembers') {
      // load chat members for individual chats and group chats
      const {navigation} = this.props;
      navigation.navigate('ChatMembers', {
        refresh: true,
      });
    } else if (prev_route == 'DM') {
      // for direct message
    }
  }

  // for unmount only
  loadGroupMembers = init => {
    const {
      navigation,
      auth,
      userLogout,
      getGroupMembers,
      route,
      user,
    } = this.props;

    const group = route.params.group;
    let userIdList = [];

    const data = {
      token: auth.token,
      groupId: group.id,
      navigation: navigation,
      userLogout: userLogout,
      count: 0,
      getGroupMembers: getGroupMembers,
      userIdList: userIdList,
    };

    getGroupMembersFunc(data);
  };

  // for unmount only
  loadCheckInResult = async init => {
    const {
      userLogout,
      getGroupCheckInResult,
      auth,
      route,
      navigation,
      checkin,
    } = this.props;

    const count = checkin.attendee_count;
    const request = {
      token: auth.token,
      count: init ? 0 : count,
      checkin_id: route.params.checkin_id,
    };

    const req = await getGroupCheckInResult(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load users at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  onAddMembers = async () => {
    const {chosenUser, group, chatId} = this.state;
    const chosenUserIds = chosenUser.map(u => u.id);
    const {
      auth,
      navigation,
      userLogout,
      addMembers,
      route,
      userCheckInBatch,
      createUserChat,
    } = this.props;
    let request = {};
    let req = 0;

    // only for previous route member and checkin
    if (route.params) {
      const {prev_route, checkin_id} = route.params;
      if (prev_route == 'CheckInResult') {
        request = {
          token: auth.token,
          userId: chosenUserIds,
          checkin_id: checkin_id,
          groupId: group.id,
        };
        req = await userCheckInBatch(request);
      } else if (prev_route == 'members') {
        request = {
          token: auth.token,
          chosenUserIds: chosenUserIds,
          groupId: group.id,
        };
        req = await addMembers(request);
      } else if (prev_route == 'chatMembers') {
        // add members on chat members
        request = {
          token: auth.token,
          userIds: chosenUserIds,
          chatId,
        };
        // either change addMembers or write a function for add chatMembers
        req = await createUserChat(request);
      }
    }

    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot add members at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    navigation.goBack();

    return;
  };

  onSearchChange = async text => {
    const term = text.trim();

    const {usersData, searchTerm} = this.state;
    this.setState({searchTerm: text});

    const count = searchTerm != text ? 0 : this.state.count;
    const {searchUser, auth, navigation, userLogout, route} = this.props;
    const {prev_route, group, chatId} = route.params;

    const groupId = group ? group.id : null;

    // search for general users
    if (
      term.length < 3 &&
      (prev_route == 'members' ||
        prev_route == 'DM' ||
        (prev_route == 'chatMembers' && group == null))
    ) {
      this.setState({usersData: [], count: 0});
      return;
    }

    let userIdList = [];
    let inGroup = false;
    let checkin_id = null;

    userIdList = route.params.userIdList || [];
    if (
      prev_route == 'PostSetting' ||
      prev_route == 'CheckInResult' ||
      (group != null && prev_route == 'chatMembers')
    ) {
      inGroup = true;
    }

    if (prev_route == 'CheckInResult') {
      checkin_id = route.params.checkin_id;
    }

    const data = {
      searchUser: searchUser,
      auth: auth,
      navigation: navigation,
      userLogout: userLogout,
      count: count,
      searchTerm: term,
      groupId: groupId,
      userIdList: userIdList,
      inGroup: inGroup,
      checkin_id: checkin_id,
      chatId: chatId,
    };

    const searchResult = await searchUserFunc(data);

    if (searchResult != 0) {
      const {users, count} = searchResult;
      const format_users = users.map(u => {
        return {
          ...u,
          chosen: false,
        };
      });
      const newUsers = usersData.concat(format_users);

      this.setState(prevState => {
        return {
          usersData: searchTerm == text ? newUsers : format_users,
          count: count,
        };
      });
    }

    return;
  };

  onEndReached = async () => {
    const {searchTerm} = this.state;

    this.onSearchChange(searchTerm);
  };

  onChooseUser = user => {
    let {chosenUser, usersData, prev_route, group} = this.state;
    const {navigation} = this.props;

    let newChosenUser = [];
    let newUsersData = [];

    if (prev_route == 'PostSetting' && chosenUser.length != 0) {
      chosenUser = [];
    }

    if (chosenUser.find(u => u.id == user.id)) {
      newChosenUser = chosenUser.filter(u => u.id != user.id);
      newUsersData = usersData.map(u => {
        if (u.id == user.id) {
          return {
            ...u,
            chosen: false,
          };
        }
        return u;
      });
    } else {
      chosenUser.push(user);
      newChosenUser = [...chosenUser];
      newUsersData = usersData.map(u => {
        if (u.id == user.id) {
          return {
            ...u,
            chosen: true,
          };
        }
        return u;
      });
    }
    this.setState({chosenUser: newChosenUser, usersData: newUsersData});
    // if choose a nominee then navigate to the next page
    if (prev_route == 'PostSetting' && newChosenUser.length == 1) {
      navigation.navigate('Nomination', {
        chosenUser: newChosenUser[0],
        prev_route: 'PostSetting',
        groupId: group.id,
      });
    }

    // if choose a person to DM then navigate to a chat page
    if (prev_route == 'DM' && newChosenUser.length == 1) {
      // Try to get existing Single Chat
      // if single chat exist load everything like it is a single chat but for DM
      // if single chat does not exist, get one without chatId, create an official one when send message
      const second_userId = newChosenUser[0].id
      this.getSingleChat(second_userId)
    }
  };


  getSingleChat = async second_userId => {
    const {getSingleChat, auth, navigation, chat} = this.props;

    const request = {
      token: auth.token,
      second_userId,
    };

    const req = await getSingleChat(request);

    if (req.errors) {
      console.log(req.errors[0]);
      alert('load chat failed at this time, please try again later');
      return false;
    }

    if (req){
      // unsub socket
      const {chat} = this.props
      const socket_chat_id = chat.chats;
      unsubSocket(socket_chat_id)
      navigation.dispatch(StackActions.replace('Chat', {second_userId: second_userId}))
    }

  };

  render() {
    const {searchTerm, usersData, chosenUser, prev_route, group} = this.state;
    const {navigation, user, auth} = this.props;

    let search_view = (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <View style={styles.optionArea}>
          <UserSearchBar onChange={this.onSearchChange} value={searchTerm} />
        </View>
        {chosenUser.length == 0 ||
        prev_route == 'PostSetting' ||
        prev_route == 'DM' ? null : (
          <View style={styles.chosenList}>
            <DisplayNameList
              chosenUser={chosenUser}
              onChooseUser={this.onChooseUser}
            />
          </View>
        )}
        <UserList
          usersData={usersData}
          onEndReached={this.onEndReached}
          navigation={navigation}
          onChooseUser={this.onChooseUser}
          prev_route={prev_route}
          chosenUser={chosenUser}
          currentUserId={auth.user.id}
        />
      </KeyboardAvoidingView>
    );

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {search_view}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
  },
  optionArea: {
    width: '90%',
    height: '5%',
    marginTop: '3%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS == 'ios' ? 10 : 20,
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    width: '10%',
    height: '80%',
  },
  chosenList: {
    height: 30,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 3,
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
});

const mapStateToProps = state => {
  const {auth, user, checkin, chat} = state;
  return {auth, user, checkin, chat};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    searchUser: data => dispatch(searchUser(data)),
    addMembers: data => dispatch(addMembers(data)),
    getGroupMembers: data => dispatch(getGroupMembers(data)),
    userCheckInBatch: data => dispatch(userCheckInBatch(data)),
    getGroupCheckInResult: data => dispatch(getGroupCheckInResult(data)),
    createUserChat: data => dispatch(createUserChat(data)),
    getSingleChat: data => dispatch(getSingleChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSearch);
