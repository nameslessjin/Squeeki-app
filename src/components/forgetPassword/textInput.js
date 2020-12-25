import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

export default class ForgetPasswordTextInput extends React.Component {
  onChangeText = text => {
    const {type, onChangeText} = this.props;
    onChangeText(type, text.trim(''));
  };

  render() {
    const {type, value} = this.props;

    let text = 'Email';

    if (type == 'verification_code') {
      text = 'Verification Code';
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        <TextInput
          style={styles.textInput}
          value={value}
          placeholder={text}
          onChangeText={this.onChangeText}
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
    marginVertical: 10,
  },
  textInput: {
    width: '100%',
    height: 45,
    borderRadius: 15,
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 30,
    color: 'black',
  },
  text: {
    width: '90%',
    height: 15,
    marginTop: 15,
    color: '#273c75',
    fontSize: 12,
    paddingLeft: 5,
  },
});
