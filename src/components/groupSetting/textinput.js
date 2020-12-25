import React from 'react'
import {TextInput, StyleSheet} from 'react-native'

export default class GroupCreationTextInput extends React.Component {


    render(){
        const {placeholder, value, multiline, maxLength, focus, onFocus, onChangeText} = this.props
        const {textInput, onFocusTextInputBorderColor, defaultTextInputBorderColor} = styles
        return(
            <TextInput
                placeholder={placeholder}
                value={value}
                multiline={multiline}
                maxLength={maxLength}
                style={[textInput, (focus) ? onFocusTextInputBorderColor : defaultTextInputBorderColor]}
                onFocus={e=>onFocus(e)}
                onChangeText={(text) => onChangeText(placeholder, text)}
            />
        )
    }

}

const styles = StyleSheet.create({
  textInput: {
    marginTop: 50,
    width: '80%',
    paddingTop: 4,
    paddingLeft: 5,
    fontSize: 20,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  onFocusTextInputBorderColor: {
    borderBottomColor: '#74b9ff',
  },
  defaultTextInputBorderColor: {
    borderBottomColor: '#dfe6e9',
  },
})