import React from 'react';
import {StyleSheet, Dimensions, TextInput} from 'react-native';

export default class SignUnTextInput extends React.Component {


  onChangeText = text => {
    const {type} = this.props;
    const {onChangeText} = this.props
    onChangeText(type, text.trim(''))
  };

  render() {
    const {type, value} = this.props;

    this.text = 'Email'
    let secureTextEntry = false
    if (type == 'Password'){
        this.text = 'Password'
        secureTextEntry = true
    } else if (type == 'Email'){
        this.text = 'Emaill address'
    } else if (type == 'RePassword'){
        this.text = 'Re-enter password'
        secureTextEntry = true
    } else if (type == 'Username'){
        this.text = 'Username'
    } else {
        this.text = 'Enter referal code'
    }

    return (
        <TextInput 
            style={styles.container} 
            value={value} 
            placeholder={this.text} 
            onChangeText={this.onChangeText}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={'#7f8fa6'}
            maxLength={(this.text == 'Username') ? 30 : 100 }
        />
    )
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
    fontSize: 15,
    color: 'black'
  },
});
