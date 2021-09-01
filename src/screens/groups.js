import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import GroupList from '../components/groups/groupList';
import {findUserGroupsByUserId} from '../actions/group';
import {userLogout} from '../actions/auth';
import {getTheme} from '../utils/theme';

class Groups extends React.Component {
  state = {
    loading: false,
    refreshing: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidUpdate(prevProps, prevState) {
    const {currentScreen, auth, navigation} = this.props;
    const prevScreen = prevProps.currentScreen;
    if (
      currentScreen.currentScreen == 'Groups' &&
      prevScreen.currentScreen != 'Groups'
    ) {
      this.loadGroups(true);
    }

    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
        headerTintColor: theme.textColor.color,
      });
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
    const {navigation, auth} = this.props;
    const {theme} = this.state;

    return (
      <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
        <StatusBar
          barStyle={
            auth
              ? auth.user.theme == 'darkMode'
                ? 'light-content'
                : 'dark-content'
              : 'dark-content'
          }
        />
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
