import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/checkin/headerRightButton';
import {
  getGroupCheckIn,
  cleanCheckIn,
  userCheckIn,
  deleteCheckIn,
} from '../actions/checkin';
import {userLogout} from '../actions/auth';
import CheckinList from '../components/checkin/checkinList';
import CheckinModal from '../components/checkin/checkinModal';
import {getUserGroupPoint} from '../actions/point';

class CheckIn extends React.Component {
  state = {
    ...this.props.checkin,
    modalVisible: false,
    loading: false,
    forceLoad: false,
    checkin_id: null,
    refresh: false,
  };

  componentDidMount() {
    const {navigation, group} = this.props;
    const {rank_setting, auth} = group.group;
    navigation.setOptions({
      headerRight: () =>
        auth.rank <= rank_setting.manage_check_in_rank_required ? (
          <HeaderRightButton
            onPress={this.onHeaderRightButtonPress}
            type={'create'}
            disabled={false}
          />
        ) : null,
      headerBackTitleVisible: false,
      headerTitle: 'Check Ins',
    });

    this.loadCheckIn(true);
  }

  componentWillUnmount() {
    this.getUserGroupPoint();
    this.props.cleanCheckIn();
  }

  getUserGroupPoint = async () => {
    const {group, auth, getUserGroupPoint, navigation, userLogout} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load points at this time, please try again later');
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

  onHeaderRightButtonPress = () => {
    const {navigation} = this.props;
    navigation.navigate('CheckInSetting', {
      forceLoad: this.state.forceLoad,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.checkin != this.props.checkin) {
      this.setState({
        checkin: this.props.checkin.checkin,
        count: this.props.checkin.count,
      });
    }
  }

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
      alert('Cannot load check in at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
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

  onEndReached = () => {
    this.loadCheckIn(false);
  };

  onRefresh = () => {
    this.setState({refresh: true});
    this.loadCheckIn(true);
    this.setState({refresh: false});
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onCheckInPress = i => {
    const {hasPassword, checkinId} = i;
    this.setState({checkin_id: checkinId});
    if (hasPassword) {
      this.setState({modalVisible: true});
    } else {
      this.onCheckIn({password: null, checkin_id: checkinId});
    }
  };

  onCheckIn = async i => {
    const {password, checkin_id} = i;
    const {auth, group, userCheckIn, userLogout} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      checkin_id: checkin_id,
      password: password,
      auth: false,
    };

    const req = await userCheckIn(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot check in at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      this.setState(prevState => {
        return {
          ...prevState,
          checkin: prevState.checkin.map(c =>
            c.id == checkin_id ? {...c, checked: false} : c,
          ),
        };
      });
      return;
    }
  };

  onDeleteCheckIn = async checkin_id => {
    const {userLogout, auth, deleteCheckIn} = this.props;
    const request = {
      token: auth.token,
      checkin_id: checkin_id,
    };

    const req = await deleteCheckIn(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot delete check in at this time, please try again later');
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

  onResultPress = data => {
    const {checkin_id, userId} = data;
    const {navigation} = this.props;
    navigation.navigate('CheckInResult', {
      checkin_id: checkin_id,
      userId: userId,
    });
  };

  render() {
    const {checkin, modalVisible, refresh, checkin_id} = this.state;
    const {auth, group} = this.props;
    return (
      <TouchableWithoutFeedback>
        <View>
          <StatusBar barStyle={'dark-content'} />
          <CheckinList
            checkin={checkin}
            onCheckInPress={this.onCheckInPress}
            currentUserId={auth.user.id}
            auth={group.group.auth}
            rank_required={
              group.group.rank_setting.manage_check_in_rank_required
            }
            onEndReached={this.onEndReached}
            onRefresh={this.onRefresh}
            refresh={refresh}
            onDeleteCheckIn={this.onDeleteCheckIn}
            onResultPress={this.onResultPress}
          />
          <CheckinModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onSubmit={this.onCheckIn}
            checkin_id={checkin_id}
          />
        </View>
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
    getGroupCheckIn: data => dispatch(getGroupCheckIn(data)),
    cleanCheckIn: () => dispatch(cleanCheckIn()),
    userCheckIn: data => dispatch(userCheckIn(data)),
    deleteCheckIn: data => dispatch(deleteCheckIn(data)),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckIn);
