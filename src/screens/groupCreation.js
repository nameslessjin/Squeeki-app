import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import GroupCreationButton from '../components/groupSetting/createButton';
import {createGroup} from '../actions/group';
import {connect} from 'react-redux';
import GroupHeader from '../components/groupSetting/groupHeader';
import {userLogout} from '../actions/auth';
import ToggleSetting from '../components/groupSetting/toggleSetting';
import SettingEdition from '../components/groupSetting/settingEdition';
import validator from 'validator';
import CreateButton from '../components/groupSetting/updateButton';

class GroupCreation extends React.Component {
  state = {
    icon: null,
    backgroundImg: null,
    groupname: '',
    display_name: '',
    shortDescription: '',
    initialize: true,
    loading: false,
    visibility: 'public',
    request_to_join: false,
    tags: [],
  };

  componentDidMount() {
    Keyboard.dismiss();
    const {navigation} = this.props;

    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Create Group',
      headerRight: () => (
        <CreateButton
          update={false}
          loading={false}
          onPress={this.onCreateGroup}
        />
      ),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      const {params} = this.props.route;
      if (params) {
        this.setState({tags: params.tags});
      }
    }

    if (prevState != this.state) {
      const update = this.validate();
      const {navigation} = this.props;
      navigation.setOptions({
        headerRight: () => (
          <CreateButton
            update={update}
            loading={this.state.loading}
            onPress={this.onCreateGroup}
          />
        ),
      });
    }
  }

  setGroupHeader = data => {
    const {
      icon,
      backgroundImg,
      groupname,
      shortDescription,
      display_name,
    } = data;
    this.setState({
      icon: icon,
      backgroundImg: backgroundImg,
      groupname: groupname,
      shortDescription: shortDescription,
      display_name,
    });
  };

  onCreateGroup = async () => {
    Keyboard.dismiss();
    this.setState({loading: true});
    const {
      display_name,
      groupname,
      shortDescription,
      backgroundImg,
      icon,
      visibility,
      tags,
      request_to_join,
    } = this.state;
    const {token} = this.props.auth;
    const data = {
      display_name: display_name.trim(),
      groupname: groupname.trim(),
      shortDescription: shortDescription.trim(),
      backgroundImg: backgroundImg,
      icon: icon,
      token: token,
      visibility: visibility,
      capacity: 200,
      request_to_join,
      tagIds: tags.map(t => t.id),
    };

    const {createGroup, navigation} = this.props;
    const createGroupResult = await createGroup(data);
    if (createGroupResult.errors) {
      alert(createGroupResult.errors[0].message);
      // alert('Cannot create group at this time, please try again later')
      if (createGroupResult.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    } else {
      this.props.navigation.replace('GroupNavigator');
    }

    this.setState({loading: false});
  };

  onSwitchToggle = type => {
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

  onEditTagPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Tags', {
      prev_route: 'GroupCreation',
    });
  };

  validate = () => {
    const {groupname, shortDescription, display_name} = this.state;

    const regexp = /^[a-zA-Z0-9_]+$/;
    if (groupname.search(regexp) === -1) {
      return false;
    }

    if (groupname.substring(groupname.length - 1) == '_') {
      return false;
    }

    if (groupname.length < 5 || shortDescription.length < 20 || display_name.trim().length < 6) {
      return false;
    }

    return true;
  };

  render() {
    const {visibility, loading, request_to_join} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={{height: '100%', width: '100%', backgroundColor: 'white'}}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <GroupHeader
              setGroupHeader={this.setGroupHeader}
              data={this.state}
              auth_rank={1}
              required_rank={1}
            />
            <ToggleSetting
              on={visibility}
              onToggle={this.onSwitchToggle}
              disabled={false}
              type={'visibility'}
            />

            <ToggleSetting
              on={request_to_join}
              onToggle={this.onSwitchToggle}
              disabled={false}
              type={'request_to_join'}
            />

            <SettingEdition onPress={this.onEditTagPress} name={'Edit tags'} />

            {loading == true ? (
              <ActivityIndicator
                style={{marginTop: 30}}
                animating={this.state.loading}
              />
            ) : null}
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
