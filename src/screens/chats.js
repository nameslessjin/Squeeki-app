import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StatusBar,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {
  getChat,
  getAllChatId,
  updateChatInfo,
  getSingleChat,
} from '../actions/chat';
import {userLogout} from '../actions/auth';
import HeaderRightButton from '../components/chat/headerRightButton';
import {getChatFunc} from '../functions/chat';
import List from '../components/chat/chatList';
import {socket} from '../../server_config';

class Chats extends React.Component {
  state = {
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Chats',
    });

    if (group.group.id) {
      const {auth, rank_setting} = group.group;
      navigation.setOptions({
        headerRight: () =>
          auth.rank > rank_setting.manage_chat_rank_required ? null : (
            <HeaderRightButton
              onPress={this.onHeaderRightButtonPress}
              type={'create'}
              disabled={false}
            />
          ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            onPress={this.onHeaderRightButtonPress}
            type={'create'}
            disabled={false}
          />
        ),
      });
    }

    this.loadChat(true);
  }

  onHeaderRightButtonPress = () => {
    const {navigation} = this.props;
    navigation.navigate('ChatSetting');
  };

  componentWillUnmount() {
    this.unsubSocket();
  }

  unsubSocket = () => {
    const {chat, group} = this.props;

    // if not in group all chats in chat.chats
    let socket_chat_id = chat.chats;

    // if in group only the one with proper rank
    if (group.group.id) {
      socket_chat_id = chat.chats.filter(
        c => c.rank_req >= group.group.auth.rank,
      );
    }
    socket_chat_id = socket_chat_id.map(c => c.id);
    const io = socket.getIO();
    socket_chat_id.forEach(id => {
      const channel = `chats${id}`;
      io.off(channel);
    });
  };

  loadChat = async init => {
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
    this.setState({loading: false});
  };

  onEndReached = () => {
    this.loadChat(false);
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadChat(true);
    this.setState({refreshing: false});
  };

  getSingleChat = async chatId => {
    const {getSingleChat, auth} = this.props;

    const request = {
      token: auth.token,
      chatId,
    };

    const req = await getSingleChat(request);

    if (req.errors) {
      console.log(req.errors[0]);
      alert('load chat failed at this time, please try again later');
      return false;
    }

    return true;
  };

  onChatPress = async chat => {
    const {navigation, group} = this.props;
    const {id} = chat;
    const req = await this.getSingleChat(id);

    if (req) {
      const {rank_req} = req
      if (group.group.id) {
        if (group.group.auth.rank > rank_req) {
          alert(
            `You can only enter this chat if you are rank ${rank_req} or above.`,
          );
          return;
        }
      }
      this.unsubSocket();
      // remove listeners to all chatrooms here
      navigation.navigate('ChatStackNavigator');
    }
  };

  render() {
    const {chat, group} = this.props;
    const {refreshing} = this.state;

    return (
      <TouchableWithoutFeedback>
        <View>
          <StatusBar barStyle={'dark-content'} />
          <List
            chat={chat.chats}
            onRefresh={this.onRefresh}
            refreshing={refreshing}
            onEndReached={this.onEndReached}
            onChatPress={this.onChatPress}
            userGroupAuthRank={group.group.id ? group.group.auth.rank : null}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  const {auth, group, chat} = state;
  return {auth, group, chat};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getChat: data => dispatch(getChat(data)),
    getAllChatId: data => dispatch(getAllChatId(data)),
    updateChatInfo: data => dispatch(updateChatInfo(data)),
    getSingleChat: data => dispatch(getSingleChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chats);
