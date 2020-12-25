import React from 'react';
import {StyleSheet, Dimensions, TextInput} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class SignInTextInput extends React.Component {
  onChangeText = text => {
    const {type} = this.props;
    const {onChangeText} = this.props;
    onChangeText(type, text.trim(''));
  };

  render() {
    const {type, value} = this.props;

    let secureTextEntry = false;
    if (type == 'Password') {
      this.text = 'Password';
      secureTextEntry = true;
    }
    return (
      <TextInput
        style={styles.container}
        value={value}
        placeholder={type == 'Password' ? 'Password' : 'Email Address'}
        onChangeText={this.onChangeText}
        placeholderTextColor={'#7f8fa6'}
        secureTextEntry={secureTextEntry}
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
