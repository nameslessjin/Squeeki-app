import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import ForgetPasswordTextInput from '../components/forgetPassword/textInput';
import RightButton from '../components/forgetPassword/rightButton';
import validator from 'validator';
import {connect} from 'react-redux';
import {requireVerificationCode, checkVerificationCode} from '../actions/auth';

class ForgetPassword extends React.Component {
  state = {
    email: '',
    verification_code: '',
    message: ''
  };

  onChangeText = (type, text) => {
    if (type == 'email') {
      this.setState({email: text.toLowerCase()});
    } else if (type == 'verification_code') {
      this.setState({verification_code: text});
    }
  };

  checkVerificationCode = async () => {
    if (this.validation()) {
      alert('Email or verification code format incorrect');
      return;
    }
    const {email, verification_code} = this.state;
    const data = {
      email: email,
      verification_code: verification_code,
    };
    const token = await this.props.checkVerificationCode(data);
    if (token.errors) {
      // alert(token.errors[0].message);
      alert('Cannot verify verification code at this time, please try again later')
      return;
    }

    this.props.navigation.navigate('ChangePassword', {
      token: token,
    });
  };

  requireVerificationCode = async () => {
    const {email} = this.state;
    if (!validator.isEmail(email)) {
      alert('Email is invalid');
      return;
    }

    // call database to get verification code
    const verification = await this.props.requireVerificationCode(email);
    if (verification.errors) {
      // alert(verification.errors[0].message);
      alert('Cannot require verification code at this time, please try again later')
    }
    this.setState({message: '(sent)'})
    return;
  };

  componentDidMount() {
    const {navigation} = this.props;
    const button = (
      <RightButton disabled={true} onPress={this.checkVerificationCode} />
    );
    navigation.setOptions({
      headerTitle: 'Forget Password',
      headerRight: () => button,
      headerBackTitleVisible: false
    });
  }

  componentDidUpdate() {
    const {navigation} = this.props;
    const disabled = this.validation();
    const button = (
      <RightButton disabled={disabled} onPress={this.checkVerificationCode} />
    );
    navigation.setOptions({
      headerRight: () => button,
    });
  }

  validation = () => {
    let {email, verification_code} = this.state;

    if (!validator.isEmail(email)) {
      return true;
    }

    if (!validator.isLength(verification_code, {min: 8})) {
      return true;
    }
    return false;
  };

  render() {
    const {email, verification_code, message} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <ForgetPasswordTextInput
            type={'email'}
            onChangeText={this.onChangeText}
            value={email}
          />

          <View style={styles.verificationButtonContainer}>
            <TouchableOpacity
              style={styles.verificationButton}
              onPress={this.requireVerificationCode}>
              <Text style={[styles.verificationButtonText]}>
                {'Get Verification Code ' + message}
              </Text>
            </TouchableOpacity>
          </View>

          <ForgetPasswordTextInput
            type={'verification_code'}
            onChangeText={this.onChangeText}
            value={verification_code}
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
  verificationButtonContainer: {
    marginTop: 10,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 25,
  },
  verificationButton: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#7f8fa6',
  },
  verificationButtonText: {
    color: '#7f8fa6',
    fontSize: 12,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    requireVerificationCode: data => dispatch(requireVerificationCode(data)),
    checkVerificationCode: data => dispatch(checkVerificationCode(data)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(ForgetPassword);
