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
} from '../actions/chat';
import {connect} from 'react-redux';
import UserChatList from '../components/userChat/userChatList';
import HeaderRight from '../components/chat/headerRightButton';
import ChatMemberModal from '../components/chat/chatMemberModal';

class ChatMembers extends React.Component {
  state = {
    users: [],
    count: 0,
    ...this.props.route.params,
    refreshing: false,
    refresh: false,
    modalVisible: false,
    userId: null,
  };

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Members',
    });
    this.loadUserChat(true);
    this.getUserChat();
  }

  componentDidUpdate(prevProps, prevState) {
    const {route, navigation, group} = this.props;
    if (route.params.refresh) {
      navigation.setParams({refresh: false});
      this.loadUserChat(true);
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
    this.loadUserChat(false);
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

  render() {
    const {users, refreshing, modalVisible, userId, status, rank_req} = this.state;
    const {group, auth} = this.props;

    let func_disabled = false;
    let can_remove_user = false
    if (userId) {
      const user = users.filter(u => u.userId == userId)[0];
      if (user) {
        func_disabled = user.is_owner;
      }

      can_remove_user = !func_disabled
      if (group.group.auth) {
        const {auth, rank_setting} = group.group;

        // if you have the chat management rank and the selected user rank is greater than yours
        func_disabled = !(
          auth.rank <= rank_setting.manage_chat_rank_required &&
          user.rank >= auth.rank
        );
        // if func is not disabled and if user is within the rank requirement
        can_remove_user = user.rank <= rank_req ? false : !func_disabled
      }
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <View style={{padding: 7, alignItems: 'center'}}>
            <UserChatList
              users={users}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              onEndReached={this.onEndReached}
              onMemberCardPress={this.onMemberCardPress}
              user_id={auth.user.id}
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
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({});

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
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch,
)(ChatMembers);
