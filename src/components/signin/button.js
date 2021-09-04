import React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';

export default class SignInButton extends React.Component {
  render() {
    const {type, onPress} = this.props;
    const isSignin = type == 'signin' ? true : false;
    const buttonStyle = isSignin ? styles.signInButton : styles.secondaryButton;
    const textStyle = isSignin ? styles.signInButtonText : styles.secondaryText;
    let text = 'Start';
    if (isSignin) {
      text = 'Start';
    } else if (type == 'forget_password') {
      text = 'Forget password';
    } else if (type == 'signup') {
      text = 'Create an account';
    } else if (type == 'haveNoAccount') {
      text = 'Have an account?';
    } else if (type == 'haveAccount'){
      text = "Don't have an account"
    }

    return (
      <TouchableOpacity style={buttonStyle} onPress={() => onPress(type)}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  signInButton: {
    height: '6%',
    width: '27%',
    backgroundColor: '#EA2027',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 25,
    // fontFamily: 'Jellee-Roman',
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#b2bec3',
  },
  secondaryText: {
    color: '#b2bec3',
  },
});
