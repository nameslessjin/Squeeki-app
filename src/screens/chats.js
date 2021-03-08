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
import {getChat} from '../actions/chat';
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
      headerRight: () =>
        group.group.auth.rank > 2 ? null : (
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

    this.setState({loading: true});
    const req = await getChatFunc(request);
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
    const {chat} = this.props;
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chats);
