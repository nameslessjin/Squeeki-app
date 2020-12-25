import React from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-community/picker';
import {StyleSheet, TextInput, Text, View, Platform} from 'react-native';

export default class InputPicker extends React.Component {
  priorityOptions = [
    {key: '0', label: '0', value: 0},
    {key: '1', label: '1', value: 1},
    {key: '2', label: '2', value: 2},
    {key: '3', label: '3', value: 3},
  ];

  typeOptions = [
    {key: 'post', label: 'Post', value: 'post'},
    {key: 'event', label: 'Event', value: 'event'},
    {key: 'request', label: 'Request', value: 'request'},
  ];

  commentOptions = [
    {key: 'true', label: 'Yes', value: 'true'},
    {key: 'false', label: 'No', value: 'false'},
  ];

  viewOptions = [
    {key: 'public', label: 'Public', value: 'public'},
    {key: 'private', label: 'Private', value: 'private'}
  ]


  render() {
    const {
      value,
      onInputFocus,
      modifyInput,
      onBackdropPress,
      onToggle,
      type,
      toggleTyple,
      currentUserAuth,
    } = this.props;

    let options = [];
    let header = '';

    let textInputValue = value;

    // configure based on type
    if (type == 'priority') {
      header = 'Priority Level';
    } else if (type == 'type') {
      header = 'Post Type';
    } else if (type == 'comment') {
      header = 'Allow Comment';
      if (value == 1) {
        textInputValue = 'true';
      } else {
        textInputValue = 'false';
      }
    } else if (type == 'visibility') {
      header = 'Visibility'
    }

    // the current toggled type.  This is used to correctly show the selections
    if (toggleTyple == 'priority') {
      if (currentUserAuth) {
        const {rank} = currentUserAuth;
        options = this.priorityOptions.filter(option => {
          if (rank <= 1) {
            return true;
          } else if (rank == 2) {
            return option.value < 3;
          } else {
            return option.value < 2;
          }
        });
      }
    } else if (toggleTyple == 'type') {
      options = this.typeOptions;
    } else if (toggleTyple == 'comment') {
      options = this.commentOptions;
    } else if (toggleTyple == 'visibility'){
      options = this.viewOptions
    }

    // binary setup can be weird
    let display_text = textInputValue.toString();
    if (type == 'comment') {
      if (textInputValue == 'true') {
        display_text = 'Yes';
      } else {
        display_text = 'No';
      }
    } 
    

    const toggled = onToggle && toggleTyple == type;
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.header}>{header}</Text>
        <TextInput
          style={styles.textInputContainer}
          placeholder={header}
          value={display_text}
          onFocus={() => onInputFocus(type)}
        />
        <Modal
          isVisible={toggled}
          style={Platform.OS == 'ios' ? styles.Modal : null}
          onBackdropPress={onBackdropPress}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}>
          <Picker
            style={
              Platform.OS == 'ios' ? styles.Picker : {backgroundColor: 'white'}
            }
            selectedValue={textInputValue}
            onValueChange={v => modifyInput(v, toggleTyple)}>
            {options.map(option => {
              return (
                <Picker.Item
                  key={option.key}
                  label={option.label}
                  value={option.value}
                />
              );
            })}
          </Picker>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    width: '40%',
  },
  header: {
    width: '100%',
    height: 20,
    color: '#273c75',
    fontSize: 12,
    paddingLeft: 5,
  },
  textInputContainer: {
    width: '100%',
    height: 25,
    backgroundColor: 'white',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    color: 'black',
  },
  Modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  Picker: {
    width: 1000,
    height: 250,
    backgroundColor: 'white',
  },
});
