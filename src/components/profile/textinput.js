import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

export default class SignUpTextInput extends React.Component {
  onChangeText = text => {
    const {type, onChangeText} = this.props;
    if (type == 'DisplayName') {
      onChangeText(type, text);
    } else {
      onChangeText(type, text.trim(''));
    }
  };

  render() {
    const {type, value, theme} = this.props;

    this.text = 'Email';
    let secureTextEntry = false;
    if (type == 'Password') {
      this.text = 'Password';
      secureTextEntry = true;
    } else if (type == 'Email') {
      this.text = 'Emaill address';
    } else if (type == 'RePassword') {
      this.text = 'Re-enter password';
      secureTextEntry = true;
    } else if (type == 'Username') {
      this.text = 'Username';
    } else if (type == 'currentPassword') {
      this.text = 'Current Password';
      secureTextEntry = true;
    } else if (type == 'newPassword') {
      this.text = 'New Password';
      secureTextEntry = true;
    } else if (type == 'reNewPassword') {
      this.text = 'Re-enter new Password';
      secureTextEntry = true;
    } else if (type == 'DisplayName') {
      this.text = 'Display name';
    }

    return (
      <View style={[styles.container,]}>
        <Text style={[styles.text, theme.titleColor]}>{this.text}</Text>
        <TextInput
          style={styles.textInput}
          value={value}
          placeholder={this.text}
          onChangeText={this.onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={'#7f8fa6'}
          maxLength={50}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 60,
    marginVertical: 10
  },
  textInput: {
    width: '100%',
    height: 45,
    borderRadius: 15,
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 30,
    color: 'black'
  },
  text: {
    width: '90%',
    height: 15,
    marginTop: 15,
    color: '#273c75',
    fontSize: 12,
    paddingLeft: 5,
  }
});
