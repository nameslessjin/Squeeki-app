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

const Drawer = createDrawerNavigator();

class ChatDrawerkNavigator extends React.Component {
  state = {
    status: {},
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {chat} = this.props.chat;
    let name = 'Chat';
    if (chat) {
      name = chat.name;
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderRightButton onPress={this.onToggleHeaderRightButton} />
      ),
      headerBackTitleVisible: false,
      headerTitle: name,
    });

  }
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
      rank_req
    });
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
    const {chat} = this.props.chat;
    let name = 'Chat';
    if (chat) {
      name = chat.name;
    }
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
