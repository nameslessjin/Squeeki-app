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
import {getChat, getAllChatId, updateChatInfo} from '../actions/chat';
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
    const {auth, rank_setting} = group.group
    navigation.setOptions({
      headerRight: () =>
        auth.rank > rank_setting.manage_chat_rank_required ? null : (
          <HeaderRightButton
            onPress={this.onHeaderRightButtonPress}
            type={'create'}
            disabled={false}
          />
        ),
      headerBackTitleVisible: false,
      headerTitle: 'Chats',
    });

    this.loadChat(true);
  }


  onHeaderRightButtonPress = () => {
    const {navigation} = this.props;
    navigation.navigate('ChatSetting');
  };

  componentWillUnmount(){
    this.unsubSocket()
  }

  unsubSocket = () => {
    const {chat, group} = this.props
    let socket_chat_id = chat.chats.filter(c => c.rank_req >= group.group.auth.rank )
    socket_chat_id = socket_chat_id.map(c => c.id)
    const io = socket.getIO()
    socket_chat_id.forEach(id => {
      const channel = `chats${id}` 
      io.off(channel)
    })
  }

  loadChat = async init => {
    const {group, auth, getChat, navigation, userLogout, chat, getAllChatId, updateChatInfo} = this.props;
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
    let socket_chat_id = req.chat.filter(c => c.rank_req >= group.group.auth.rank )
    socket_chat_id = socket_chat_id.map(c => c.id)
    const io = socket.getIO()

    socket_chat_id.forEach(id => {
      const channel = `chats${id}` 
      io.on(channel, data => {
        if (data.action == 'add'){
          //this.update chat
          updateChatInfo(data.result)
        }
      })
    })
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

  onChatPress = chat => {
    const {navigation, group} = this.props;
    const {name, id, rank_req, icon} = chat;

    const rank = group.group.auth.rank;

    if (rank <= rank_req) {
      this.unsubSocket()
      // remove listeners to all chatrooms here
      navigation.navigate('Chat', {
        name,
        chatId: id,
        rank_req,
        icon,
      });
    } else {
      alert(`You can only enter this chat if you are rank ${rank_req} or above.`)
    }
  };

  render() {
    const {chat, group} = this.props;
    const {refreshing} = this.state;
    const rank = group.group.auth.rank;
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
            userGroupAuthRank={rank}
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
    getAllChatId: data=> dispatch(getAllChatId(data)),
    updateChatInfo: data => dispatch(updateChatInfo(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chats);
