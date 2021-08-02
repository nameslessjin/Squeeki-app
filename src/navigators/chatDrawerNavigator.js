import React from 'react';
import Chat from '../screens/chat';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {StyleSheet, Text, View} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderRightButton from '../components/group/headerRight';
import {connect} from 'react-redux';
import {getUserRelation} from '../actions/user';
import {getUserChat, changeUserChatNotification} from '../actions/chat';

const Drawer = createDrawerNavigator();

class ChatDrawerkNavigator extends React.Component {
  state = {
    status: {},
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {chat} = this.props.chat;
    let name = 'Chat';
    let headerTitleSize = 18;
    if (chat) {
      name = chat.name.trim();
      this.getUserChat(chat.id);

      if (name.length >= 15) {
        headerTitleSize = 16;
      }

      if (name.length >= 20) {
        headerTitleSize = 15;
      }

      if (name.length >= 30) {
        headerTitleSize = 13;
      }

      if (name.length >= 35) {
        headerTitleSize = 11;
      }

      if (name.length >= 40) {
        headerTitleSize = 10;
      }

      if (name.length >= 45) {
        headerTitleSize = 8;
      }
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderRightButton onPress={this.onToggleHeaderRightButton} />
      ),
      headerBackTitleVisible: false,
      headerTitle: name,
      headerTitleStyle: {
        fontSize: headerTitleSize,
      },
    });
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

  componentDidUpdate(prevProps) {
    const {navigation} = this.props;
    if (prevProps.chat.chat != this.props.chat.chat) {
      const {chat} = this.props.chat;
      let name = 'Chat';
      if (chat) {
        name = chat.name;
      }
      navigation.setOptions({
        headerTitle: name,
      });
    }
  }

  onToggleHeaderRightButton = () => {
    const {navigation} = this.props;
    navigation.dispatch(DrawerActions.openDrawer());
  };

  onSettingPress = () => {
    const {
      name,
      rank_req,
      icon,
      id,
      allow_invite,
      allow_modify,
    } = this.props.chat.chat;
    const {navigation} = this.props;
    navigation.navigate('ChatSetting', {
      name,
      rank_req,
      icon,
      chatId: id,
      allow_invite,
      allow_modify,
    });
  };

  onMemberPress = () => {
    const {id, allow_invite, allow_modify, rank_req} = this.props.chat.chat;
    const {navigation} = this.props;
    navigation.navigate('ChatMembers', {
      chatId: id,
      allow_invite,
      allow_modify,
      rank_req,
    });
  };

  changeUserChatNotification = async () => {
    const {changeUserChatNotification, auth, chat} = this.props;
    const {id} = chat.chat;
    const request = {
      token: auth.token,
      chatId: id,
    };
    const req = await changeUserChatNotification(request);
    if (req.errors) {
      console.log(req.errors);
      alert(
        'Cannot change notification setting right now, please try again later.',
      );
      return;
    }
    if (req == 0) {
      this.setState(prevState => ({
        status: {
          ...prevState.status,
          notification: !prevState.status.notification,
        },
      }));
    }
  };

  CustomDrawerContent = props => {
    const {notification} = this.state.status;
    const {group} = this.props.group;
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        <DrawerItem
          label="Mute"
          icon={() => (
            <MaterialIcons
              name={'bell-off'}
              color={notification ? 'grey' : 'red'}
              size={25}
            />
          )}
          labelStyle={[
            styles.labelStyle,
            {color: notification ? 'grey' : 'red'},
          ]}
          onPress={this.changeUserChatNotification}
        />

        <DrawerItem
          label="Members"
          icon={() => (
            <MaterialIcons name="account-group" color={'grey'} size={25} />
          )}
          labelStyle={styles.labelStyle}
          onPress={this.onMemberPress}
        />
        <DrawerItem
          label="Settings"
          icon={() => <MaterialIcons name="cog" color={'grey'} size={25} />}
          labelStyle={styles.labelStyle}
          onPress={this.onSettingPress}
        />
      </DrawerContentScrollView>
    );
  };

  render() {
    const {chat} = this.props.chat;
    let name = 'Chat';
    if (chat) {
      name = chat.name;
    }
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerPosition: 'right',
          drawerStyle: styles.drawerStyle,
        }}
        initialRouteName={'Chat'}
        drawerContent={props => this.CustomDrawerContent(props)}>
        <Drawer.Screen name={name || 'Chat'} component={Chat} />
      </Drawer.Navigator>
    );
  }
}

const mapStateToProps = state => {
  const {chat, auth, group} = state;
  return {auth, chat, group};
};
const mapDispatchToProps = dispatch => {
  return {
    getUserChat: data => dispatch(getUserChat(data)),
    getUserRelation: data => dispatch(getUserRelation(data)),
    changeUserChatNotification: data =>
      dispatch(changeUserChatNotification(data)),
  };
};

const styles = StyleSheet.create({
  drawerStyle: {
    width: '50%',
  },
  labelStyle: {
    marginLeft: -25,
    color: 'grey',
    fontWeight: '600',
  },
  notification: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 3,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA2027',
  },
  notificationText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatDrawerkNavigator);
