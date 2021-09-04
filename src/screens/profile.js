import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View,
} from 'react-native';
import {updateProfile, userLogout, getDefaultIcon} from '../actions/auth';
import {connect} from 'react-redux';
import UserTextInput from '../components/profile/textinput';
import validator from 'validator';
import ProfileModal from '../components/profile/profileModal';
import {singleDefaultIcon} from '../utils/defaultIcon';
import {getTheme} from '../utils/theme';
import ProfileButton from '../components/profile/profileButton';

class Profile extends React.Component {
  state = {
    ...this.props.auth.user,
    email: this.props.auth.user.email ? this.props.auth.user.email : '',
    loading: false,
    modalVisible: false,
    defaultIcons: [],
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
      headerRight: () => (
        <ProfileButton update={false} loading={false} theme={theme} />
      ),
    });
    this.getDefaultIcon();
  }

  componentDidUpdate(prevProps, prevState) {
    const {navigation} = this.props;
    const {update} = this.extractData();
    const {loading, theme} = this.state;

    if (this.props.auth.user != prevProps.auth.user) {
      this.setState(prevState => ({...prevState, ...this.props.auth.user}));
    }

    navigation.setOptions({
      headerRight: () => (
        <ProfileButton
          update={update}
          loading={loading}
          theme={theme}
          onPress={this.updateProfile}
        />
      ),
    });
  }

  getDefaultIcon = () => {
    this.props
      .getDefaultIcon()
      .then(defaultIcons => {
        this.setState({defaultIcons});
      })
      .catch(err => console.log(err));
  };

  setIcon = (data, type) => {
    this.setState({icon: data, modalVisible: false});
  };

  updateProfile = async () => {
    const {updateProfile, navigation, userLogout} = this.props;
    const {updateData, origin} = this.extractData();

    const data = {
      updateData: updateData,
      origin: origin,
    };
    this.setState({loading: true});
    const profile = await updateProfile(data);
    if (profile.errors) {
      console.log(profile.errors[0].message);

      if (profile.errors[0].message == 'Email is already used') {
        alert(profile.errors[0].message);
      } else {
        alert('Cannot update profile at this time, please try again later');
      }
      this.setState({loading: false});
      return;
    }

    this.setState({loading: false});
  };

  onChangeText = (type, text) => {
    if (type == 'Password') {
      this.setState({password: text});
    } else if (type == 'Email') {
      this.setState({email: text.toLowerCase().trim()});
    } else if (type == 'RePassword') {
      this.setState({rePassword: text});
    } else if (type == 'Username') {
      this.setState({username: text});
    } else if (type == 'DisplayName') {
      this.setState({displayName: text});
    }
  };

  extractData = () => {
    let {email, username, icon, displayName} = this.state;
    const {token, user} = this.props.auth;

    email = email ? email.trim() : null;
    username = username.trim();
    displayName = displayName.trim();
    origin = {
      ...user,
    };

    if (icon == origin.icon) {
      icon = null;
    }
    if (email == origin.email) {
      email = null;
    }
    if (username == origin.username) {
      username = null;
    }

    if (displayName == origin.displayName) {
      displayName = null;
    }

    if (
      icon != null ||
      email != null ||
      username != null ||
      displayName != null
    ) {
      const updateData = {
        icon: icon,
        email: email,
        username: username,
        displayName: displayName,
        token: token,
      };

      return {
        updateData: updateData,
        update: this.validation(),
        origin: origin,
      };
    }
    return {update: false};
  };

  validation = () => {
    const {email, username, displayName} = this.state;
    const origin = this.props.auth.user;

    if (email) {
      if (!validator.isEmail(email.trim())) {
        // this.setState({errorText: 'Invalid email address'});
        return false;
      }
    }

    // const trimmed_username = username.trim();
    // const check_username = trimmed_username.replace(/_/g, '');

    // if (
    //   !validator.isLength(username.trim(), {min: 6, max: 30}) ||
    //   !validator.isAlphanumeric(check_username.trim())
    // ) {
    //   // this.setState({errorText: 'Invalid username'})
    //   return false;
    // }

    // display name must not contain admin and squeeki
    // display name must have length greater than 1 and no greather than 50
    if (
      displayName.toLowerCase().search('admin') != -1 ||
      displayName.toLowerCase().search('squeeki') != -1 ||
      displayName.trim().length < 1 ||
      displayName.trim().length > 50
    ) {
      return false;
    }

    if (email == origin.email && displayName == origin.displayName) {
      return false;
    }

    return true;
  };

  onChangePasswordPress = () => {
    this.props.navigation.navigate('ChangePassword', {
      token: this.props.auth.user.token,
      prevRoute: 'Profile',
    });
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onDefaultIconPress = url => {
    this.setState({icon: {uri: url}});
    this.onBackdropPress();
  };

  render() {
    const {
      email,
      errorText,
      username,
      icon,
      loading,
      displayName,
      modalVisible,
      defaultIcons,
      theme,
    } = this.state;
    const {user} = this.props.auth;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
          <TouchableOpacity onPress={() => this.setState({modalVisible: true})}>
            <Image
              source={icon ? {uri: icon.uri} : singleDefaultIcon()}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
          <View style={{marginTop: 10}}>
            <Text style={{color: 'grey'}}>@{username}</Text>
          </View>

          <UserTextInput
            type={'DisplayName'}
            onChangeText={this.onChangeText}
            value={displayName}
            theme={theme}
          />

          {/* <UserTextInput
            type={'Username'}
            onChangeText={this.onChangeText}
            value={username}
          /> */}

          {user.email ? (
            <UserTextInput
              type={'Email'}
              onChangeText={this.onChangeText}
              value={email}
              theme={theme}
            />
          ) : null}

          {user.email ? (
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={this.onChangePasswordPress}>
              <Text style={theme.titleColor}>Change password</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={this.onChangePasswordPress}>
              <Text style={theme.titleColor}>Create email and password</Text>
            </TouchableOpacity>
          )}

          <Text style={{color: 'red'}}>{errorText}</Text>
          <ActivityIndicator animating={loading} color={'grey'} />
          <ProfileModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onChangeMedia={this.setIcon}
            defaultIcons={defaultIcons}
            onDefaultIconPress={this.onDefaultIconPress}
            theme={theme}
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
    paddingTop: 5,
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  imageStyle: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  changePasswordButton: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    updateProfile: data => dispatch(updateProfile(data)),
    userLogout: () => dispatch(userLogout()),
    getDefaultIcon: () => dispatch(getDefaultIcon()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
