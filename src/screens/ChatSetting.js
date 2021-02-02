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
import Input from '../components/chat/settingInput'

class ChatSetting extends React.Component {
  state = {
    name: '',
    type: 'group',
    rank_req: 7,
    icon: null,
    chatId: null,
    loading: false,
    origin: null,
  };

  componentDidMount() {
    const {navigation, route} = this.props;

    if (route.params) {
      const {name, type, rank_req, icon, chatId} = route.params;
      this.setState({
        origin: route.params.chat,
        name,
        type,
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
            disabled={this.validation}
            onPress={this.onCreateUpdateChat}
          />
        ),
      });
    }
  }

  validation = () => {
    let {name, type, rank_req, icon, origin} = this.state;
    if (name.length == 0) {
      return false;
    }

    if (rank_req > 7 || rank_req < 0) {
      return false;
    }

    if (origin) {
      if (
        name != origin.name ||
        type != origin.type ||
        rank_req != origin.rank_req ||
        icon != origin.icon
      ) {
        return true;
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
    const {name, type, rank_req, icon, chatId} = this.state;
    const request = {
      groupId: group.group.id,
      type,
      name: name.trim(),
      rank_req,
      icon,
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
  };

  onInputChange = (type, value) => {
    if (type == 'name'){
      this.setState({name: value})
    } else if (type == 'type'){
      this.setState(prevState => {
        return {
          ...prevState,
          type: prevState.type == 'group' ? 'personal' : 'group'
        }
      })
    } else if (type == 'rank'){
      this.setState({rank_req: value ? parseInt(value) : ''})
    } 
  }

  render() {
    const {name, type, rank_req, icon} = this.state
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <Input type={'icon'} value={icon} />
          <Input type={'name'} value={name} onInputChange={this.onInputChange} />
          <Input type={'rank'} value={rank_req.toString()} onInputChange={this.onInputChange} />
          {/* <Input type={'type'} value={type} onInputChange={this.onInputChange} /> */}
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
