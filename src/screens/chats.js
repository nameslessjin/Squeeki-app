import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import {
  getChat,
  getAllChatId,
  updateChatInfo,
  getSingleChat,
  resetChatReducer,
  changeUserChatNotification,
  updatePinChat,
} from '../actions/chat';
import {userLogout} from '../actions/auth';
import HeaderRightButton from '../components/chat/headerRightButton';
import {getChatFunc, unsubSocket, subSocket} from '../functions/chat';
import List from '../components/chat/chatList';
import NewChatModal from '../components/chat/newChatModal';

class Chats extends React.Component {
  state = {
    loading: false,
    refreshing: false,
    modalVisible: false,
    appState: AppState.currentState,
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Chats',
    });

    if (group.group.auth) {
      const {auth, rank_setting} = group.group;
      navigation.setOptions({
        headerRight: () =>
          auth.rank > rank_setting.manage_chat_rank_required ? null : (
            <HeaderRightButton
              onPress={() => navigation.navigate('ChatSetting')}
              type={'create'}
              disabled={false}
            />
          ),
      });
    }

    // for chat in a group, load chat
    if (group.group.id) {
      this.loadChat(true);
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    const {currentScreen} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'Chats' &&
      prevScreen.currentScreen != 'Chats'
    ) {
      this.loadChat(true);
    }
  }

  navigateToOptions = type => {
    const {navigation} = this.props;
    if (type == 'chatroom') {
      navigation.navigate('ChatSetting');
    } else if (type == 'DM') {
      navigation.navigate('SearchUser', {
        prev_route: 'DM',
      });
    }
  };

  onBackdropPress = () => {
    const {navigation} = this.props;
    navigation.setParams({modalVisible: false});
  };

  componentWillUnmount() {
    this.unsubSocket();
    this.props.resetChatReducer();
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    const {appState} = this.state;
    if (appState.match(/(inactive|background)/) && nextAppState === 'active') {
      // reload chat
      this.loadChat(true);
    } else if (
      appState === 'active' &&
      nextAppState.match(/(inactive|background)/)
    ) {
      this.unsubSocket();
    }
    this.setState({appState: nextAppState});
  };

  unsubSocket = () => {
    const {chat, group} = this.props;
    // if not in group all chats in chat.chats
    let socket_chat_id = chat.chats;

    // if in group only the one with proper rank or people who added to chat
    if (group.group.auth) {
      socket_chat_id = chat.chats.filter(c => c.available);
    }
    socket_chat_id = socket_chat_id.map(c => c.id);
    unsubSocket(socket_chat_id);
  };

  loadChat = async (init, type) => {
    const {
      group,
      auth,
      getChat,
      navigation,
      userLogout,
      chat,
      getAllChatId,
      updateChatInfo,
    } = this.props;
    const request = {
      groupId: group.group.id,
      count: init ? 0 : chat.count,
      token: auth.token,
      getChat: getChat,
      navigation: navigation,
      userLogout: userLogout,
    };

    this.setState({loading: true});
    const req = await getChatFunc(request);

    // if not in group all chats in chat.chats
    let socket_chat_id = req.chat;

    // if in group only the one with proper rank or people who are added
    if (group.group.auth) {
      socket_chat_id = req.chat.filter(c => c.available == true);
    }
    socket_chat_id = socket_chat_id.map(c => c.id);
    subSocket(socket_chat_id, updateChatInfo);

    this.setState({loading: false});
  };

  onEndReached = () => {
    this.loadChat(false);
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.unsubSocket();
    this.loadChat(true);
    this.setState({refreshing: false});
  };

  getSingleChat = async ({chatId, is_dm}) => {
    const {getSingleChat, auth} = this.props;

    const request = {
      token: auth.token,
      chatId,
      is_dm,
    };

    const req = await getSingleChat(request);

    if (req.errors) {
      console.log(req.errors[0]);
      alert('load chat failed at this time, please try again later');
      return false;
    }
    return req;
  };

  onChatPress = async chat => {
    const {navigation, group} = this.props;
    const {id, is_dm} = chat;
    const req = await this.getSingleChat({chatId: id, is_dm});

    if (req) {
      const {rank_req, available} = req;
      if (group.group.auth) {
        if (!available) {
          alert(
            `You can only enter this chat if you are rank ${rank_req} or above.`,
          );
          return;
        }
      }

      this.onBackdropPress();
      this.unsubSocket();
      // remove listeners to all chatrooms here
      const {is_dm} = req;
      if (is_dm) {
        navigation.navigate('Chat');
      } else {
        navigation.navigate('ChatDrawerNavigator');
      }
    }
  };

  changeUserChatNotification = async chatId => {
    const {changeUserChatNotification, auth} = this.props;
    const request = {
      token: auth.token,
      chatId,
    };
    const req = await changeUserChatNotification(request);
    if (req.errors) {
      console.log(req.errors);
      alert(
        'Cannot change notification setting right now, please try again later.',
      );
      return;
    }
  };

  updatePinChat = async chatId => {
    const {updatePinChat, auth} = this.props;
    const request = {
      token: auth.token,
      chatId,
    };

    const req = await updatePinChat(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot pin/unpin chat right now, please try again later.');
      return;
    }
  };

  render() {
    const {chat, group, route} = this.props;
    const {refreshing} = this.state;
    const modalVisible = route.params ? route.params.modalVisible : false;

    return (
      <View>
        <StatusBar barStyle={'dark-content'} />
        <TouchableWithoutFeedback onPress={this.onBackdropPress}>
          <List
            chat={chat.chats}
            onRefresh={this.onRefresh}
            refreshing={refreshing}
            onEndReached={this.onEndReached}
            onChatPress={this.onChatPress}
            userGroupAuthRank={group.group.auth ? group.group.auth.rank : null}
            changeUserChatNotification={this.changeUserChatNotification}
            updatePinChat={this.updatePinChat}
          />
        </TouchableWithoutFeedback>
        <NewChatModal
          onBackdropPress={this.onBackdropPress}
          modalVisible={modalVisible}
          navigateToOptions={this.navigateToOptions}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {auth, group, chat, currentScreen} = state;
  return {auth, group, chat, currentScreen};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getChat: data => dispatch(getChat(data)),
    getAllChatId: data => dispatch(getAllChatId(data)),
    updateChatInfo: data => dispatch(updateChatInfo(data)),
    getSingleChat: data => dispatch(getSingleChat(data)),
    resetChatReducer: () => dispatch(resetChatReducer()),
    changeUserChatNotification: data =>
      dispatch(changeUserChatNotification(data)),
    updatePinChat: data => dispatch(updatePinChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chats);
