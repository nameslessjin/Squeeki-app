import React from 'react';
import {StyleSheet, TextInput, Text, View, Keyboard} from 'react-native';
import InputPicker from './inputPicker';

export default class InputRankTitle extends React.Component {
  render() {
    const {
      auth,
      onRankInputFocus,
      onTitleInputFocus,
      modifyInput,
      allowToModifyMember,
      userAuth,
      rankName,
      theme
    } = this.props;
    const {rank, title} = auth;
    return (
      <View style={styles.container}>
        <InputPicker
          rank={rank}
          onFocus={onRankInputFocus}
          allowToModifyMember={allowToModifyMember}
          userAuth={userAuth}
          rankName={rankName}
          theme={theme}
        />

        <View style={styles.inputContainer}>
          <Text style={[styles.header, theme.titleColor]}>Title</Text>
          <TextInput
            style={[styles.textInputContainer, theme.textColor, theme.underLineColor]}
            value={title}
            onChangeText={v => modifyInput('title', v)}
            onFocus={onTitleInputFocus}
            maxLength={30}
            editable={allowToModifyMember}
          />
          {/* <View style={styles.titleContainerPadding}/> */}
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
    // backgroundColor: 'white',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    maxHeight: 60,
  },
  titleContainerPadding: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
});
