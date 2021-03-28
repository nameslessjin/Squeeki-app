import React from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/checkin/headerRightButton';
import {userLogout} from '../actions/auth';
import UserList from '../components/users/userList';
import {getGroupCheckInResult, getGroupCheckIn} from '../actions/checkin';

class CheckInResult extends React.Component {
  state = {
    refreshing: false,
  };

  componentDidMount() {
    const {navigation, group, route, auth} = this.props;
    const {userId} = route.params;

    navigation.setOptions({
      headerRight: () =>
        auth.user.id == userId || group.group.auth.rank <= 2 ? (
          <HeaderRightButton
            onPress={this.onHeaderRightButtonPress}
            type={'create'}
            disabled={false}
          />
        ) : null,
      headerBackTitleVisible: false,
      headerTitle: 'Attendees',
    });
    this.loadCheckInResult(true);
  }

  componentWillUnmount() {
    this.loadCheckIn(true);
  }

  onHeaderRightButtonPress = () => {
    const {navigation, group, route} = this.props;
    // const {attendee} = this.state
    // const userIdList = attendee.map(a => a.id)
    navigation.navigate('SearchUser', {
      prev_route: 'CheckInResult',
      // userIdList: userIdList,
      group: group.group,
      checkin_id: route.params.checkin_id,
    });
  };

  loadCheckInResult = async init => {
    const {
      userLogout,
      getGroupCheckInResult,
      auth,
      route,
      navigation,
      checkin,
    } = this.props;
    const count = checkin.attendee_count;
    const request = {
      token: auth.token,
      count: init ? 0 : count,
      checkin_id: route.params.checkin_id,
    };

    const req = await getGroupCheckInResult(request);
    if (req.errors) {
      console.log(req.errors[0].message);
      alert('Cannot load users at this time, please try again later')
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  loadCheckIn = async init => {
    const {group, auth, getGroupCheckIn, navigation, userLogout} = this.props;
    const request = {
      groupId: group.group.id,
      token: auth.token,
      count: init ? 0 : this.state.count,
    };
    this.setState({loading: true});
    const req = await getGroupCheckIn(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load check in at this time, please try again later')
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadCheckInResult(true);
    this.setState({refreshing: false});
  };

  onEndReached = () => {
    this.loadCheckInResult(false);
  };

  render() {
    const {refreshing} = this.state;
    const {attendee} = this.props.checkin;
    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView>
          <StatusBar barStyle={'dark-content'} />
          <UserList
            usersData={attendee}
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            refreshing={refreshing}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  const {auth, group, checkin} = state;
  return {auth, group, checkin};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getGroupCheckInResult: data => dispatch(getGroupCheckInResult(data)),
    getGroupCheckIn: data => dispatch(getGroupCheckIn(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckInResult);
