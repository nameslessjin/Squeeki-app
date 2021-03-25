import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import {getAllUserChat} from '../actions/chat';
import {connect} from 'react-redux';
import UserChatList from '../components/userChat/userChatList';
import HeaderRight from '../components/chat/headerRightButton';

class ChatMembers extends React.Component {
  state = {
    users: [],
    count: 0,
    ...this.props.route.params,
    refreshing: false,
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    const {status, allow_invite, allow_modify} = this.props.route.params;
    
    let disabled = status.is_owner ? false : !allow_invite;

    if (group.group.auth){
      const {auth, rank_setting} = group.group
      disabled = auth.rank > rank_setting
    }

    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Members',
      headerRight: () =>
        disabled ? null : (
          <HeaderRight
            type={'create'}
            disabled={disabled}
            onPress={this.onAddHeaderPress}
          />
        ),
    });
    this.loadUserChat(true);
  }

  onAddHeaderPress = () => {
    const {navigation, group} = this.props;
    const {chatId} = this.state;
    
    navigation.navigate('SearchUser', {
      prev_route: 'chatMembers',
      chatId,
      group: group.group.id ? group.group : null
    });
  };

  loadUserChat = async init => {
    const {auth, getAllUserChat} = this.props;
    const {chatId, count} = this.state;
    const request = {
      token: auth.token,
      chatId,
      count: init ? 0 : count,
    };

    const req = await getAllUserChat(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get chat members right now, please try again later');
      return;
    }

    this.setState(prevState => {
      return {
        users: init ? req.users : prevState.users.concat(req.users),
        count: req.count,
      };
    });
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadUserChat(true);
    this.setState({refreshing: false});
  };

  onEndReached = () => {
    this.loadUserChat(false);
  };

  render() {
    const {users, refreshing} = this.state;

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <View style={{padding: 7, alignItems: 'center'}}>
            <UserChatList
              users={users}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              onEndReached={this.onEndReached}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapStateToDispatch = dispatch => {
  return {
    getAllUserChat: data => dispatch(getAllUserChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch,
)(ChatMembers);
