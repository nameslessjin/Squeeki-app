import React from 'react';
import {StyleSheet, TextInput, Text, View, Keyboard} from 'react-native';
import InputPicker from './inputPicker';

export default class InputRankTitle extends React.Component {
  render() {
    const {
      auth,
      onRankInputFocus,
      onTitleInputFocus,
      onBackdropPress,
      toggled,
      modifyInput,
      allowToModifyMember,
      userAuth
    } = this.props;
    const {rank, title} = auth;
    return (
      <View style={styles.container}>
        <InputPicker
          rank={rank}
          onFocus={onRankInputFocus}
          onBackdropPress={onBackdropPress}
          toggled={toggled}
          modifyInput={modifyInput}
          allowToModifyMember={allowToModifyMember}
          userAuth={userAuth}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.header}>Title</Text>
          <TextInput
            style={styles.textInputContainer}
            value={title}
            onChangeText={v => modifyInput('title', v)}
            onFocus={onTitleInputFocus}
            maxLength={30}
            editable={allowToModifyMember}
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
    backgroundColor: 'white',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    maxHeight: 60,
    minHeight: 25
  },
});
