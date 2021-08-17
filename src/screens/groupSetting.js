import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import GroupHeader from '../components/groupSetting/groupHeader';
import UpdateButton from '../components/groupSetting/updateButton';
import {
  updateGroup,
  setGroupVisibility,
  setGroupRequestToJoin,
  leaveGroup,
  getGroupRankName,
} from '../actions/group';
import {getStatusInGroup} from '../actions/user';
import {userLogout} from '../actions/auth';
import ToggleSetting from '../components/groupSetting/toggleSetting';
import SettingEdition from '../components/groupSetting/settingEdition';

class GroupSetting extends React.Component {
  state = {
    initialize: false,
    ...this.props.group.group,
    updateData: {},
    loading: false,
    type: 'visibility',
  };

  componentDidMount() {
    const {auth, rank_setting} = this.props.group.group;
    const {navigation} = this.props;
    navigation.setOptions({
      headerTitle: 'Group Settings',
      headerRight: () =>
        auth.rank <= rank_setting.group_setting_rank_required ? (
          <UpdateButton
            update={false}
            onPress={this.updateGroupSettings}
            loading={this.state.loading}
          />
        ) : null,
      headerBackTitleVisible: false,
    });
    this.getGroupRankName();
  }

  getGroupRankName = async () => {
    const {getGroupRankName, auth, group} = this.props;
    const request = {
      groupId: group.group.id,
      token: auth.token,
    };

    const req = await getGroupRankName(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get rank names at this time, please try again later');
      return;
    }
  };

  validation = () => {
    const {display_name, shortDescription} = this.state;

    // group display name must not contain admin and squeeki
    // group display name must have length greater than 1 and no greather than 50
    if (
      display_name.toLowerCase().search('admin') != -1 ||
      display_name.toLowerCase().search('squeeki') != -1 ||
      display_name.trim().length < 1 ||
      display_name.trim().length > 50
    ) {
      return false;
    }

    // short description must have length greater than 20
    if (shortDescription.length < 20) {
      return false;
    }

    return true;
  };

  extractData = () => {
    let {id, display_name, shortDescription, icon, backgroundImg} = this.state;
    const {group} = this.props.group;
    display_name = display_name.trim();
    shortDescription = shortDescription.trim();

    const origin = {
      display_name: group.display_name,
      shortDescription: group.shortDescription,
      icon: group.icon,
      backgroundImg: group.backgroundImg,
    };

    // if icon picked and origin icon exist
    if (icon == origin.icon) {
      icon = null;
    }

    if (backgroundImg == origin.backgroundImg) {
      backgroundImg = null;
    }

    if (display_name == origin.display_name) {
      display_name = null;
    }

    if (shortDescription == origin.shortDescription) {
      shortDescription = null;
    }

    if (
      icon != null ||
      backgroundImg != null ||
      display_name != null ||
      shortDescription != null
    ) {
      const updateData = {
        token: this.props.auth.token,
        groupId: id,
        display_name: display_name,
        shortDescription: shortDescription,
        icon: icon,
        backgroundImg: backgroundImg,
      };
      return {
        updateData: updateData,
        update: true && this.validation(),
        origin: origin,
      };
    } else {
      return {update: false};
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      let update = false;

      update = this.extractData().update;
      const {navigation} = this.props;
      const {auth, rank_setting} = this.props.group.group;
      navigation.setOptions({
        headerRight: () =>
          auth.rank <= rank_setting.group_setting_rank_required ? (
            <UpdateButton
              update={update}
              onPress={this.updateGroupSettings}
              loading={this.state.loading}
            />
          ) : null,
      });
    }

    if (this.props.group.group.id) {
      if (prevProps.group.group != this.props.group.group) {
        this.setState({
          ...this.props.group.group,
          visibility: prevState.visibility,
          request_to_join: prevState.request_to_join,
        });
      }
    }
  }

  componentWillUnmount() {
    const {group, navigation} = this.props;
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'GroupSetting',
      });
    }
  }

  updateGroupSettings = async () => {
    const {updateData, origin} = this.extractData();
    const {navigation, userLogout} = this.props;
    this.setState({loading: true, type: 'general'});
    const data = {
      updateData: updateData,
      origin: origin,
    };

    const updateGroup = await this.props.updateGroup(data);

    if (updateGroup.errors) {
      // alert(updateGroup.errors[0].message);
      alert(
        'Cannot update group settings at this time, please try again later',
      );
      if (updateGroup.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.setState({loading: false});
    // this.props.navigation.goBack();
  };

  setGroupHeader = data => {
    const {icon, backgroundImg, display_name, shortDescription} = data;
    this.setState({
      icon: icon,
      backgroundImg: backgroundImg,
      display_name: display_name,
      shortDescription: shortDescription,
    });
  };

  onSwitchToggle = async type => {
    const {id} = this.state;
    const {
      navigation,
      userLogout,
      setGroupRequestToJoin,
      setGroupVisibility,
    } = this.props;
    const request = {
      groupId: id,
      token: this.props.auth.token,
    };

    this.setState({loading: true, type: type});
    let req = 0;
    if (type == 'visibility') {
      req = await setGroupVisibility(request);
    } else if (type == 'request_to_join') {
      req = await setGroupRequestToJoin(request);
    }

    if (req.errors) {
      // alert(req.errors[0].message);
      alert(
        'Cannot change group settings at this time, please try again later',
      );
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
        loading: false,
        visibility:
          type == 'visibility'
            ? prevState.visibility == 'public'
              ? 'private'
              : 'public'
            : prevState.visibility,
        request_to_join:
          type == 'request_to_join'
            ? !prevState.request_to_join
            : prevState.request_to_join,
      };
    });
  };

  onPress = type => {
    const {navigation} = this.props;
    const {id} = this.state;

    navigation.navigate(type, {
      prev_route: 'GroupSetting',
      groupId: id,
    });
  };

  onEditProfilePress = async () => {
    const {navigation, group, auth, userLogout, getStatusInGroup} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await getStatusInGroup(request);
    if (req.errors) {
      console.log(req.errors);
      // alert(req.errors[0].message);
      alert('Load profile failed, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    navigation.navigate('Member', {
      ...req,
      prev_route: 'GroupSetting',
    });
  };

  onLeaveGroupPress = () => {
    const {auth} = this.props.group.group;
    const rank = auth ? auth.rank : 7;
    const title = rank <= 1 ? 'Disband the group' : 'Leave the group';
    const message =
      rank != 1
        ? 'Are you sure you want to leave the group?'
        : 'Disband the group can force everyone to leave the group';

    Alert.alert(title, message, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Confirm', onPress: this.leaveGroup, style: 'destructive'},
    ]);
  };

  leaveGroup = async () => {
    const {leaveGroup, navigation, auth, group} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await leaveGroup(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot leave group at this time, please try again later');
    }
    navigation.navigate('Groups');
  };

  render() {
    const {visibility, loading, request_to_join, type} = this.state;
    const {auth, rank_setting} = this.props.group.group;
    const rank = auth ? auth.rank : 7;
    const required_rank = rank_setting
      ? rank_setting.group_setting_rank_required
      : 1;


    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={{height: '100%', width: '100%', backgroundColor: 'white'}}>
          <KeyboardAvoidingView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <GroupHeader
              setGroupHeader={this.setGroupHeader}
              data={this.state}
              navigation={this.props.navigation}
              auth_rank={rank}
              required_rank={required_rank}
            />

            <ToggleSetting
              on={visibility}
              disabled={rank > required_rank}
              loading={type == 'visibility' ? loading : false}
              onToggle={this.onSwitchToggle}
              type={'visibility'}
            />

            <ToggleSetting
              on={request_to_join}
              disabled={rank > required_rank}
              loading={type == 'request_to_join' ? loading : false}
              onToggle={this.onSwitchToggle}
              type={'request_to_join'}
            />

            <SettingEdition
              onPress={this.onEditProfilePress}
              name={'Edit my profile'}
              disabled={false}
            />

            <SettingEdition
              onPress={() => this.onPress('Nomination')}
              name={'Edit nominations'}
              disabled={false}
            />

            <SettingEdition
              onPress={() => this.onPress('Tags')}
              name={'Edit tags'}
              disabled={rank > required_rank}
            />
            <SettingEdition
              onPress={() => this.onPress('RankSetting')}
              name={'Edit ranks'}
              disabled={false}
            />

            <SettingEdition
              onPress={() => this.onPress('GroupRankNameSetting')}
              name={'Edit rank names'}
              disabled={rank > required_rank}
            />

            <View
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <TouchableOpacity onPress={this.onLeaveGroupPress}>
                <Text style={{color: 'red'}}>
                  {rank <= 1 ? 'Disband' : 'Leave'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.empty} />

            <ActivityIndicator
              style={{marginTop: 30}}
              animating={this.state.loading}
              color={'grey'}
            />
          </KeyboardAvoidingView>
        </ScrollView>
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
  empty: {
    height: 200,
    width: '100%',
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    updateGroup: data => dispatch(updateGroup(data)),
    userLogout: () => dispatch(userLogout()),
    setGroupVisibility: data => dispatch(setGroupVisibility(data)),
    setGroupRequestToJoin: data => dispatch(setGroupRequestToJoin(data)),
    getStatusInGroup: data => dispatch(getStatusInGroup(data)),
    leaveGroup: data => dispatch(leaveGroup(data)),
    getGroupRankName: data => dispatch(getGroupRankName(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSetting);
