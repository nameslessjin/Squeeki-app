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
} from 'react-native';
import {connect} from 'react-redux';
import GroupHeader from '../components/groupSetting/groupHeader';
import UpdateButton from '../components/groupSetting/updateButton';
import validator from 'validator';
import {updateGroup, setGroupVisibility} from '../actions/group';
import {userLogout} from '../actions/auth';
import VisibilitySetting from '../components/groupSetting/visibilitySetting';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingEdition from '../components/groupSetting/settingEdition'

class GroupSetting extends React.Component {
  state = {
    initialize: false,
    ...this.props.group.group,
    updateData: {},
    loading: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerTitle: 'Group Settings',
      headerRight: () => (
        <UpdateButton
          update={false}
          onPress={this.updateGroupSettings}
          loading={this.state.loading}
        />
      ),
      headerBackTitleVisible: false
    });
  }

  validation = () => {
    const {groupname, shortDescription} = this.state;
    if (!validator.isLength(groupname.trim(), {min: 6})) {
      return false;
    }

    if (!validator.isLength(shortDescription.trim(), {min: 20})) {
      return false;
    }
    return true;
  };

  extractData = () => {
    let {id, groupname, shortDescription, icon, backgroundImg} = this.state;

    groupname = groupname.trim();
    shortDescription = shortDescription.trim();

    const origin = {
      groupname: this.props.group.group.groupname,
      shortDescription: this.props.group.group.shortDescription,
      icon: this.props.group.group.icon,
      backgroundImg: this.props.group.group.backgroundImg,
    };

    if (icon == origin.icon) {
      icon = null;
    }
    if (backgroundImg == origin.backgroundImg) {
      backgroundImg = null;
    }

    if (groupname == origin.groupname) {
      groupname = null;
    }

    if (shortDescription == origin.shortDescription) {
      shortDescription = null;
    }

    if (
      icon != null ||
      backgroundImg != null ||
      groupname != null ||
      shortDescription != null
    ) {
      const updateData = {
        token: this.props.auth.token,
        groupId: id,
        groupname: groupname,
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
      navigation.setOptions({
        headerRight: () => (
          <UpdateButton
            update={update}
            onPress={this.updateGroupSettings}
            loading={this.state.loading}
          />
        ),
      });
    }
  }

  updateGroupSettings = async () => {
    const {updateData, origin} = this.extractData();
    const {navigation, userLogout} = this.props;
    this.setState({loading: true});
    const data = {
      updateData: updateData,
      origin: origin,
    };

    const updateGroup = await this.props.updateGroup(data);

    if (updateGroup.errors) {
      alert(updateGroup.errors[0].message);
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
    const {icon, backgroundImg, groupname, shortDescription} = data;
    this.setState({
      icon: icon,
      backgroundImg: backgroundImg,
      groupname: groupname,
      shortDescription: shortDescription,
    });
  };

  onVisibilitySwitchToggle = async () => {
    const {visibility, id} = this.state;
    const {navigation, userLogout} = this.props;
    const data = {
      groupId: id,
      token: this.props.auth.token,
    };

    const updateVisibility = await this.props.setGroupVisibility(data);
    if (updateVisibility.errors) {
      alert(updateVisibility.errors[0].message);
      if (updateGroup.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    if (visibility == 'public') {
      this.setState({visibility: 'private'});
    } else {
      this.setState({visibility: 'public'});
    }
  };

  onNominationCreationPress = () => {
    const {navigation} = this.props
    const { id } = this.state
    navigation.navigate('Nomination', {
      prev_route: 'GroupSetting',
      groupId: id,
    })
  }

  onEditTagPress = () => {
    const {navigation} = this.props
    navigation.navigate('Tags', {
      prev_route: 'GroupSetting'
    })
  }

  render() {
    const {visibility} = this.state;
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

          <VisibilitySetting
            visibility={visibility}
            onVisibilitySwitchToggle={this.onVisibilitySwitchToggle}
            disabled={auth_rank > 1}
          />

          <SettingEdition onPress={this.onNominationCreationPress} name={"Edit nominations"}/>
          <SettingEdition onPress={this.onEditTagPress} name={"Edit tags"}/>

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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSetting);
