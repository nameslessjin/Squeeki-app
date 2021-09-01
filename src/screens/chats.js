import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  AppState,
  StatusBar,
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
import {getGroupRankName} from '../actions/group';
import HeaderRightButton from '../components/chat/headerRightButton';
import {getChatFunc, unsubSocket, subSocket} from '../functions/chat';
import List from '../components/chat/chatList';
import NewChatModal from '../components/chat/newChatModal';
import {getTheme} from '../utils/theme';

class Chats extends React.Component {
  state = {
    loading: false,
    refreshing: false,
    modalVisible: false,
    appState: AppState.currentState,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation, group, theme} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: group.group.id
        ? `${group.group.display_name} Chats`
        : 'My Chats',
    });

    if (group.group.auth) {
      this.getGroupRankName();
      const {auth, rank_setting} = group.group;
      const {theme} = this.state;
      navigation.setOptions({
        headerRight: () =>
          auth.rank > rank_setting.manage_chat_rank_required ? null : (
            <HeaderRightButton
              onPress={() => navigation.navigate('ChatSetting')}
              type={'create'}
              disabled={false}
              theme={theme}
            />
          ),
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
        headerTintColor: theme.textColor.color,
      });
    }

    // for chat in a group, load chat
    if (group.group.id) {
      this.loadChat(true);
    }

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps) {
    const {currentScreen, auth, navigation} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'Chats' &&
      prevScreen.currentScreen != 'Chats'
    ) {
      this.loadChat(true);
    }

    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
        headerTintColor: theme.textColor.color,
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
    const {group, navigation, resetChatReducer} = this.props;
    this.unsubSocket();
    AppState.removeEventListener('change', this._handleAppStateChange);
    resetChatReducer();
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'GroupChats',
      });
    }
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
    const {chat, group, route, auth} = this.props;
    const {refreshing, theme} = this.state;
    const modalVisible = route.params ? route.params.modalVisible : false;

    return (
      <View style={theme.greyArea}>
        <StatusBar
          barStyle={
            auth
              ? auth.user.theme == 'darkMode'
                ? 'light-content'
                : 'dark-content'
              : 'dark-content'
          }
        />
        {chat.chats.length == 0 ? (
          <View style={styles.container}>
            <Text style={styles.text}>You are not in any chat yet</Text>
          </View>
        ) : (
          <TouchableWithoutFeedback onPress={this.onBackdropPress}>
            <List
              chat={chat.chats}
              onRefresh={this.onRefresh}
              refreshing={refreshing}
              onEndReached={this.onEndReached}
              onChatPress={this.onChatPress}
              userGroupAuthRank={
                group.group.auth ? group.group.auth.rank : null
              }
              rankName={group.rankName}
              changeUserChatNotification={this.changeUserChatNotification}
              updatePinChat={this.updatePinChat}
              theme={theme}
            />
          </TouchableWithoutFeedback>
        )}
        <NewChatModal
          onBackdropPress={this.onBackdropPress}
          modalVisible={modalVisible}
          navigateToOptions={this.navigateToOptions}
          theme={theme}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  text: {
    fontStyle: 'italic',
    marginTop: 200,
    color: 'grey',
  },
});

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
    getGroupRankName: data => dispatch(getGroupRankName(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chats);
