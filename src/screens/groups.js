import React from 'react';
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import GroupList from '../components/groups/groupList';
import {findUserGroupsByUserId} from '../actions/group';
import {userLogout} from '../actions/auth';

const {width, height} = Dimensions.get('window');

class Groups extends React.Component {
  state = {
    loading: false,
    refreshing: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const {currentScreen} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'Groups' &&
      prevScreen.currentScreen != 'Groups'
    ) {
      // this.findGroups(null);
      this.setState({loading: true})
      this.loadGroups(true);
      this.setState({loading: false})
    }
    Keyboard.dismiss();
  }

  onEndReached = async () => {
    this.setState({loading: true});

    this.loadGroups(false);
    this.setState({loading: false});
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadGroups(true);
    this.setState({refreshing: false});
  };

  loadGroups = async init => {
    const {token} = this.props.auth;
    const {findUserGroupsByUserId, navigation, userLogout} = this.props;
    console.log(this.props.group.groups)
    const groupsData = await findUserGroupsByUserId({
      token: token,
      lastIndexId: init ? null : this.props.group.groups.lastIndexId,
    });

    if (groupsData.errors) {
      alert(groupsData.errors[0].message);
      if (groupsData.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  render() {
    const {groups, count} = this.props.group.groups;
    const {navigation} = this.props;
    const {loading} = this.state;


    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {groups.length == 0 ? (
            <Text style={styles.noGroupStyle}>
              You haven't joined a group yet
            </Text>
          ) : (
            <GroupList
              groupsData={groups || []}
              navigation={navigation}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
            />
          )}
          {loading ? <ActivityIndicator animating={true} /> : null}
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
    backgroundColor: '#ffffff',
  },
  noGroupStyle: {
    marginTop: 100,
    color: 'grey',
    fontStyle: 'italic',
  },
});

const mapStateToProps = state => {
  const {currentScreen, auth, group} = state;
  return {currentScreen, auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    findUserGroupsByUserId: data => dispatch(findUserGroupsByUserId(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Groups);
