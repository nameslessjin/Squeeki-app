import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/chat/headerRightButton';
import {userLogout} from '../actions/auth';
import {getChat, createChat, updateChat} from '../actions/chat';
import {createUpdateChatFunc, getChatFunc} from '../functions/chat';
import Input from '../components/chat/settingInput';
import ChatIconModal from '../components/chat/chatIconModal';

class ChatSetting extends React.Component {
  state = {
    name: '',
    type: 'group',
    rank_req: 7,
    icon: null,
    chatId: null,
    loading: false,
    origin: null,
    modalVisible: false,
  };

  componentDidMount() {
    const {navigation, route} = this.props;

    if (route.params) {
      const {name, rank_req, icon, chatId} = route.params;
      this.setState({
        origin: route.params,
        name,
        rank_req,
        icon,
        chatId,
      });
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderRightButton
          type={'done'}
          disabled={true}
          onPress={this.onCreateUpdateChat}
        />
      ),
      headerBackTitleVisible: false,
      headerTitle: 'Settings',
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      const {navigation} = this.props;
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            type={'done'}
            disabled={!this.validation()}
            onPress={this.onCreateUpdateChat}
          />
        ),
      });
    }
  }

  componentWillUnmount() {
    const {chatId, name, rank_req, icon} = this.state;
    const {navigation} = this.props;
    if (chatId) {
      navigation.navigate('Chat', {
        name,
        rank_req,
        icon,
      });
    }
  }

  validation = () => {
    let {name, type, rank_req, icon, origin} = this.state;
    if (name.length < 3) {
      return false;
    }

    if (rank_req > 7 || rank_req < 0) {
      return false;
    }

    if (rank_req.length == 0) {
      return false;
    }

    if (origin) {

      // check icon first
      if (icon && origin.icon) {

        if (icon.uri != origin.icon.uri) {
          return true;
        } else {
          // check other conditions later
          if (name != origin.name || rank_req != origin.rank_req) {
            return true;
          } else {
            return false;
          }
        }
      }
    }

    return true;
  };

  onCreateUpdateChat = async () => {
    const {
      userLogout,
      navigation,
      auth,
      group,
      createChat,
      updateChat,
    } = this.props;
    const {name, type, rank_req, icon, chatId, origin} = this.state;

    if (origin){

    }

    const request = {
      groupId: group.group.id,
      type,
      name: name.trim(),
      rank_req,
      icon: origin ? ( origin.icon ? (origin.icon.uri == icon.uri ? null : icon ) : icon )  : icon,
      token: auth.token,
      navigation,
      userLogout,
      createChat,
      updateChat,
      chatId,
    };

    this.setState({loading: true});
    const req = await createUpdateChatFunc(request);
    this.setState({loading: false});

    if (!chatId) {
      navigation.navigate('Chats');
    } else {
      this.setState({
        origin: {
          name: req.name,
          rank_req: req.rank_req,
          icon: req.icon,
        },
        icon: req.icon
      });
    }
  };

  onInputChange = (type, value) => {
    if (type == 'name') {
      this.setState({name: value});
    } else if (type == 'type') {
      this.setState(prevState => {
        return {
          ...prevState,
          type: prevState.type == 'group' ? 'personal' : 'group',
        };
      });
    } else if (type == 'rank') {
      this.setState({rank_req: value ? parseInt(value) : ''});
    } else if (type == 'icon') {
      this.setState({modalVisible: true});
    }
  };

  setIcon = (data, type) => {
    this.setState({icon: data, modalVisible: false});
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  render() {
    const {name, type, rank_req, icon, modalVisible, loading} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <Input
            type={'icon'}
            value={icon}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'rank'}
            value={rank_req.toString()}
            onInputChange={this.onInputChange}
          />
          {/* <Input type={'type'} value={type} onInputChange={this.onInputChange} /> */}
          {loading ? (
            <ActivityIndicator animating={loading} style={{marginTop: 20}} />
          ) : null}
          <ChatIconModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onChangeMedia={this.setIcon}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    createChat: data => dispatch(createChat(data)),
    userLogout: () => dispatch(userLogout()),
    updateChat: data => dispatch(updateChat(data)),
    getChat: data => dispatch(getChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatSetting);
