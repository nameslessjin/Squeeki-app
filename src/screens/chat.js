import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TouchableOpacity,
  Animated,
  Keyboard,
  Dimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getChat, getUserChat, updateChatInfo} from '../actions/chat';
import HeaderRightButton from '../components/chat/headerRightButton';
import {getChatFunc} from '../functions/chat';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Actions,
} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  sendMessage,
  getChatMessage,
  updateUserMessage,
} from '../actions/message';
import {sendMessageFunc, getChatMessageFunc} from '../functions/message';
import {socket} from '../../server_config';
import ChatMediaModal from '../components/chat/chatMediaModal';
import {
  RenderSend,
  RenderActions,
  OnLongPress,
} from '../components/chat/render';
import {timeDifferentInMandS} from '../utils/time'

const {height} = Dimensions.get('screen');

class Chat extends React.Component {
  state = {
    name: '',
    rank_req: 7,
    icon: null,
    allow_invite: false,
    allow_modify: false,
    available: false,
    // ...this.props.route.params,
    ...this.props.chat.chat,
    messages: [],
    content: '',
    pointer: null,
    status: null,
    isLoadEarlier: false,
    modalVisible: false,
    image: {},
    status: {},
  };

  componentDidMount() {
    const {navigation, route, group} = this.props;
    const {name, id} = this.state;
    navigation.setOptions({
      headerShown: false,
      // headerBackTitleVisible: false,
      // headerTitle: name,
      // headerRight: () => (
      //   <HeaderRightButton
      //     type={'setting'}
      //     disabled={false}
      //     onPress={this.onSettingPress}
      //   />
      // ),
    });

    // load some messages
    this.loadChatMessage(true);
    this.getUserChat(id);

    // establish socket.io connection
    const channel = `chat${id}`;
    const io = socket.getIO();
    io.on(channel, data => {
      if (data.action == 'create') {
        this.addSubMessage(data.result);
      } else if (data.action == 'message_status_update') {
        this.updateUserMessage(data.result);
      } else if (data.action == 'user_status_update'){
        this.updateUserStatus(data.result)
      }
    });
  }

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
    const {status, userId} = data
    const {id} = this.props.auth.user
    const time = new Date(status.timeout)
    if (id == userId){
      this.setState({status: {...status, timeout: time.getTime()}})
    }
  
  }

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
    const {sendMessage, navigation, userLogout, auth} = this.props;
    const {content, id, status, messages} = this.state;
    console.log(status.timeout)
    const time_out = new Date(parseInt(status.timeout));
    const different = time_out - Date.now();
    console.log(time_out)
    console.log(different)
    const {day, hour, minute, second}  = timeDifferentInMandS(time_out)

    this.setState({content: ''});
    Keyboard.dismiss();
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

    const data = {
      token: auth.token,
      chatId: id,
      content,
      sendMessage,
      navigation,
      userLogout,
      media: null,
    };
    const req = sendMessageFunc(data);
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
        name,
        rank_req,
        available,
        icon,
        allow_invite,
        allow_modify,
      } = this.props.chat.chat;

      this.setState({
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
  }

  subSocket = req => {
    const {group, updateChatInfo} = this.props;

    // if not in group all chats in chat.chats
    let socket_chat_id = req.chat;

    // if in group only the one with proper rank or people who are added
    if (group.group.id) {
      socket_chat_id = req.chat.filter(c => c.available);
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

  onInputChange = text => {
    this.setState({content: text});
  };

  renderSend = p => {
    const text = this.state.content.trim();
    const props = {
      text,
      onSend: p.onSend,
    };
    return <RenderSend {...props} />;
  };

  renderActions = props => {
    const p = {
      bottomOffset: props.bottomOffset,
      onActionPress: this.onActionPress,
    };

    return <RenderActions {...p} />;
  };

  onActionPress = () => {
    Keyboard.dismiss();
    this.setState({modalVisible: true});
  };

  onChangeMedia = value => {
    this.setState({image: {...value}});
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
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

  render() {
    const {auth} = this.props;
    const {
      content,
      messages,
      pointer,
      isLoadEarlier,
      modalVisible,
      status
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
            renderSend={this.renderSend}
            loadEarlier={pointer == 'Infinity' ? false : true}
            onLoadEarlier={this.loadChatMessage}
            isLoadingEarlier={isLoadEarlier}
            infiniteScroll={true}
            keyboardShouldPersistTaps={'never'}
            renderActions={this.renderActions}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
