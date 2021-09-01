import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/chat/headerRightButton';
import {userLogout} from '../actions/auth';
import {
  getChat,
  createChat,
  updateChat,
  deleteLeaveChat,
  updateChatInfo,
  getUserChat,
} from '../actions/chat';
import {
  createUpdateChatFunc,
  getChatFunc,
  deleteLeaveChatFunc,
  subSocket,
} from '../functions/chat';
import Input from '../components/chat/settingInput';
import ChatIconModal from '../components/chat/chatIconModal';
import ToggleSetting from '../components/chat/toggleSetting';
import {StackActions} from '@react-navigation/native';
import {getGroupRankName} from '../actions/group';
import RankSettingModal from '../components/rankSetting/rankSettingModal';
import {getTheme} from '../utils/theme';

class ChatSetting extends React.Component {
  state = {
    name: '',
    rank_req: 7,
    icon: null,
    chatId: null,
    loading: false,
    origin: null,
    modalVisible: false,
    deleted: false,
    allow_invite: false,
    allow_modify: false,
    modalType: 'icon',
    status: {},
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation, route, group} = this.props;
    const {theme} = this.state;
    if (route.params) {
      const {
        name,
        rank_req,
        icon,
        chatId,
        allow_invite,
        allow_modify,
      } = route.params;
      this.setState({
        origin: route.params,
        name,
        rank_req,
        icon,
        chatId,
        allow_invite,
        allow_modify,
      });
      this.getUserChat(chatId);
    } else {
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            type={'done'}
            disabled={true}
            onPress={this.onCreateUpdateChat}
            theme={theme}
          />
        ),
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
        headerTintColor: theme.textColor.color,
      });
    }

    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Settings',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      const {navigation} = this.props;
      const {chatId, theme} = this.state;
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            type={'done'}
            disabled={!this.validation()}
            onPress={this.onCreateUpdateChat}
            theme={theme}
          />
        ),
      });
    }
  }

  componentWillUnmount() {
    const {
      chatId,
      name,
      rank_req,
      icon,
      deleted,
      status,
      allow_modify,
    } = this.state;
    const {navigation} = this.props;

    // if it is to update chat setting
    if (chatId) {
      if (!deleted) {
        // update chat setting if condition met
        // const {group}
        const {group} = this.props.group;
        let update = true;

        if (group.id) {
          if (group.auth.rank > group.rank_setting.manage_chat_rank_required) {
            update = false;
          }
        } else {
          // check if it is group owner.  if not then null
          if (!status.is_owner && !allow_modify) {
            update = false;
          }
        }
      } else {
        // if delete or leave current chat then reload chats
        this.loadChat(true);
      }
    }
  }

  getUserChat = async chatId => {
    const {auth, getUserChat} = this.props;

    const request = {
      token: auth.token,
      chatId,
    };

    const req = await getUserChat(request);
    if (req.errors) {
      console.log(req.errors[0]);
      alert('Get User Status Error');
      return;
    }

    this.setState({status: req});
  };

  validation = () => {
    let {
      name,
      type,
      rank_req,
      icon,
      origin,
      allow_invite,
      allow_modify,
    } = this.state;
    if (name.length < 3) {
      return false;
    }

    if (rank_req) {
      if (rank_req > 7 || rank_req < 0) {
        return false;
      }

      if (rank_req.length == 0) {
        return false;
      }
    }

    if (origin) {
      // if both icon and original icon exist
      if (icon && origin.icon) {
        if (icon.uri != origin.icon.uri) {
          return true;
        }
      }

      // if icon exist and original icon is  null
      if (icon && origin.icon == null) {
        return true;
      }

      // check changes in other conditions
      if (
        name != origin.name ||
        rank_req != origin.rank_req ||
        allow_invite != origin.allow_invite ||
        allow_modify != origin.allow_modify
      ) {
        return true;
      } else {
        return false;
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
    const {
      name,
      rank_req,
      icon,
      chatId,
      origin,
      allow_modify,
      allow_invite,
    } = this.state;

    const request = {
      groupId: group.group.id,
      name: name.trim(),
      rank_req: group.group.id ? rank_req : null,
      allow_modify,
      allow_invite,
      icon: origin
        ? origin.icon
          ? origin.icon.uri == icon.uri
            ? null
            : icon
          : icon
        : icon,
      token: auth.token,
      navigation,
      userLogout,
      createChat,
      updateChat,
      chatId,
    };

    this.setState({loading: true});
    const req = await createUpdateChatFunc(request);
    if (!chatId) {
      this.setState({loading: false});
    }

    if (chatId) {
      navigation.goBack();
    } else {
      this.loadChat(true);
      navigation.dispatch(StackActions.pop(1));
    }
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

    const req = await getChatFunc(request);

    this.subSocket(req);
  };

  subSocket = req => {
    const {group, updateChatInfo} = this.props;

    // if not in group all chats in chat.chats
    let socket_chat_id = req.chat;

    // if in group only the one with proper rank
    if (group.group.id) {
      socket_chat_id = req.chat.filter(
        c => c.rank_req >= group.group.auth.rank,
      );
    }
    socket_chat_id = socket_chat_id.map(c => c.id);

    subSocket(socket_chat_id, updateChatInfo);
  };

  onInputChange = (type, value) => {
    if (type == 'name') {
      this.setState({name: value});
    } else if (type == 'rankPress') {
      this.setState({modalVisible: true, modalType: 'rank'});
    } else if (type == 'rank') {
      if (!this.state.modalVisible || this.state.modalType != 'rank') {
        this.setState({modalVisible: true, modalType: 'rank'});
      } else {
        this.setState({rank_req: value, modalVisible: false});
      }
    } else if (type == 'icon') {
      this.setState({modalVisible: true, modalType: 'icon'});
    } else if (type == 'delete' || type == 'leave') {
      Alert.alert(
        type == 'delete' ? 'Delete the chat' : 'Leave the chat',
        null,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: this.deleteLeaveChat,
            style: 'destructive',
          },
        ],
      );
    }
  };

  deleteLeaveChat = async () => {
    const {chatId} = this.state;
    const {navigation} = this.props;
    this.setState({loading: true, deleted: true});
    const request = await deleteLeaveChatFunc({...this.props, chatId});
    this.setState({loading: false});
    navigation.dispatch(StackActions.pop(2));
  };

  setIcon = (data, type) => {
    this.setState({icon: data, modalVisible: false});
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onToggle = type => {
    this.setState(prevState => {
      return {
        allow_invite:
          type == 'invite' ? !prevState.allow_invite : prevState.allow_invite,
        allow_modify:
          type == 'modify' ? !prevState.allow_modify : prevState.allow_modify,
      };
    });
  };

  render() {
    const {
      name,
      type,
      rank_req,
      icon,
      modalVisible,
      loading,
      chatId,
      allow_invite,
      allow_modify,
      status,
      modalType,
      theme,
    } = this.state;

    // if in group
    const {group, rankName} = this.props.group;

    let deleteButton = (
      <Input type={'delete'} onInputChange={this.onInputChange} theme={theme} />
    );

    let disabled = false;

    if (!chatId) {
      deleteButton = null;
    } else {
      if (group.id) {
        if (group.auth.rank > group.rank_setting.manage_chat_rank_required) {
          deleteButton = null;
          disabled = true;
        }
      } else {
        if (!status.is_owner) {
          deleteButton = (
            <Input type={'leave'} onInputChange={this.onInputChange} theme={theme} />
          );
        }
        if (!status.is_owner && !allow_modify) {
          disabled = true;
        }
      }
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.greyArea]}>

          <Input
            type={'icon'}
            value={icon}
            onInputChange={this.onInputChange}
            disabled={disabled}
            theme={theme}
          />
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
            disabled={disabled}
            theme={theme}
          />

          {group.id ? (
            <Input
              type={'rank'}
              value={rank_req}
              onInputChange={this.onInputChange}
              disabled={disabled}
              rankName={rankName}
              theme={theme}
            />
          ) : null}

          {group.id ? null : (
            <ToggleSetting
              type={'invite'}
              on={allow_invite}
              onToggle={this.onToggle}
              disabled={disabled}
              theme={theme}
            />
          )}
          {group.id ? null : (
            <ToggleSetting
              type={'modify'}
              on={allow_modify}
              onToggle={this.onToggle}
              disabled={disabled}
              theme={theme}
            />
          )}

          {deleteButton}

          {loading ? (
            <ActivityIndicator
              animating={loading}
              style={{marginTop: 20}}
              color={'grey'}
            />
          ) : null}
          {modalVisible && modalType == 'icon' ? (
            <ChatIconModal
              modalVisible={modalVisible}
              onBackdropPress={this.onBackdropPress}
              onChangeMedia={this.setIcon}
              theme={theme}
            />
          ) : null}
          {modalVisible && modalType == 'rank' ? (
            <RankSettingModal
              type={'rank'}
              prevRoute={'chatSetting'}
              modalVisible={modalVisible}
              userRank={group.auth.rank}
              rankName={rankName}
              onBackdropPress={this.onBackdropPress}
              onRankChange={this.onInputChange}
              theme={theme}
            />
          ) : null}
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
    deleteLeaveChat: data => dispatch(deleteLeaveChat(data)),
    updateChatInfo: data => dispatch(updateChatInfo(data)),
    getUserChat: data => dispatch(getUserChat(data)),
    getGroupRankName: data => dispatch(getGroupRankName(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatSetting);
