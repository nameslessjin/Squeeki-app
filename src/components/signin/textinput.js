import React from 'react';
import {StyleSheet, Dimensions, TextInput} from 'react-native';

const {width} = Dimensions.get('screen');

export default class SignInTextInput extends React.Component {
  onChangeText = text => {
    const {type} = this.props;
    const {onChangeText} = this.props;
    onChangeText(type, text.trim(''));
  };

  render() {
    const {type, value} = this.props;
    let placeholder = 'Email';
    let secureTextEntry = false;
    if (type == 'Password') {
      secureTextEntry = true;
      placeholder = 'Password';
    } else if (type == 'username') {
      placeholder = 'Username';
    } else if (type == 'Email') {
      placeholder == 'Email';
    }

    return (
      <TextInput
        style={styles.container}
        value={value}
        placeholder={placeholder}
        onChangeText={this.onChangeText}
        placeholderTextColor={'#7f8fa6'}
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        autoCapitalize={'none'}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: '7%',
    backgroundColor: 'grey',
    borderRadius: 15,
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 30,
    marginTop: 10,
    fontSize: 0.8 * width * 0.05,
    color: '#333',
  },
});
