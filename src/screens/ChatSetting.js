import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  StatusBar,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/chat/headerRightButton';
import {userLogout} from '../actions/auth';
import {
  getChat,
  createChat,
  updateChat,
  deleteLeaveChat,
  updateChatInfo,
} from '../actions/chat';
import {
  createUpdateChatFunc,
  getChatFunc,
  deleteLeaveChatFunc,
} from '../functions/chat';
import Input from '../components/chat/settingInput';
import ChatIconModal from '../components/chat/chatIconModal';
import {socket} from '../../server_config';
import ToggleSetting from '../components/chat/toggleSetting';
import { StackActions } from '@react-navigation/native';

class ChatSetting extends React.Component {
  state = {
    name: '',
    rank_req: 7,
    icon: null,
    chatId: null,
    loading: false,
    origin: null,
    modalVisible: false,
    deleted: false,
    allow_invite: false,
    allow_modify: false,
    status: null,
  };

  componentDidMount() {
    const {navigation, route} = this.props;

    if (route.params) {
      const {
        name,
        rank_req,
        icon,
        chatId,
        allow_invite,
        allow_modify,
        status,
      } = route.params;
      this.setState({
        origin: route.params,
        name,
        rank_req,
        icon,
        chatId,
        allow_invite,
        allow_modify,
        status,
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            type={'done'}
            disabled={true}
            onPress={this.onCreateUpdateChat}
          />
        ),
      });
    }

    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Settings',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      const {navigation} = this.props;
      const {chatId} = this.state;
      if (!chatId) {
        navigation.setOptions({
          headerRight: () => (
            <HeaderRightButton
              type={'done'}
              disabled={!this.validation()}
              onPress={this.onCreateUpdateChat}
            />
          ),
        });
      }
    }
  }

  componentWillUnmount() {
    const {
      chatId,
      name,
      rank_req,
      icon,
      deleted,
      status,
      allow_modify,
    } = this.state;
    const {navigation} = this.props;

    // if it is to update chat setting
    if (chatId) {
      if (!deleted) {
        // update chat setting if condition met
        // const {group}
        const {group} = this.props.group;
        let update = true;

        if (group.id) {
          if (group.auth.rank > group.rank_setting.manage_chat_rank_required) {
            update = false;
          }
        } else {
          // check if it is group owner.  if not then null
          if (!status.is_owner && !allow_modify) {
            update = false;
          }
        }

        update = this.validation();

        if (update) {
          this.onCreateUpdateChat();
        }
      } else {
        // if delete or leave current chat then reload chats
        this.loadChat(true);
      }
    }
  }

  validation = () => {
    let {
      name,
      type,
      rank_req,
      icon,
      origin,
      allow_invite,
      allow_modify,
    } = this.state;
    if (name.length < 3) {
      return false;
    }

    if (rank_req) {
      if (rank_req > 7 || rank_req < 0) {
        return false;
      }

      if (rank_req.length == 0) {
        return false;
      }
    }

    if (origin) {
      // if both icon and original icon exist
      if (icon && origin.icon) {
        if (icon.uri != origin.icon.uri) {
          return true;
        }
      }

      // if icon exist and original icon is  null
      if (icon && origin.icon == null) {
        return true;
      }

      // check changes in other conditions
      if (
        name != origin.name ||
        rank_req != origin.rank_req ||
        allow_invite != origin.allow_invite ||
        allow_modify != origin.allow_modify
      ) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  };

  onCreateUpdateChat = async () => {
    const {
      userLogout,
      navigation,
      auth,
      group,
      createChat,
      updateChat,
    } = this.props;
    const {
      name,
      rank_req,
      icon,
      chatId,
      origin,
      allow_modify,
      allow_invite,
    } = this.state;

    const request = {
      groupId: group.group.id,
      name: name.trim(),
      rank_req: group.group.id ? rank_req : null,
      allow_modify,
      allow_invite,
      icon: origin
        ? origin.icon
          ? origin.icon.uri == icon.uri
            ? null
            : icon
          : icon
        : icon,
      token: auth.token,
      navigation,
      userLogout,
      createChat,
      updateChat,
      chatId,
    };

    this.setState({loading: true});
    const req = await createUpdateChatFunc(request);
    if (!chatId) {
      this.setState({loading: false});
    }

    if (chatId) {
      // navigation.navigate('Chat');
    } else {
      this.loadChat(true);
      navigation.dispatch(StackActions.pop(1))
    }
  };

  loadChat = async init => {
    const {group, auth, getChat, navigation, userLogout, chat} = this.props;

    const request = {
      groupId: group.group.id,
      count: init ? 0 : chat.count,
      token: auth.token,
      getChat: getChat,
      navigation: navigation,
      userLogout: userLogout,
    };

    const req = await getChatFunc(request);

    this.subSocket(req);
  };

  subSocket = req => {
    const {group, updateChatInfo} = this.props;

    // if not in group all chats in chat.chats
    let socket_chat_id = req.chat;

    // if in group only the one with proper rank
    if (group.group.id) {
      socket_chat_id = req.chat.filter(
        c => c.rank_req >= group.group.auth.rank,
      );
    }
    socket_chat_id = socket_chat_id.map(c => c.id);
    const io = socket.getIO();
    socket_chat_id.forEach(id => {
      const channel = `chats${id}`;
      io.on(channel, data => {
        if (data.action == 'add') {
          //this.update chat
          updateChatInfo(data.result);
        }
      });
    });
  };

  onInputChange = (type, value) => {
    if (type == 'name') {
      this.setState({name: value});
    } else if (type == 'rank') {
      this.setState({rank_req: value ? parseInt(value) : ''});
    } else if (type == 'icon') {
      this.setState({modalVisible: true});
    } else if (type == 'delete' || type == 'leave') {
      Alert.alert(
        type == 'delete' ? 'Delete the chat' : 'Leave the chat',
        null,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: this.deleteLeaveChat,
            style: 'destructive',
          },
        ],
      );
    }
  };

  deleteLeaveChat = async () => {
    const {chatId} = this.state;
    const {navigation} = this.props;
    this.setState({loading: true, deleted: true});
    const request = await deleteLeaveChatFunc({...this.props, chatId});
    this.setState({loading: false});
    navigation.dispatch(StackActions.pop(2))
  };

  setIcon = (data, type) => {
    this.setState({icon: data, modalVisible: false});
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onToggle = type => {
    this.setState(prevState => {
      return {
        allow_invite:
          type == 'invite' ? !prevState.allow_invite : prevState.allow_invite,
        allow_modify:
          type == 'modify' ? !prevState.allow_modify : prevState.allow_modify,
      };
    });
  };

  render() {
    const {
      name,
      type,
      rank_req,
      icon,
      modalVisible,
      loading,
      chatId,
      allow_invite,
      allow_modify,
      status,
    } = this.state;

    // if in group
    const {group} = this.props.group;

    let deleteButton = (
      <Input type={'delete'} onInputChange={this.onInputChange} />
    );

    let disabled = false;

    if (!chatId) {
      deleteButton = null;
    } else {
      if (group.id) {
        if (group.auth.rank > group.rank_setting.manage_chat_rank_required) {
          deleteButton = null;
          disabled = true;
        }
      } else {

        if (!status.is_owner) {
          deleteButton = <Input type={'leave'} onInputChange={this.onInputChange} />;
        }
        if (!status.is_owner && !allow_modify) {
          disabled = true;
        }
      }
    }


    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <Input
            type={'icon'}
            value={icon}
            onInputChange={this.onInputChange}
            disabled={disabled}
          />
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
            disabled={disabled}
          />

          {group.id ? (
            <Input
              type={'rank'}
              value={rank_req.toString()}
              onInputChange={this.onInputChange}
              disabled={disabled}
            />
          ) : null}

          {group.id ? null : (
            <ToggleSetting
              type={'invite'}
              on={allow_invite}
              onToggle={this.onToggle}
              disabled={disabled}
            />
          )}
          {group.id ? null : (
            <ToggleSetting
              type={'modify'}
              on={allow_modify}
              onToggle={this.onToggle}
              disabled={disabled}
            />
          )}

          {deleteButton}

          {loading ? (
            <ActivityIndicator animating={loading} style={{marginTop: 20}} color={'grey'} />
          ) : null}
          <ChatIconModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onChangeMedia={this.setIcon}
          />
        </KeyboardAvoidingView>
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
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    createChat: data => dispatch(createChat(data)),
    userLogout: () => dispatch(userLogout()),
    updateChat: data => dispatch(updateChat(data)),
    getChat: data => dispatch(getChat(data)),
    deleteLeaveChat: data => dispatch(deleteLeaveChat(data)),
    updateChatInfo: data => dispatch(updateChatInfo(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatSetting);
