import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import {
  getAllUserChat,
  deleteUserChat,
  timeoutUser,
  getUserChat,
  switchOwnership,
  searchUserChat,
  getSingleChat,
} from '../actions/chat';
import {connect} from 'react-redux';
import UserChatList from '../components/userChat/userChatList';
import HeaderRight from '../components/chat/headerRightButton';
import ChatMemberModal from '../components/chat/chatMemberModal';
import SearchBar from '../components/users/userSearch/searchBar';
import {getTheme} from '../utils/theme';

class ChatMembers extends React.Component {
  state = {
    users: [],
    count: 0,
    ...this.props.route.params,
    refreshing: false,
    modalVisible: false,
    userId: null,
    search_term: '',
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Members',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
    // this.loadUserChat(true);
    this.onSearchChange('', true);
    this.getUserChat();
  }

  componentDidUpdate(prevProps, prevState) {
    const {route, navigation, group} = this.props;
    const {theme} = this.state
    if (route.params.refresh) {
      navigation.setParams({refresh: false});
      // this.loadUserChat(true);
      this.onSearchChange('', true);
    }
    if (prevState.status != this.state.status && this.state.status) {
      const {status, allow_invite} = this.state;
      let disabled = status.is_owner ? false : !allow_invite;
      if (group.group.auth) {
        const {auth, rank_setting} = group.group;
        disabled = auth.rank > rank_setting.manage_chat_rank_required;
      }
      navigation.setOptions({
        headerRight: () =>
          disabled ? null : (
            <HeaderRight
              type={'create'}
              disabled={disabled}
              onPress={this.onAddHeaderPress}
              theme={theme}
            />
          ),
      });
    }
  }

  getUserChat = async () => {
    const {auth, getUserChat, chat} = this.props;
    const {chatId} = this.state;

    const request = {
      token: auth.token,
      chatId,
    };

    const req = await getUserChat(request);
    if (req.errors) {
      console.log(req.errors[0]);
      alert('Get User Status Error');
      return;
    }

    this.setState({status: req});
  };

  onAddHeaderPress = () => {
    const {navigation, group} = this.props;
    const {chatId} = this.state;

    navigation.navigate('SearchUser', {
      prev_route: 'chatMembers',
      chatId,
      group: group.group.id ? group.group : null,
    });
  };

  loadUserChat = async init => {
    const {auth, getAllUserChat, group} = this.props;
    const {chatId, count} = this.state;

    const request = {
      token: auth.token,
      chatId,
      count: init ? 0 : count,
      groupId: group.group ? group.group.id : null,
    };

    const req = await getAllUserChat(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get chat members right now, please try again later');
      return;
    }

    this.setState(prevState => {
      return {
        users: init ? req.users : prevState.users.concat(req.users),
        count: req.count,
      };
    });
  };

  deleteUserChat = async () => {
    const {auth, deleteUserChat} = this.props;
    const {userId, chatId} = this.state;
    const request = {
      token: auth.token,
      userIds: [userId],
      chatId,
    };
    const req = await deleteUserChat(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot delete user from chat at this time');
      return;
    }

    if (req == 0) {
      this.setState(prevState => {
        return {
          users: prevState.users.filter(u => u.userId != userId),
        };
      });
    }
  };

  timeoutUser = async duration => {
    const {auth, timeoutUser} = this.props;
    const {userId, chatId} = this.state;
    const request = {
      token: auth.token,
      userIds: [userId],
      chatId,
      duration,
    };
    const req = await timeoutUser(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot timeout user right now');
      return;
    }

    if (req == 0) {
      this.setState(prevState => {
        return {
          users: prevState.users.map(u => {
            if (u.userId == userId) {
              let timeout = new Date();
              timeout = Math.floor(timeout.getTime() / 1000);
              duration = parseInt(duration);
              timeout = (timeout + duration) * 1000;
              return {
                ...u,
                timeout,
              };
            }
            return u;
          }),
        };
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadUserChat(true);
    this.setState({refreshing: false});
  };

  onEndReached = () => {
    const {search_term} = this.state;
    this.onSearchChange(search_term, false);
    // this.loadUserChat(false);
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onMemberCardPress = userId => {
    this.setState({modalVisible: true, userId});
  };

  onSwitchOwner = async () => {
    const {switchOwnership, auth} = this.props;
    const {userId, chatId} = this.state;
    const request = {
      token: auth.token,
      userIds: [userId],
      chatId,
    };

    const req = await switchOwnership(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot switch ownership at this moment, please try again later.');
      return;
    }

    if (req == 0) {
      // update your status and new owner's status
      this.setState(prevState => {
        const new_users = prevState.users.map(u => {
          if (u.userId == userId) {
            return {
              ...u,
              is_owner: true,
            };
          }
          if (u.userId == auth.user.id) {
            return {
              ...u,
              is_owner: false,
            };
          }
          return u;
        });
        return {
          users: new_users,
          status: {
            ...prevState.status,
            is_owner: false,
          },
        };
      });
    }
  };

  getSingleChat = async second_userId => {
    const {getSingleChat, auth, navigation} = this.props;
    const {chatId} = this.state;

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

    if (req) {
      navigation.navigate('Chat', {second_userId, prev_chatId: chatId});
    }
  };

  onOptionSelect = (type, value) => {
    if (type == 'delete') {
      Alert.alert(
        'Remove user',
        'Do you want to remove this user from this chat?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Confirm', onPress: this.deleteUserChat, style: 'destructive'},
        ],
      );
    }

    if (type == 'timeout') {
      const duration = value.toString();
      this.timeoutUser(duration);
    }

    if (type == 'dm') {
      const {userId} = this.state;
      this.getSingleChat(userId);
    }

    if (type == 'ownership') {
      // switch ownership
      Alert.alert(
        'Switch Ownership',
        'Do you want to make this user the new chat owner?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Confirm', onPress: this.onSwitchOwner, style: 'default'},
        ],
      );
    }
    this.onBackdropPress();
  };

  onSearchChange = async (text, init) => {
    const {search_term, chatId} = this.state;

    const term = text.trim();
    this.setState({search_term: text});

    const count =
      search_term != text ? 0 : init || init == null ? 0 : this.state.count;
    const {searchUserChat, auth, group} = this.props;

    const groupId = group.group ? group.group.id : null;

    const request = {
      search_term: term,
      groupId,
      chatId,
      count,
      token: auth.token,
    };

    const req = await searchUserChat(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Search user failed, please try again later.');
      return;
    }

    this.setState(prevState => {
      return {
        users:
          init || init == null ? req.users : prevState.users.concat(req.users),
        count: req.count,
      };
    });
  };

  render() {
    const {
      users,
      refreshing,
      modalVisible,
      userId,
      status,
      rank_req,
      search_term,
      theme
    } = this.state;
    const {group, auth} = this.props;

    let func_disabled = false;
    let can_remove_user = false;
    if (userId) {
      const user = users.filter(u => u.userId == userId)[0];
      if (user) {
        func_disabled = user.is_owner;
      }

      can_remove_user = !func_disabled;
      if (group.group.auth && user) {
        const {auth, rank_setting} = group.group;

        // if you have the chat management rank and the selected user rank is greater than yours
        func_disabled = !(
          auth.rank <= rank_setting.manage_chat_rank_required &&
          user.rank >= auth.rank
        );

        // if func is not disabled and if user is within the rank requirement
        can_remove_user = user.rank <= rank_req ? false : !func_disabled;
      }
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, theme.greyArea]}>
          <View style={styles.list}>
            <SearchBar value={search_term} onChange={this.onSearchChange} theme={theme}/>
            <UserChatList
              users={users}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              onEndReached={this.onEndReached}
              onMemberCardPress={this.onMemberCardPress}
              user_id={auth.user.id}
              theme={theme}
            />
          </View>
          {modalVisible ? (
            <ChatMemberModal
              modalVisible={modalVisible}
              onBackdropPress={this.onBackdropPress}
              func_disabled={func_disabled}
              onOptionSelect={this.onOptionSelect}
              is_owner={status.is_owner}
              can_remove_user={can_remove_user}
              theme={theme}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  list: {
    padding: 7,
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapStateToDispatch = dispatch => {
  return {
    getAllUserChat: data => dispatch(getAllUserChat(data)),
    deleteUserChat: data => dispatch(deleteUserChat(data)),
    timeoutUser: data => dispatch(timeoutUser(data)),
    getUserChat: data => dispatch(getUserChat(data)),
    switchOwnership: data => dispatch(switchOwnership(data)),
    searchUserChat: data => dispatch(searchUserChat(data)),
    getSingleChat: data => dispatch(getSingleChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch,
)(ChatMembers);
