import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
  Platform,
  StatusBar
} from 'react-native';
import GroupCreationButton from '../components/groupSetting/createButton';
import {createGroup} from '../actions/group';
import {connect} from 'react-redux';
import GroupHeader from '../components/groupSetting/groupHeader';
import {userLogout} from '../actions/auth';
import VisibilitySetting from '../components/groupSetting/visibilitySetting';
import SettingEdition from '../components/groupSetting/settingEdition'


class GroupCreation extends React.Component {
  state = {
    icon: null,
    backgroundImg: null,
    groupname: '',
    shortDescription: '',
    initialize: true,
    loading: false,
    visibility: 'private',
    tags: [],
  };

  componentDidMount() {
    Keyboard.dismiss();
    const {navigation} = this.props

    navigation.setOptions({
        headerBackTitleVisible: false
    })
  }

  setGroupHeader = data => {
    const {icon, backgroundImg, groupname, shortDescription} = data;
    this.setState({
      icon: icon,
      backgroundImg: backgroundImg,
      groupname: groupname,
      shortDescription: shortDescription,
    });
  };

  onCreateGroup = async () => {
    Keyboard.dismiss();
    this.setState({loading: true});
    const {
      groupname,
      shortDescription,
      backgroundImg,
      icon,
      visibility,
      tags
    } = this.state;
    const {token} = this.props.auth;
    const data = {
      groupname: groupname.trim(),
      shortDescription: shortDescription.trim(),
      backgroundImg: backgroundImg,
      icon: icon,
      token: token,
      visibility: visibility,
      capacity: 200,
      description: null,
      street: null,
      city: null,
      state: null,
      country: null,
      zipcode: null,
      tags: tags
    };

    const {createGroup, navigation} = this.props;
    const createGroupResult = await createGroup(data);
    if (createGroupResult.errors) {
      alert(createGroupResult.errors[0].message);
      if (createGroupResult.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    } else {
      this.setState({loading: false});
      this.props.navigation.replace('GroupNavigator');
    }
  };

  onVisibilitySwitchToggle = () => {
    const {visibility} = this.state;
    if (visibility == 'public') {
      this.setState({visibility: 'private'});
    } else {
      this.setState({visibility: 'public'});
    }
  };

  onEditTagPress = () => {
    const {navigation} = this.props
    navigation.navigate('Tags', {
      prev_route: 'GroupCreation'
    })
  }

  render() {
    const {groupname, shortDescription, visibility, loading} = this.state;

    let createGroupButtonActive =
      groupname.length >= 6 && shortDescription.length >= 20;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <GroupHeader
            setGroupHeader={this.setGroupHeader}
            data={this.state}
            auth_rank={1}
          />
          <VisibilitySetting
            visibility={visibility}
            onVisibilitySwitchToggle={this.onVisibilitySwitchToggle}
            disabled={false}
          />
          {/* <SettingEdition onPress={this.onEditTagPress} name={"Edit tags"}/> */}
          {loading == true ? (
            <ActivityIndicator
              style={{marginTop: 30}}
              animating={this.state.loading}
            />
          ) : (
            <GroupCreationButton
              onCreateGroup={this.onCreateGroup}
              createGroupButtonActive={createGroupButtonActive}
            />
          )}
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
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    createGroup: data => dispatch(createGroup(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupCreation);
