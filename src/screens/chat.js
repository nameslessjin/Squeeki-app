import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  StatusBar,
  Keyboard,
  Linking,
  AppState,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {
  getChat,
  getUserChat,
  updateChatInfo,
  createChat,
  changeUserChatNotification,
  getSingleChat,
  searchAtUserChat,
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
  onUrlPress,
  onPhonePress,
  onEmailPress,
  onLinkPhoneLongPress,
  RenderTicks,
  RenderMessageImage,
  renderComposer,
  renderBubble,
  renderText,
  renderMessageContainer,
  renderMessageText,
  renderTime,
  renderInputToolBar,
} from '../components/chat/render';
import {timeDifferentInMandS} from '../utils/time';
import HeaderRightButton from '../components/chat/headerRightButton';
import ChatDMModal from '../components/chat/chatDMModal';
import {
  detectFile,
  detectAtPeopleNGroup,
  detectAtUserNGroupInCurrentText,
} from '../utils/detect';
import {editPhoto} from '../utils/imagePicker';
import {searchAtGroup, getSingleGroupById} from '../actions/group';
import {singleDefaultIcon} from '../utils/defaultIcon';
import {getTheme} from '../utils/theme';

const {width} = Dimensions.get('screen');

class Chat extends React.Component {
  state = {
    name: '',
    rank_req: 7,
    icon: null,
    allow_invite: false,
    allow_modify: false,
    available: false,
    is_dm: false,
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
    searchTerm: '',
    searchIndex: -1,
    atSearchResult: [],
    atListShow: false,
    inputHeight: 35,
    barHeight: 35,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    this._giftedChatRef = undefined;
    const {navigation, route, group} = this.props;
    const {name, id, icon, is_dm, second_userId, theme} = this.state;
    let headerTitleSize = 18;
    if (name.trim().length >= 15) {
      headerTitleSize = 16;
    }

    if (name.trim().length >= 20) {
      headerTitleSize = 15;
    }

    if (name.trim().length >= 30) {
      headerTitleSize = 13;
    }

    if (name.trim().length >= 35) {
      headerTitleSize = 11;
    }

    if (name.trim().length >= 40) {
      headerTitleSize = 10;
    }

    if (name.trim().length >= 45) {
      headerTitleSize = 8;
    }

    navigation.setOptions({
      headerShown: false,
    });
    if (id == null || is_dm) {
      navigation.setOptions({
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitle: name.trim(),
        headerTitleStyle: {
          fontSize: headerTitleSize,
        },
        headerRight: () => (
          <HeaderRightButton
            type={'icon'}
            disabled={false}
            icon_url={icon == null ? null : icon.uri}
            onPress={() => this.setState({chatDMModalVisible: true})}
            theme={theme}
          />
        ),
        headerStyle: theme.backgroundColor,
        headerTintColor: theme.textColor.color,
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

    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
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

    // if user is not the sender, update the userMessage to read
    if (this.props.auth.user.id != message[0].user._id) {
      // set message to read here
      const {auth, updateUserMessage} = this.props;
      const {id} = this.state;
      const request = {
        token: auth.token,
        messageId: message[0]._id,
        chatId: id,
        status: 'read',
      };

      setTimeout(() => {
        updateUserMessage(request);
      }, 300);
    }
  };

  updateUserMessage = data => {
    const {userId, messageId, status} = data.update;
    const {is_dm} = this.state;
    const {id} = this.props.auth.user;
    this.setState(prevState => {
      let updatedMessages = [...prevState.messages];
      const updatedMessageIndex = updatedMessages.findIndex(
        m => m._id === messageId,
      );

      if (updatedMessageIndex > -1) {
        // if the user decide to update message status is the current user
        if (id == userId && status == 'delete') {
          updatedMessages = updatedMessages.filter(m => m._id != messageId);
        }

        // if it is a dm chat and the other user read the message, update all the message to read in the front end
        if (status == 'read' && is_dm) {
          // updatedMessages[updatedMessageIndex].status.read_count = 2;
          updatedMessages = updatedMessages.map(m => {
            if (m.status.read_count == 2) {
              return m;
            }
            return {
              ...m,
              status: {
                ...m.status,
                read_count: 2,
              },
            };
          });
        }
      }
      return {
        messages: updatedMessages,
      };
    });
  };

  loadChatMessage = async init => {
    const {getChatMessage, navigation, userLogout, auth} = this.props;
    const {pointer, id, is_dm} = this.state;

    const data = {
      token: auth.token,
      chatId: id,
      getChatMessage,
      navigation,
      userLogout,
      pointer: init ? null : pointer,
      is_dm,
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
          messages: (init ? [] : prevState.messages).concat(
            messages.map(m => {
              return {
                ...m,
                user: {
                  ...m.user,
                  avatar: m.user.avatar ? m.user.avatar : singleDefaultIcon(),
                },
                createdAt: new Date(parseInt(m.createdAt)),
              };
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
    let message_status = 'active';

    this.setState({content: '', atListShow: false});

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
        content = `You have been blocked by ${name}`;
        message_status = 'system';

        const system_message = {
          _id: messages.length.toString(),
          text: content,
          createdAt: new Date(),
          system: true,
        };
        this.setState(prevState => ({
          messages: [system_message].concat(prevState.messages),
        }));
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
        message_status: message_status,
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
    const {barHeight, inputHeight, atSearchResult, atListShow} = this.state;
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

    if (
      prevState.searchTerm != this.state.searchTerm &&
      this.state.searchTerm.length != 0
    ) {
      this.onAtSearch();
    }

    if (barHeight < inputHeight) {
      this.setState({barHeight: inputHeight});
    }

    if (prevState.inputHeight > inputHeight) {
      this.setState({barHeight: inputHeight});
    }

    if (
      prevState.atSearchResult.length != atSearchResult.length &&
      atListShow
    ) {
      let newBarHeight = inputHeight;
      if (atSearchResult.length < 3) {
        newBarHeight = newBarHeight + atSearchResult.length * 50 + 15;
      } else {
        newBarHeight = 180;
      }
      this.setState({
        barHeight: newBarHeight,
      });
    }

    if (!atListShow && prevState.atListShow != atListShow) {
      this.setState({barHeight: inputHeight});
    }
  }

  componentWillUnmount() {
    const channel = `chat${this.state.id}`;
    const io = socket.getIO();
    io.off(channel);
    // AppState listener
    AppState.removeEventListener('change', this._handleAppStateChange);

    Keyboard.removeAllListeners('focus');

    // if user is directed from another chat.  Go back and load the previous chat
    const {prev_chatId} = this.state;

    // for now assume all prev_chat is group chat not DM
    if (prev_chatId) {
      this.getSingleChat(prev_chatId);
      return;
    }

    this.loadChat(true);
  }

  getSingleChat = async (chatId, second_userId, is_dm) => {
    const {getSingleChat, auth, navigation} = this.props;
    const {id} = this.state;
    const request = {
      token: auth.token,
      chatId,
      second_userId,
    };

    const req = await getSingleChat(request);

    if (req.errors) {
      console.log(req.errors[0]);
      alert('load chat failed at this time, please try again later');
      return false;
    }

    if (second_userId) {
      if (req) {
        navigation.navigate('Chat', {second_userId, prev_chatId: id});
      }
    }
  };

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

  _keyboardDidHide = () => {
    this.setState({atSearchResult: []});
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
    // detect url path
    const {is_image, imageType} = detectFile(text);

    if (is_image) {
      const image = {
        path: text,
        type: imageType,
      };
      editPhoto(image, this.onMediaUpload);
      this.setState({content: ''});
      return;
    }

    const {searchTerm, searchIndex} = detectAtPeopleNGroup({
      prevText: this.state.content,
      currentText: text,
    });

    // @user
    if (!this.state.is_dm && searchTerm[0] == '@') {
      this.setState({searchTerm, searchIndex});
    } else if (
      (searchTerm[0] == 'g' || searchTerm[0] == 'G') &&
      searchTerm[1] == '@'
    ) {
      // g@groupname
      this.setState({searchTerm, searchIndex});
    } else {
      this.setState({searchTerm: '', searchIndex: -1, atSearchResult: []});
    }

    this.setState({content: text});
  };

  onActionPress = () => {
    Keyboard.dismiss();
    this.setState({modalVisible: true, atListShow: false});
  };

  onBackdropPress = () => {
    this.setState({
      modalVisible: false,
      chatDMModalVisible: false,
      atListShow: false,
    });
  };

  onMediaUpload = media => {
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

  onPressAvatar = async props => {
    const {_id} = props;
    const {auth, navigation} = this.props;
    const {id} = auth.user;
    const {second_userId, is_dm} = this.state;

    // if user press on self, do nothing
    if (_id == id) {
      return;
    }
    // if user press second user in DM,
    if (_id == second_userId || is_dm) {
      this.setState({chatDMModalVisible: true});
      return;
    }
    this.getSingleChat(null, _id);
  };

  onAtSearch = async () => {
    const {searchTerm, id} = this.state;
    const {group, auth, searchAtUserChat, searchAtGroup} = this.props;

    const request = {
      groupId: group.group.id,
      search_term:
        searchTerm[0] == '@'
          ? searchTerm.substr(1, searchTerm.length)
          : searchTerm.substr(2, searchTerm.length),
      chatId: id,
      token: auth.token,
    };

    const result =
      searchTerm[0] == '@'
        ? await searchAtUserChat(request)
        : await searchAtGroup(request);

    if (result.errors) {
      console.log(result.errors);
      return;
    }

    this.setState({atSearchResult: result, atListShow: result.length > 0});
  };

  onAtUserNGroupPress = item => {
    const {username, groupname} = item;
    const {searchTerm, searchIndex, content} = this.state;

    let updatedContent = content.split(' ');
    updatedContent[searchIndex] = username ? `@${username}` : `g@${groupname}`;
    updatedContent = updatedContent.join(' ') + ' ';

    this.setState({
      content: updatedContent.substr(0, 500),
      atSearchResult: [],
      atListShow: false,
    });
  };

  onAtUserNGroupHightlightPress = message => {
    const components = message.substr(1, message.length - 2).split(':');

    const atText = components[0];
    const displayName = components[1];
    const id = components[2];

    // @username check
    if (atText[0] == '@') {
      this.onPressAvatar({_id: id});
    } else if (atText[0] == 'g' && atText[1] == '@') {
      // g@groupname check
      this.getGroup(id);
    }
  };

  getGroup = async id => {
    const {auth, getSingleGroupById, group, navigation} = this.props;
    const request = {
      id,
      token: auth.token,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot load group at this time, please try again later');
      return;
    }

    navigation.push('GroupNavigator', {
      prevRoute: 'Chat',
      groupId: group.group.id,
    });
  };

  inputHeightAdjustment = e => {
    const height = e.nativeEvent.contentSize.height;
    let inputHeight = height + 15;
    this.setState(prevState => ({
      inputHeight: inputHeight < 100 ? inputHeight : prevState.inputHeight,
    }));
  };

  render() {
    const {auth, updateUserMessage} = this.props;
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
      is_dm,
      id,
      atSearchResult,
      theme,
      inputHeight,
      barHeight,
      atListShow,
    } = this.state;
    const user = {
      _id: auth.user.id,
    };

    return (
      <KeyboardAvoidingView>
        <KeyboardAvoidingView
          style={[styles.container, theme.backgroundColor]}
          behavior={Platform.OS == 'ios' ? 'padding' : 'overflow'}
          keyboardVerticalOffset={35}>
          <GiftedChat
            ref={component => (this._giftedChatRef = component)}
            messages={messages}
            renderUsernameOnMessage={!is_dm}
            text={content}
            user={user}
            isKeyboardInternallyHandled={false}
            parsePatterns={linkStyle => {
              return [
                {
                  type: 'url',
                  style: linkStyle,
                  onPress: onUrlPress,
                  onLongPress: url =>
                    onLinkPhoneLongPress({type: 'url', content: url}),
                },
                {
                  type: 'phone',
                  style: linkStyle,
                  onPress: phone =>
                    onPhonePress({
                      phone,
                      ...this._giftedChatRef._actionSheetRef,
                    }),
                  onLongPress: phone =>
                    onLinkPhoneLongPress({type: 'phone', content: phone}),
                },
                {
                  type: 'email',
                  style: linkStyle,
                  onPress: onEmailPress,
                  onLongPress: email =>
                    onLinkPhoneLongPress({type: 'email', content: email}),
                },
                {
                  pattern: /\[(@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
                  style: styles.atUser,
                  renderText: renderText,
                  onPress: m => this.onAtUserNGroupHightlightPress(m),
                },
                {
                  pattern: /\[(g@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
                  style: {color: '#1e90ff', fontWeight: '500'},
                  renderText: renderText,
                  onPress: m => this.onAtUserNGroupHightlightPress(m),
                },
              ];
            }}
            onInputTextChanged={this.onInputChange}
            onSend={this.onSend}
            primaryStyle={[theme.backgroundColor]}
            keyboardShouldPersistTaps={'never'}
            alwaysShowSend={true}
            // bottomOffset={33}
            renderSend={p => (
              <RenderSend text={this.state.content.trim()} onSend={p.onSend} />
            )}
            loadEarlier={pointer == 'Infinity' ? false : true}
            onLoadEarlier={() => this.loadChatMessage(false)}
            isLoadingEarlier={isLoadEarlier}
            infiniteScroll={true}
            keyboardShouldPersistTaps={'never'}
            // renderActions={p => (
            //   <RenderActions
            //     bottomOffset={p.bottomOffset}
            //     onActionPress={this.onActionPress}
            //     theme={theme}
            //   />
            // )}
            maxComposerHeight={80}
            maxInputLength={500}
            onLongPress={(context, message) =>
              this.onLongPress(context, message)
            }
            scrollToBottom={true}
            onPressAvatar={this.onPressAvatar}
            renderTicks={message => (
              <RenderTicks
                message={message}
                is_dm={is_dm}
                isSelf={this.props.auth.user.id == message.user._id}
              />
            )}
            renderMessageImage={giftchat => (
              <RenderMessageImage
                giftchat={giftchat}
                actionSheet={this._giftedChatRef._actionSheetRef}
                chatId={id}
                auth={auth}
                updateUserMessage={updateUserMessage}
              />
            )}
            // renderComposer={props =>
            //   renderComposer({
            //     ...props,
            //     atSearchResult,
            //     onAtUserNGroupPress: this.onAtUserNGroupPress,
            //     theme,
            //   })
            // }
            renderInputToolbar={() => null}
            renderBubble={props => renderBubble({...props})}
            renderMessageContainer={props => renderMessageContainer({...props})}
            renderMessageText={props => renderMessageText({...props})}
            renderTime={props => renderTime({...props})}
          />
          {renderInputToolBar({
            text: content,
            onSend: this.onSend,
            theme,
            atSearchResult,
            onInputTextChanged: this.onInputChange,
            onAtUserNGroupPress: this.onAtUserNGroupPress,
            onActionPress: this.onActionPress,
            inputHeightAdjustment: this.inputHeightAdjustment,
            inputHeight,
            barHeight,
            atListShow,
          })}
        </KeyboardAvoidingView>

        <ChatMediaModal
          modalVisible={modalVisible}
          onBackdropPress={this.onBackdropPress}
          onMediaUpload={this.onMediaUpload}
          theme={theme}
        />
        <ChatDMModal
          modalVisible={chatDMModalVisible}
          onBackdropPress={this.onBackdropPress}
          name={name}
          icon_url={icon != null ? icon.uri : null}
          status={status}
          user_relation={user_relation}
          onPress={this.onUserPress}
          theme={theme}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  url: {},
  atUser: {
    color: '#1e90ff',
    // fontWeight: 'bold',
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
    getSingleChat: data => dispatch(getSingleChat(data)),
    searchAtUserChat: data => dispatch(searchAtUserChat(data)),
    searchAtGroup: data => dispatch(searchAtGroup(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
