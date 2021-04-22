import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  StatusBar,
  Keyboard,
  Dimensions,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {
  getChat,
  getUserChat,
  updateChatInfo,
  createChat,
  changeUserChatNotification,
} from '../actions/chat';
import {getChatFunc, subSocket} from '../functions/chat';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  sendMessage,
  getChatMessage,
  updateUserMessage,
} from '../actions/message';
import {getUserRelation, updateUserRelation} from '../actions/user';
import {sendMessageFunc, getChatMessageFunc} from '../functions/message';
import {socket} from '../../server_config';
import ChatMediaModal from '../components/chat/chatMediaModal';
import {
  RenderSend,
  RenderActions,
  OnLongPress,
} from '../components/chat/render';
import {timeDifferentInMandS} from '../utils/time';
import HeaderRightButton from '../components/chat/headerRightButton';
import ChatDMModal from '../components/chat/chatDMModal';

const {height} = Dimensions.get('screen');

class Chat extends React.Component {
  state = {
    name: '',
    rank_req: 7,
    icon: null,
    allow_invite: false,
    allow_modify: false,
    available: false,
    ...this.props.route.params,
    ...this.props.chat.chat,
    messages: [],
    content: '',
    pointer: null,
    isLoadEarlier: false,
    modalVisible: false,
    chatDMModalVisible: false,
    image: {},
    status: {
      notification: true,
    },
    user_relation: {
      to: {
        is_dm_block: false,
      },
      from: {
        is_dm_block: false,
      },
    },
    appState: AppState.currentState,
  };

  componentDidMount() {
    const {navigation, route, group} = this.props;
    const {name, id, icon, is_dm, second_userId} = this.state;
    navigation.setOptions({
      headerShown: false,
    });
    if (id == null || is_dm) {
      navigation.setOptions({
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitle: name,
        headerRight: () => (
          <HeaderRightButton
            type={'icon'}
            disabled={false}
            icon_url={icon == null ? null : icon.uri}
            onPress={() => this.setState({chatDMModalVisible: true})}
          />
        ),
      });
      //Load person to person status/create if doesn't exist (process)(probable do this in the next page)
      if (second_userId) {
        this.getUserRelation({second_userId});
      }
    }

    if (id) {
      // load some messages
      this.loadChatMessage(true);

      if (is_dm) {
        this.getUserRelation({chatId: id});
      }

      this.getUserChat(id);

      // establish socket.io connection
      const channel = `chat${id}`;
      const io = socket.getIO();
      io.on(channel, data => {
        if (data.action == 'create') {
          this.addSubMessage(data.result);
        } else if (data.action == 'message_status_update') {
          this.updateUserMessage(data.result);
        } else if (data.action == 'user_status_update') {
          this.updateUserStatus(data.result);
        } else if (data.action == 'user_relation_update') {
          this.updateUserRelation(data.result);
        }
      });
    }

    //AppState.  When change from inactive to active.  Load new messages
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  updateUserRelation = data => {
    const {from, second_userId} = data;
    const {id} = this.props.auth.user;

    if (id == second_userId) {
      this.setState(prevState => {
        return {
          user_relation: {
            ...prevState.user_relation,
            from: from,
          },
        };
      });
    }
  };

  getUserRelation = async ({second_userId, chatId}) => {
    const {auth, getUserRelation} = this.props;

    const request = {
      token: auth.token,
      chatId,
      second_userId,
    };

    const req = await getUserRelation(request);
    if (req.errors) {
      console.log(req.errors[0]);
      alert('Get User Status Error');
      return;
    }

    this.setState({user_relation: req});
  };

  getUserChat = async chatId => {
    const {auth, getUserChat} = this.props;

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

  updateUserStatus = data => {
    const {status, userId} = data;
    const {id} = this.props.auth.user;
    const time = new Date(status.timeout);
    if (id == userId) {
      this.setState({status: {...status, timeout: time.getTime()}});
    }
  };

  addSubMessage = data => {
    const {message, pointer} = data;
    this.setState(prevState => {
      return {
        pointer: prevState.pointer ? prevState.pointer : pointer,
        messages: message.concat(prevState.messages),
      };
    });

    // set message to read here
    const {auth, updateUserMessage} = this.props;
    const {id} = this.state;
    const request = {
      token: auth.token,
      messageId: message[0]._id,
      chatId: id,
      status: 'read',
    };

    updateUserMessage(request);
  };

  updateUserMessage = data => {
    const {userId, messageId, status} = data.update;

    const {id} = this.props.auth.user;
    this.setState(prevState => {
      let updatedMessages = [...prevState.messages];
      const updatedMessageIndex = updatedMessages.findIndex(
        m => m._id === messageId,
      );

      if (updatedMessageIndex > -1) {
        if (id == userId) {
          if (status == 'delete') {
            updatedMessages = updatedMessages.filter(m => m._id != messageId);
          } else {
            updatedMessages[updatedMessageIndex].status = status;
          }
        }
      }
      return {
        messages: updatedMessages,
      };
    });
  };

  loadChatMessage = async init => {
    const {getChatMessage, navigation, userLogout, auth} = this.props;
    const {pointer, id} = this.state;

    const data = {
      token: auth.token,
      chatId: id,
      getChatMessage,
      navigation,
      userLogout,
      pointer: pointer,
    };

    this.setState({isLoadEarlier: true});
    const req = await getChatMessageFunc(data);
    this.setState({isLoadEarlier: false});
    if (req) {
      const {messages, pointer} = req;
      this.setState(prevState => {
        return {
          ...prevState,
          pointer: pointer,
          messages: prevState.messages.concat(
            messages.map(m => {
              return {...m, createdAt: new Date(parseInt(m.createdAt))};
            }),
          ),
        };
      });
    }
  };

  onSend = async () => {
    const {sendMessage, navigation, userLogout, auth, createChat} = this.props;
    let {
      content,
      id,
      status,
      messages,
      second_userId,
      user_relation,
      name,
    } = this.state;

    this.setState({content: ''});
    Keyboard.dismiss();

    // check out user timeout in group chat
    if (status.timeout) {
      const time_out = new Date(parseInt(status.timeout));
      const different = time_out - Date.now();
      const {day, hour, minute, second} = timeDifferentInMandS(time_out);

      if (different > 0) {
        const system_message = {
          _id: messages.length.toString(),
          text: `You have been timed out for ${day}d ${hour}h ${minute}m ${second}s`,
          createdAt: new Date(),
          system: true,
        };
        this.setState(prevState => ({
          messages: [system_message].concat(prevState.messages),
        }));
        return;
      }
    }

    // check if user is blocked by the other user in a DM
    if (user_relation.from) {
      const {is_dm_blocked} = user_relation.from;
      if (is_dm_blocked) {
        const system_message = {
          _id: messages.length.toString(),
          text: `You have been blocked by ${name}`,
          createdAt: new Date(),
          system: true,
        };
        this.setState(prevState => ({
          messages: [system_message].concat(prevState.messages),
        }));
        return;
      }
    }

    // if a DM between two users never exist.  Create a chat and get chatId
    if (id == null) {
      // create chat and user Chat first await
      const request = {
        second_userId,
        token: auth.token,
      };

      const req = await createChat(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Cannot send message right now, please try again later');
        return;
      }

      id = req.id;

      this.getUserChat(id);
      this.getUserRelation({second_userId});

      // establish socket.io connection
      const channel = `chat${id}`;
      const io = socket.getIO();
      io.on(channel, data => {
        if (data.action == 'create') {
          this.addSubMessage(data.result);
        } else if (data.action == 'message_status_update') {
          this.updateUserMessage(data.result);
        } else if (data.action == 'user_status_update') {
          this.updateUserStatus(data.result);
        }
      });
    }

    if (id != null) {
      const data = {
        token: auth.token,
        chatId: id,
        content,
        sendMessage,
        navigation,
        userLogout,
        media: null,
      };
      sendMessageFunc(data);
    }
  };

  onLongPress = (context, message) => {
    const {updateUserMessage, auth} = this.props;
    const {id} = this.state;
    const props = {
      id,
      updateUserMessage,
      auth,
      context,
      message,
    };

    OnLongPress(props);
  };

  loadChat = async () => {
    const {group, auth, getChat, navigation, userLogout} = this.props;

    const request = {
      groupId: group.group.id,
      count: 0,
      token: auth.token,
      getChat: getChat,
      navigation: navigation,
      userLogout: userLogout,
    };

    const req = await getChatFunc(request);

    this.subSocket(req);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chat.chat != this.props.chat.chat) {
      const {navigation} = this.props;
      const {
        id,
        name,
        rank_req,
        available,
        icon,
        allow_invite,
        allow_modify,
      } = this.props.chat.chat;

      this.setState({
        id,
        name,
        rank_req,
        available,
        icon,
        allow_invite,
        allow_modify,
      });
    }
  }

  componentWillUnmount() {
    this.loadChat(true);
    const channel = `chat${this.state.id}`;
    const io = socket.getIO();
    io.off(channel);

    // AppState listener
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    const {appState, id} = this.state;
    if (appState.match(/(inactive|background)/) && nextAppState === 'active') {
      // reload chat message
      if (id) {
        this.loadChatMessage(true);
      }
    }
    this.setState({appState: nextAppState});
  };

  subSocket = req => {
    const {group, updateChatInfo} = this.props;

    // if not in group all chats in chat.chats
    let socket_chat_id = req.chat;

    // if in group only the one with proper rank or people who are added
    if (group.group.id) {
      socket_chat_id = req.chat.filter(c => c.available);
    }
    socket_chat_id = socket_chat_id.map(c => c.id);

    subSocket(socket_chat_id, updateChatInfo);
  };

  onInputChange = text => {
    this.setState({content: text});
  };

  onActionPress = () => {
    Keyboard.dismiss();
    this.setState({modalVisible: true});
  };

  onChangeMedia = value => {
    this.setState({image: {...value}});
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false, chatDMModalVisible: false});
  };

  onMediaUpload = media => {
    this.setState({modalVisible: false});

    const {sendMessage, navigation, userLogout, auth} = this.props;
    const {id} = this.state;
    const data = {
      token: auth.token,
      chatId: id,
      media,
      content: '',
      sendMessage,
      navigation,
      userLogout,
    };

    Keyboard.dismiss();
    const req = sendMessageFunc(data);
  };

  onUserPress = async type => {
    const {auth, changeUserChatNotification, updateUserRelation} = this.props;
    const {id, user_relation, second_userId} = this.state;
    let req = null;
    if (type == 'notification') {
      const request = {
        token: auth.token,
        chatId: id,
      };
      req = await changeUserChatNotification(request);
      if (req.errors) {
        console.log(req.errors);
        alert(
          'Cannot change notification setting right now, please try again later.',
        );
        return;
      }
      if (req == 0) {
        this.setState(prevState => ({
          status: {
            ...prevState.status,
            notification: !prevState.status.notification,
          },
        }));
      }
    } else if (type == 'block') {
      const {is_dm_blocked} = user_relation.to;
      const request = {
        token: auth.token,
        second_userId,
        is_dm_blocked: !is_dm_blocked,
        chatId: id,
      };

      req = await updateUserRelation(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Cannot change setting right now, please try again later.');
        return;
      }
      if (req) {
        this.setState(prevState => {
          const new_user_relation = {...prevState.user_relation, to: req};

          return {
            user_relation: new_user_relation,
          };
        });
      }
    }
  };

  render() {
    const {auth} = this.props;
    const {
      content,
      messages,
      pointer,
      isLoadEarlier,
      modalVisible,
      user_relation,
      chatDMModalVisible,
      status,
      name,
      icon,
    } = this.state;
    const user = {
      _id: auth.user.id,
    };

    return (
      <View>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <GiftedChat
            messages={messages}
            renderUsernameOnMessage={true}
            text={content}
            user={user}
            onInputTextChanged={this.onInputChange}
            onSend={this.onSend}
            primaryStyle={{backgroundColor: 'white'}}
            keyboardShouldPersistTaps={'never'}
            alwaysShowSend={true}
            bottomOffset={35}
            renderSend={p => (
              <RenderSend text={this.state.content.trim()} onSend={p.onSend} />
            )}
            loadEarlier={pointer == 'Infinity' ? false : true}
            onLoadEarlier={() => this.loadChatMessage(false)}
            isLoadingEarlier={isLoadEarlier}
            infiniteScroll={true}
            keyboardShouldPersistTaps={'never'}
            renderActions={p => (
              <RenderActions
                bottomOffset={p.bottomOffset}
                onActionPress={this.onActionPress}
              />
            )}
            maxInputLength={5000}
            maxComposerHeight={200}
            onLongPress={(context, message) =>
              this.onLongPress(context, message)
            }
            scrollToBottom={true}
          />
        </KeyboardAvoidingView>
        <ChatMediaModal
          modalVisible={modalVisible}
          onBackdropPress={this.onBackdropPress}
          onMediaUpload={this.onMediaUpload}
        />
        <ChatDMModal
          modalVisible={chatDMModalVisible}
          onBackdropPress={this.onBackdropPress}
          name={name}
          icon_url={icon != null ? icon.uri : null}
          status={status}
          user_relation={user_relation}
          onPress={this.onUserPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => {
  const {auth, group, chat} = state;
  return {auth, group, chat};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getChat: data => dispatch(getChat(data)),
    sendMessage: data => dispatch(sendMessage(data)),
    getChatMessage: data => dispatch(getChatMessage(data)),
    getUserChat: data => dispatch(getUserChat(data)),
    updateChatInfo: data => dispatch(updateChatInfo(data)),
    updateUserMessage: data => dispatch(updateUserMessage(data)),
    createChat: data => dispatch(createChat(data)),
    getUserRelation: data => dispatch(getUserRelation(data)),
    changeUserChatNotification: data =>
      dispatch(changeUserChatNotification(data)),
    updateUserRelation: data => dispatch(updateUserRelation(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
