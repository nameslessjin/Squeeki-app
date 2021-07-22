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
      this.loadGroups(true);
    }
    Keyboard.dismiss();
  }

  onEndReached = async () => {
    this.loadGroups(false);
  };

  onRefresh = () => {
    this.loadGroups(true);
  };

  loadGroups = async init => {
    const {
      findUserGroupsByUserId,
      navigation,
      userLogout,
      group,
      auth,
    } = this.props;

    this.setState({loading: true});
    const groupsData = await findUserGroupsByUserId({
      token: auth.token,
      count: init ? 0 : group.groups.count,
    });

    if (groupsData.errors) {
      console.log(groupsData.errors[0].message);
      alert('Cannot load groups at this time, please try again later');
      if (groupsData.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.setState({loading: false});
  };

  render() {
    const {groups, count} = this.props.group.groups;
    const {navigation} = this.props;
    const {loading} = this.state;

    return (
      <KeyboardAvoidingView style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        {groups.length == 0 ? (
          <Text style={styles.noGroupStyle}>
            You haven't joined a group yet
          </Text>
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <GroupList
              groupsData={groups || []}
              navigation={navigation}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
              route={'groups'}
            />
          </TouchableWithoutFeedback>
        )}
        {/* {loading ? <ActivityIndicator animating={loading} /> : null} */}
      </KeyboardAvoidingView>
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
