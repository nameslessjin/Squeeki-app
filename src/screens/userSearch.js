import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import UserSearchBar from '../components/users/userSearch/searchBar';
import DoneButton from '../components/users/userSearch/doneButton';
import {searchUser, addMembers, getGroupMembers} from '../actions/user';
import {searchUserFunc, getGroupMembersFunc} from '../functions/user';
import UserList from '../components/users/userList';
import DisplayNameList from '../components/users/userSearch/displayNameList';

class UserSearch extends React.Component {
  state = {
    searchTerm: '',
    usersData: [],
    count: 0,
    lastIndexId: null,
    chosenUser: [],
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {chosenUser} = this.state;
    const {params} = this.props.route;
    if (params) {
      this.setState({group: params.group, prev_route: params.prev_route});
      if (params.prev_route == 'PostSetting') {
        this.loadGroupMembers(true);
      }
    }
    const button = params.prev_route == 'PostSetting' ? null : (
      <DoneButton
        disabled={chosenUser.length == 0}
        onPress={this.onAddMembers}
      />
    );
    navigation.setOptions({
      headerTitle: params.prev_route == 'PostSetting' ? 'Pick nominee' : 'Search User',
      headerRight: () => button,
    });
  }

  componentDidUpdate() {
    const {navigation} = this.props;
    const {chosenUser, prev_route} = this.state;
    const button = prev_route == 'PostSetting' ? null : (
      <DoneButton
        disabled={chosenUser.length == 0}
        onPress={this.onAddMembers}
      />
    );
    navigation.setOptions({
      headerRight: () => button,
    });
  }

  componentWillUnmount() {
    const {prev_route} = this.state;
    if (prev_route == 'PostSetting') {
    } else if (prev_route == 'members') {
      this.loadGroupMembers(true);
    }
  }

  loadGroupMembers = init => {
    const {navigation, auth, userLogout, getGroupMembers, route, user} = this.props;
    let group = this.state.group;
    if (route.params) {
      if (route.params.prev_route == 'PostSetting') {
        group = route.params.group;
      }
    }

    const data = {
      token: auth.token,
      groupId: group.id,
      navigation: navigation,
      userLogout: userLogout,
      lastIndexId: init ? null : user.members.lastIndexId,
      getGroupMembers: getGroupMembers,
    };
    getGroupMembersFunc(data);
  };

  onAddMembers = async () => {
    const {chosenUser, group} = this.state;
    const chosenUserIds = chosenUser.map(u => u.id);
    const {auth, navigation, userLogout, addMembers} = this.props;

    const data = {
      token: auth.token,
      chosenUserIds: chosenUserIds,
      groupId: group.id,
    };

    const addResult = await addMembers(data);
    if (addResult.errors) {
      alert(addResult.errors[0].message);
      if (addResult.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    navigation.goBack();

    return;
  };

  onSearchChange = async text => {

    const term = text.trim()

    this.setState({searchTerm: text});

    if (term.length < 3) {
      this.setState({usersData: [], count: 0, lastIndexId: null});
      return;
    }

    const {searchUser, auth, navigation, userLogout} = this.props;
    const {group} = this.state;
    const groupId = group ? group.id : 'null';
    const data = {
      searchUser: searchUser,
      auth: auth,
      navigation: navigation,
      userLogout: userLogout,
      lastIndexId: null,
      searchTerm: term,
      groupId: groupId,
    };

    const searchResult = await searchUserFunc(data);
    if (searchResult != 0) {
      const {users, lastIndexId} = searchResult;
      this.setState({
        usersData: users.map(u => {
          return {
            ...u,
            chosen: false,
          };
        }),
        lastIndexId: lastIndexId,
      });
    }

    return;
  };

  onEndReached = async () => {
    const {searchTerm, lastIndexId, usersData, prev_route} = this.state;
    const {searchUser, auth, navigation, userLogout} = this.props;
    const {group} = this.state;
    const groupId = group ? group.id : 'null';

    if (prev_route == 'PostSetting' && usersData.length == 0){
      this.loadGroupMembers(false)
    }

    if (searchTerm < 3) {
      this.setState({usersData: [], lastIndexId: null});
      return;
    }
    const data = {
      searchUser: searchUser,
      auth: auth,
      navigation: navigation,
      userLogout: userLogout,
      lastIndexId: lastIndexId,
      searchTerm: searchTerm,
      groupId: groupId,
    };

    const searchResult = await searchUserFunc(data);
    if (searchResult != 0) {
      const {users, lastIndexId} = searchResult;
      const newUsers = usersData.concat(
        users.map(u => {
          return {
            ...u,
            chosen: false,
          };
        }),
      );
      this.setState({
        usersData: newUsers,
        lastIndexId: lastIndexId,
      });
    }
  };

  onChooseUser = user => {
    let {chosenUser, usersData, prev_route, group} = this.state;
    const { navigation } = this.props

    let newChosenUser = [];
    let newUsersData = [];

    if (prev_route == 'PostSetting' && chosenUser.length != 0){
      chosenUser = []
    }

    if (chosenUser.find(u => u.id == user.id)) {
      newChosenUser = chosenUser.filter(u => u.id != user.id);
      newUsersData = usersData.map(u => {
        if (u.id == user.id) {
          return {
            ...u,
            chosen: false,
          };
        }
        return u;
      });
    } else {
      chosenUser.push(user);
      newChosenUser = [...chosenUser];
      newUsersData = usersData.map(u => {
        if (u.id == user.id) {
          return {
            ...u,
            chosen: true,
          };
        }
        return u;
      });
    }
    this.setState({chosenUser: newChosenUser, usersData: newUsersData});
    if (prev_route == 'PostSetting' && newChosenUser.length == 1){
      navigation.navigate('Nomination', {chosenUser: newChosenUser[0], prev_route: 'PostSetting', groupId: group.id})
    }
  };

  render() {
    const {searchTerm, usersData, chosenUser, prev_route} = this.state;
    const {navigation, user} = this.props;
    let userList = usersData

    if (prev_route == 'PostSetting' && usersData.length == 0){
      userList = user.members.members
    }

    let search_view = (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <View style={styles.optionArea}>
          <UserSearchBar onChange={this.onSearchChange} value={searchTerm} />
        </View>
        {(chosenUser.length == 0 || prev_route == 'PostSetting') ? null : (
          <View style={styles.chosenList}>
            <DisplayNameList
              chosenUser={chosenUser}
              onChooseUser={this.onChooseUser}
            />
          </View>
        )}
        <UserList
          usersData={userList}
          onEndReached={this.onEndReached}
          navigation={navigation}
          onChooseUser={this.onChooseUser}
          prev_route={prev_route}
          chosenUser={chosenUser}
        />
      </KeyboardAvoidingView>
    )

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        {search_view}

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
  optionArea: {
    width: '90%',
    height: '5%',
    marginTop: '3%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS == 'ios' ? 10 : 20,
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    width: '10%',
    height: '80%',
  },
  chosenList: {
    height: 30,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 3,
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
});

const mapStateToProps = state => {
  const {auth, group, user} = state;
  return {auth, group, user};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    searchUser: data => dispatch(searchUser(data)),
    addMembers: data => dispatch(addMembers(data)),
    getGroupMembers: data => dispatch(getGroupMembers(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSearch);
