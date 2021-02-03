import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StatusBar,
  Text
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getChat} from '../actions/chat';
import HeaderRightButton from '../components/chat/headerRightButton';
import {getChatFunc} from '../functions/chat';
import {GiftedChat} from 'react-native-gifted-chat';

class Chat extends React.Component {
  state = {
    name: '',
    type: 'group',
    rank_req: 7,
    icon: null,
    chatId: null,
    messages: [
      {
        _id: 1,
        text: 'My message',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
        image: 'https://facebook.github.io/react/img/logo_og.png',
      },
    ],
  };

  componentDidMount() {
    const {navigation, route, group} = this.props;
    const {name, type, rank_req, icon, chatId} = route.params;
    this.setState({
      name,
      type,
      rank_req,
      icon,
      chatId,
    });

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
      headerTitle: name,
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
    const {auth, messages} = this.props;
    const user = {
      _id: auth.user.id,
    };
    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <GiftedChat user={user} messages={messages} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
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
    userLogout: () => dispatch(userLogout()),
    getChat: data => dispatch(getChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
