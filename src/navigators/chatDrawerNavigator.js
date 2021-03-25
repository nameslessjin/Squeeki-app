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
import {getUserChat} from '../actions/chat';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderRightButton from '../components/group/headerRight';
import {connect} from 'react-redux';

const Drawer = createDrawerNavigator();

class ChatDrawerkNavigator extends React.Component {
  state = {
    status: {},
  };

  componentDidMount() {
    const {navigation, chat} = this.props;

    navigation.setOptions({
      headerRight: () => (
        <HeaderRightButton onPress={this.onToggleHeaderRightButton} />
      ),
      headerBackTitleVisible: false,
      headerTitle: chat.chat.name,
    });

    // load status in the chat
    this.getUserChat();
  }
  componentDidUpdate(prevProps) {
    const {navigation} = this.props;
    if (prevProps.chat.chat != this.props.chat.chat) {
      navigation.setOptions({
        headerTitle: this.props.chat.chat.name,
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
    const {status} = this.state;
    const {navigation} = this.props;
    navigation.navigate('ChatSetting', {
      name,
      rank_req,
      icon,
      chatId: id,
      status,
      allow_invite,
      allow_modify,
    });
  };

  onMemberPress = () => {
    const {id, allow_invite, allow_modify} = this.props.chat.chat;
    const {status} = this.state;
    const {navigation} = this.props;
    navigation.navigate('ChatMembers', {
      chatId: id,
      allow_invite,
      allow_modify,
      status,
    });
  };

  getUserChat = async () => {
    const {auth, getUserChat, chat} = this.props;
    const {id} = chat.chat;

    const request = {
      token: auth.token,
      chatId: id,
    };

    const req = await getUserChat(request);
    if (req.errors) {
      console.log(req.errors[0]);
      alert('Get User Status Error');
      return;
    }

    this.setState({status: req});
  };

  CustomDrawerContent = props => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
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
    const {name} = this.props.chat.chat;
    return (
      <Drawer.Navigator
        initialRouteName={'Chat'}
        drawerPosition={'right'}
        drawerContent={props => this.CustomDrawerContent(props)}
        drawerStyle={styles.drawerStyle}>
        <Drawer.Screen name={name || 'Chat'} component={Chat} />
      </Drawer.Navigator>
    );
  }
}

const mapStateToProps = state => {
  const {chat, auth} = state;
  return {auth, chat};
};
const mapDispatchToProps = dispatch => {
  return {
    getUserChat: data => dispatch(getUserChat(data)),
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
