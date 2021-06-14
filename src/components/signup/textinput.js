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


    let text = 'Email'
    let secureTextEntry = false
    if (type == 'Password'){
        text = 'Password'
        secureTextEntry = true
    } else if (type == 'Email'){
        text = 'Emaill address'
    } else if (type == 'RePassword'){
        text = 'Re-enter password'
        secureTextEntry = true
    } else if (type == 'Username'){
        text = 'Username'
    } else {
        text = 'Enter referal code'
    }

    return (
        <TextInput 
            style={styles.container} 
            value={value} 
            placeholder={text} 
            onChangeText={this.onChangeText}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={'#7f8fa6'}
            maxLength={(text == 'Username') ? 30 : 100 }
        />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 15,
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 30,
    marginTop: 10,
    fontSize: 15,
    color: 'black'
  },
});
