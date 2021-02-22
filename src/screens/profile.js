import React from 'react';
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import {updateProfile, userLogout} from '../actions/auth';
import {connect} from 'react-redux';
import UserTextInput from '../components/profile/textinput';
import ProfileUpdateButton from '../components/profile/profileButton';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import validator from 'validator';
import ProfileModal from '../components/profile/profileModal';

class Profile extends React.Component {
  state = {
    ...this.props.auth.user,
    loading: false,
    icon_option: 'emoticon-cool-outline',
    modalVisible: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]});
    navigation.setOptions({
      headerBackTitleVisible: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.auth.user != this.props.auth.user) {
      this.setState(prevState => ({...prevState, ...this.props.auth.user}));
    }
    if (prevState != this.state) {
      let update = false;
      update = this.extractData().update;
      const {navigation} = this.props;
    }
  }

  componentWillUnmount() {
    // update profile when unmount
    if (this.extractData().update) {
      this.updateProfile();
    }
  }

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
      // alert(profile.errors[0].message);
      alert('Cannot update profile at this time, please try again later');
      if (profile.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
      return;
    }

    this.setState({loading: false});
  };

  onChangeText = (type, text) => {
    if (type == 'Password') {
      this.setState({password: text});
    } else if (type == 'Email') {
      this.setState({email: text.toLowerCase()});
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

    email = email.trim();
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
        update: true && this.validation(),
        origin: origin,
      };
    }
    return {update: false};
  };

  validation = () => {
    const {email, username, displayName} = this.state;
    if (!validator.isEmail(email.trim())) {
      // this.setState({errorText: 'Invalid email address'});
      return false;
    }
    const trimmed_username = username.trim();
    const check_username = trimmed_username.replace(/_/g, '');

    if (
      !validator.isLength(username.trim(), {min: 6, max: 30}) ||
      !validator.isAlphanumeric(check_username.trim())
    ) {
      // this.setState({errorText: 'Invalid username'})
      return false;
    }

    if (!validator.isLength(displayName.trim(), {min: 6, max: 30})) {
      return false;
    }

    return true;
  };

  onChangePasswordPress = () => {
    this.props.navigation.navigate('ChangePassword', {
      token: null,
    });
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  render() {
    const {
      email,
      errorText,
      username,
      icon,
      loading,
      displayName,
      icon_option,
      modalVisible,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <TouchableOpacity
            style={styles.imageStyle}
            onPress={() => this.setState({modalVisible: true})}>
            {icon != null ? (
              <Image source={{uri: icon.uri}} style={styles.imageStyle} />
            ) : (
              <MaterialIcons name={icon_option} size={100} />
            )}
          </TouchableOpacity>
          <View style={{marginTop: 10}}>
            <Text style={{color: 'grey'}}>@{username}</Text>
          </View>

          <UserTextInput
            type={'DisplayName'}
            onChangeText={this.onChangeText}
            value={displayName}
          />

          {/* <UserTextInput
            type={'Username'}
            onChangeText={this.onChangeText}
            value={username}
          /> */}

          <UserTextInput
            type={'Email'}
            onChangeText={this.onChangeText}
            value={email}
          />

          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={this.onChangePasswordPress}>
            <Text style={{color: '#487eb0'}}>Change password</Text>
          </TouchableOpacity>

          <Text style={{color: 'red'}}>{errorText}</Text>
          <ActivityIndicator animating={loading} />
          <ProfileModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onChangeMedia={this.setIcon}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
