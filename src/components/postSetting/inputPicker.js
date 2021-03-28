import React from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-community/picker';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import InputPickerModal from './inputPickerModal';

export default class InputPicker extends React.Component {
  priorityOptions = [
    {id: '0', label: '0', value: 0},
    {id: '1', label: '1', value: 1},
    {id: '2', label: '2', value: 2},
    {id: '3', label: '3', value: 3},
  ];

  typeOptions = [
    {id: '0', label: 'General', value: 'general'},
    {id: '1', label: 'Event', value: 'event'},
    {id: '2', label: 'Task', value: 'task'},
  ];

  commentOptions = [
    {id: '0', label: 'Yes', value: 'true'},
    {id: '1', label: 'No', value: 'false'},
  ];

  viewOptions = [
    {id: '0', label: 'Public', value: 'public'},
    {id: '1', label: 'Private', value: 'private'},
  ];

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
      rank_setting,
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
      header = 'Visibility';
    }

    // the current toggled type.  This is used to correctly show the selections
    if (toggleTyple == 'priority') {
      if (currentUserAuth) {
        const {rank} = currentUserAuth;
        const {
          priority_1_rank_required,
          priority_2_rank_required,
          priority_3_rank_required,
        } = rank_setting;
        options = this.priorityOptions.filter(option => {
          if (option.value == 1) {
            if (rank <= priority_1_rank_required) {
              return true;
            }
            return false;
          } else if (option.value == 2) {
            if (rank <= priority_2_rank_required) {
              return true;
            }
            return false;
          } else if (option.value == 3) {
            if (rank <= priority_3_rank_required) {
              return true;
            }
            return false;
          }

          return true;
        });
      }
    } else if (toggleTyple == 'type') {
      options = this.typeOptions;
    } else if (toggleTyple == 'comment') {
      options = this.commentOptions;
    } else if (toggleTyple == 'visibility') {
      options = this.viewOptions;
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
        <TouchableWithoutFeedback onPress={() => onInputFocus(type)}>
          <View style={styles.textInputContainer}>
            <Text>{display_text}</Text>
          </View>
        </TouchableWithoutFeedback>
        <InputPickerModal
          modalVisible={toggled}
          onBackdropPress={onBackdropPress}
          options={options}
          type={toggleTyple}
          modifyInput={modifyInput}
        />
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
