import React from 'react';
import {StyleSheet, TextInput, Text, View} from 'react-native';

export default class InputText extends React.Component {
  render() {
    const {modifyInput, value, editable} = this.props;

    
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Group Username</Text>
        <TextInput
          style={styles.textInputContainer}
          value={value}
          onChangeText={v => modifyInput('group_username', v)}
          maxLength={50}
          editable={editable}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    minHeight: 25,
  },
});
