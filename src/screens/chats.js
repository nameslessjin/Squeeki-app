import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {getChat} from '../actions/chat';
import {userLogout} from '../actions/auth';
import HeaderRightButton from '../components/chat/headerRightButton';
import { getChatFunc } from '../functions/chat'

class Chats extends React.Component {
  state = {
    chat: [],
    count: 0,
    loading: false,
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    navigation.setOptions({
      headerRight: () => (
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
    const {group, auth, getChat, navigation, userLogout} = this.props;
    const {count} = this.state;

    const request = {
      groupId: group.group.id,
      count: init ? 0 : count,
      token: auth.token,
      getChat: getChat,
      navigation: navigation,
      userLogout: userLogout
    };
    console.log(request)
    this.setState({loading: true});
    const req = await getChatFunc(request);

    this.setState(prevState => {
      return {
        ...prevState,
        loading: false,
        count: req.count,
        chat: init ? req.chat : prevState.chat.concat(req.chat),
      };
    });
  };

  onEndReached = () => {
    this.loadChat(false);
  };

  onRefresh = () => {
    this.loadChat(true);
  };

  render() {
    return (
      <TouchableWithoutFeedback>
        <View>
          <StatusBar barStyle={'dark-content'} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

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
)(Chats);
