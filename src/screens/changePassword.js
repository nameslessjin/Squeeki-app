import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import UserTextInput from '../components/profile/textinput';
import validator from 'validator';
import {connect} from 'react-redux';
import {userLogout, changePassword, resetPassword} from '../actions/auth';

class ChangePassword extends React.Component {
  state = {
    currentPassword: '',
    newPassword: '',
    reNewPassword: '',
    errorText: '',
    loading: false,
  };

  componentDidMount() {
    const {token} = this.props.route.params;
    this.setState({token: token});
    const {navigation} = this.props
    navigation.setOptions({
        headerBackTitleVisible: false,
        headerTitle: 'Change Password'
    })
  }

  onChangePassword = async () => {
    if (!this.validation()) {
      return;
    }
    this.setState({loading: true});
    const {currentPassword, newPassword} = this.state;
    const {auth, changePassword, navigation, userLogout} = this.props;
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      token: auth.token,
    };

    const user = await changePassword(data);

    if (user.errors) {
      this.setState({errorText: user.errors[0].message});
      if (user.errors[0].message == 'Not Authenticated') {
        // alert(user.errors[0].message);
        alert('Cannot change password at this time, please try again later')
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    } else {
      this.setState({errorText: 'Change password succeed'});
    }
    this.setState({loading: false});
  };

  onResetPassword = async () => {
    if (!this.validation()) {
      return;
    }
    this.setState({loading: true});
    const {newPassword, token} = this.state;
    const {resetPassword, navigation} = this.props;

    const data = {
      token: token,
      newPassword: newPassword,
    };

    const reset = await resetPassword(data);

    if (reset.errors) {

      // alert(reset.errors[0].message);
      alert('Cannot reset password at this time, please try again later')
      return;
    }

    alert('Reset password succeed');

    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };

  onChangeText = (type, text) => {
    if (type == 'currentPassword') {
      this.setState({currentPassword: text});
    } else if (type == 'newPassword') {
      this.setState({newPassword: text});
    } else if (type == 'reNewPassword') {
      this.setState({reNewPassword: text});
    }
  };

  validation = () => {
    const {newPassword, reNewPassword} = this.state;

    if (!validator.isLength(newPassword, {min: 8})) {
      this.setState({
        errorText:
          'Password must be at least 8 character long and contains numbers and characters',
      });
      return false;
    }

    if (!validator.equals(newPassword, reNewPassword)) {
      this.setState({errorText: 'Password mismatch'});
      return false;
    }
    return true;
  };

  render() {
    const {
      currentPassword,
      newPassword,
      reNewPassword,
      errorText,
      loading,
      token,
    } = this.state;

    let buttonActivate = false;

    if (token == null) {
      buttonActivate =
        !loading &&
        (currentPassword.length == 0 ||
        newPassword.length == 0 ||
        reNewPassword.length == 0
          ? false
          : true);
    } else {
      buttonActivate =
        !loading &&
        (newPassword.length == 0 || reNewPassword.length == 0 ? false : true);
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {token == null ? (
            <UserTextInput
              type={'currentPassword'}
              onChangeText={this.onChangeText}
              value={currentPassword}
            />
          ) : null}

          <UserTextInput
            type={'newPassword'}
            onChangeText={this.onChangeText}
            value={newPassword}
          />

          <UserTextInput
            type={'reNewPassword'}
            onChangeText={this.onChangeText}
            value={reNewPassword}
          />

          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={
              token == null ? this.onChangePassword : this.onResetPassword
            }
            disabled={!buttonActivate}>
            <Text
              style={buttonActivate ? {color: '#487eb0'} : {color: '#95a5a6'}}>
              Done
            </Text>
          </TouchableOpacity>

          <Text style={{color: 'red'}}>{errorText}</Text>
          <ActivityIndicator animating={loading} style={{marginTop: 5}} />
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
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 15,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    changePassword: data => dispatch(changePassword(data)),
    userLogout: () => dispatch(userLogout()),
    resetPassword: data => dispatch(resetPassword(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePassword);
