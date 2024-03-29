import React from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {
  getGroupJoinRequest,
  onRespondJoinRequest,
  getGroupJoinRequestCount,
} from '../actions/group';
import {getGroupJoinRequestCountFunc} from '../functions/group';
import {getGroupMembers} from '../actions/user';
import {getGroupMembersFunc} from '../functions/user';
import List from '../components/groupJoinRequest/requestList';
import {getTheme} from '../utils/theme';

class UserGroupJoinRequest extends React.Component {
  state = {
    count: 0,
    users: [],
    refreshing: false,
    loading: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    // get request
    this.loadJoinRequest(true);
    const {navigation} = this.props;
    const {theme} = this.state
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Join Requests',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentWillUnmount() {
    // reload members
    this.loadGroupMembers();
    this.getGroupJoinRequestCount();
  }

  getGroupJoinRequestCount = () => {
    const {
      getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    } = this.props;
    const data = {
      func: getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    };
    getGroupJoinRequestCountFunc(data);
  };

  loadJoinRequest = async init => {
    const {
      navigation,
      group,
      auth,
      userLogout,
      getGroupJoinRequest,
    } = this.props;
    const {count} = this.state;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      count: init ? 0 : count,
    };

    const req = await getGroupJoinRequest(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load quests at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    const users = req.users.map(u => {
      return {
        ...u,
        loading: null,
      };
    });

    this.setState(prevState => {
      return {
        ...prevState,
        count: req.count,
        users: req.count == 10 ? users : prevState.users.concat(users),
      };
    });
  };

  onRespond = async (id, type) => {
    const {
      group,
      auth,
      userLogout,
      navigation,
      onRespondJoinRequest,
    } = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      requesterId: id,
      type: type,
    };
    this.setState(prevState => {
      return {
        ...prevState,
        users: prevState.users.map(u =>
          u.id == id ? {...u, loading: type} : u,
        ),
      };
    });
    const req = await onRespondJoinRequest(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot response request at this time, please try again later');
      this.setState(prevState => {
        return {
          ...prevState,
          users: prevState.users.map(u =>
            u.id == id ? {...u, loading: null} : u,
          ),
        };
      });
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState(prevState => {
      return {
        ...prevState,
        users: prevState.users.filter(u => u.id != id),
      };
    });
  };

  loadGroupMembers = () => {
    const {navigation, auth, userLogout, getGroupMembers, group} = this.props;

    const data = {
      token: auth.token,
      groupId: group.group.id,
      navigation: navigation,
      userLogout: userLogout,
      count: 0,
      getGroupMembers: getGroupMembers,
    };
    getGroupMembersFunc(data);
  };

  onEndReached = () => {
    this.loadJoinRequest(false);
  };

  onRefresh = () => {
    this.loadJoinRequest(true);
  };

  render() {
    const {users, refreshing, loading, theme} = this.state;
    return (
      <TouchableWithoutFeedback>
        <View style={[styles.container, theme.backgroundColor]}>
          {users.length > 0 ? (
            <List
              users={users}
              onEndReached={this.onEndReached}
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              onRespond={this.onRespond}
              theme={theme}
            />
          ) : (
            <View style={{marginTop: 300}}>
              <Text style={styles.text}>
                There is no join request at this time
              </Text>
            </View>
          )}
        </View>
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
    backgroundColor: 'white',
  },
  text: {
    marginBottom: 300,
    color: 'grey',
    fontStyle: 'italic',
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getGroupJoinRequest: data => dispatch(getGroupJoinRequest(data)),
    getGroupMembers: data => dispatch(getGroupMembers(data)),
    onRespondJoinRequest: data => dispatch(onRespondJoinRequest(data)),
    getGroupJoinRequestCount: data => dispatch(getGroupJoinRequestCount(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserGroupJoinRequest);
