import React from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-community/picker';
import {StyleSheet, TextInput, Text, View} from 'react-native';
import InputPicker from './inputPicker';

export default class InputPriority extends React.Component {
  render() {
    const {
      priority,
      onInputFocus,
      priorityDuration,
      modifyInput,
      onBackdropPress,
      onToggle,
      toggleTyple,
      onKeyboardInputFocus,
      currentUserAuth,
      rank_setting
    } = this.props;

    return (
      <View style={styles.container}>
        <InputPicker
          value={priority}
          onInputFocus={onInputFocus}
          modifyInput={modifyInput}
          onBackdropPress={onBackdropPress}
          onToggle={onToggle}
          type={'priority'}
          toggleTyple={toggleTyple}
          currentUserAuth={currentUserAuth}
          rank_setting={rank_setting}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.header}>Priority Duration (days)</Text>
          <TextInput
            keyboardType={'numeric'}
            style={styles.textInputContainer}
            value={priorityDuration.toString()}
            onChangeText={v => modifyInput(v, 'priorityDuration')}
            onFocus={onKeyboardInputFocus}
            editable={priority != 0}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
    color: 'black'
  },
  Modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  priorityPicker: {
    width: 1000,
    height: 250,
    backgroundColor: 'white',
  },
});
