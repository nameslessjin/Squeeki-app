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
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getChat} from '../actions/chat';
import HeaderRightButton from '../components/chat/headerRightButton';
import {getChatFunc} from '../functions/chat';
import {GiftedChat, InputToolbar, SendProps} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {sendMessage, getChatMessage, chatMessageSub} from '../actions/message';
import {sendMessageFunc, getChatMessageFunc} from '../functions/message';
import {useSubscription} from '@apollo/client';
import {chatMessageSubscription} from '../actions/query/messageQuery';
import AsyncStorage from '@react-native-community/async-storage';
import Chats from './functions/message';

class Chat extends React.Component {
  state = {
    name: '',
    rank_req: 7,
    icon: null,
    chatId: null,
    ...this.props.route.params,
    messages: [
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ],
  };

  componentDidMount() {
    const {navigation, route, group} = this.props;

    navigation.setOptions({
      headerRight: () =>
        group.group.auth.rank > 2 ? null : (
          <HeaderRightButton
            type={'setting'}
            disabled={false}
            onPress={this.onSettingPress}
          />
        ),
      headerBackTitleVisible: false,
      headerTitle: route.params.name,
    });

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps != this.props) {
      const {navigation, route} = this.props;
      const {params} = route;
      if (params) {
        const {name, rank_req, icon} = params;
        this.setState({
          name,
          rank_req,
          icon,
        });
        navigation.setOptions({
          headerTitle: name,
        });
      }
    }
  }

  componentWillUnmount() {
    this.loadChat(true);
  }

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
  };

  onSettingPress = () => {
    const {name, rank_req, icon, chatId} = this.state;
    const {navigation} = this.props;
    navigation.navigate('ChatSetting', {
      name,
      rank_req,
      icon,
      chatId,
    });
  };



  render() {
    const {auth} = this.props;
    const {chatId} = this.state;

    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <Chats
            chatId={chatId}
            auth={auth}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getChat: data => dispatch(getChat(data)),
    sendMessage: data => dispatch(sendMessage(data)),
    getChatMessage: data => dispatch(getChatMessage(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
