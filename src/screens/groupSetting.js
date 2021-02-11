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
} from 'react-native';
import {connect} from 'react-redux';
import GroupHeader from '../components/groupSetting/groupHeader';
import UpdateButton from '../components/groupSetting/updateButton';
import validator from 'validator';
import {
  updateGroup,
  setGroupVisibility,
  setGroupRequestToJoin,
  getSingleGroupById,
} from '../actions/group';
import { getStatusInGroup } from '../actions/user'
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
    const {auth} = this.props.group.group;
    const {navigation} = this.props;
    navigation.setOptions({
      headerTitle: 'Group Settings',
      headerRight: () =>
        auth.rank <= 2 ? (
          <UpdateButton
            update={false}
            onPress={this.updateGroupSettings}
            loading={this.state.loading}
          />
        ) : null,
      headerBackTitleVisible: false,
    });
  }

  validation = () => {
    const {display_name, shortDescription} = this.state;
    if (!validator.isLength(display_name.trim(), {min: 6})) {
      return false;
    }

    if (!validator.isLength(shortDescription.trim(), {min: 20})) {
      return false;
    }
    return true;
  };

  extractData = () => {
    let {id, display_name, shortDescription, icon, backgroundImg} = this.state;
    const {group} = this.props.group
    display_name = display_name.trim();
    shortDescription = shortDescription.trim();

    const origin = {
      display_name: group.display_name,
      shortDescription: group.shortDescription,
      icon: group.icon,
      backgroundImg: group.backgroundImg,
    };

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
      const {auth} = this.props.group.group;
      navigation.setOptions({
        headerRight: () =>
          auth.rank <= 2 ? (
            <UpdateButton
              update={update}
              onPress={this.updateGroupSettings}
              loading={this.state.loading}
            />
          ) : null,
      });
    }
  }

  componentWillUnmount() {
    const {group} = this.props;
    if (group.group.id) {
      this.getGroup();
    }
  }

  getGroup = async () => {
    const {
      group,
      auth,
      userLogout,
      navigation,
      getSingleGroupById,
    } = this.props;
    const request = {
      token: auth.token,
      id: group.group.id,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load group at this time, please try again later');
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
    this.props.navigation.goBack();
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
            ? prevState.request_to_join
              ? false
              : true
            : prevState.request_to_join,
      };
    });
  };

  onNominationCreationPress = () => {
    const {navigation} = this.props;
    const {id} = this.state;
    navigation.navigate('Nomination', {
      prev_route: 'GroupSetting',
      groupId: id,
    });
  };

  onEditTagPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Tags', {
      prev_route: 'GroupSetting',
    });
  };

  onEditProfilePress = async() => {
    const {navigation, group, auth, userLogout, getStatusInGroup} =  this.props
    const request = {
      token: auth.token,
      groupId: group.group.id
    }


    const req = await getStatusInGroup(request)
    if (req.errors) {
      console.log(req.errors)
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
    })
  }

  render() {
    const {visibility, loading, request_to_join, type} = this.state;
    const auth_in_group = this.props.group.group.auth;
    const auth_rank = auth_in_group ? auth_in_group.rank : 7;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <GroupHeader
            setGroupHeader={this.setGroupHeader}
            data={this.state}
            navigation={this.props.navigation}
            auth_rank={auth_rank}
          />

          <ToggleSetting
            on={visibility}
            disabled={auth_rank > 1}
            loading={type == 'visibility' ? loading : false}
            onToggle={this.onSwitchToggle}
            type={'visibility'}
          />

          <ToggleSetting
            on={request_to_join}
            disabled={auth_rank > 1}
            loading={type == 'request_to_join' ? loading : false}
            onToggle={this.onSwitchToggle}
            type={'request_to_join'}
          />

          <SettingEdition
            onPress={this.onEditProfilePress}
            name={'Edit your profile'}
            disabled={false}
          />

          <SettingEdition
            onPress={this.onNominationCreationPress}
            name={'Edit nominations'}
            disabled={auth_rank >= 2}
          />
          <SettingEdition
            onPress={this.onEditTagPress}
            name={'Edit tags'}
            disabled={auth_rank >= 2}
          />

          <ActivityIndicator
            style={{marginTop: 30}}
            animating={this.state.loading}
          />
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
});

const mapStateToProps = state => {
  const {group, currentScreen, auth} = state;
  return {group, currentScreen, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    updateGroup: data => dispatch(updateGroup(data)),
    userLogout: () => dispatch(userLogout()),
    setGroupVisibility: data => dispatch(setGroupVisibility(data)),
    setGroupRequestToJoin: data => dispatch(setGroupRequestToJoin(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
    getStatusInGroup: data => dispatch(getStatusInGroup(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSetting);
