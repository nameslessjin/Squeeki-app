import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

export default class OptionButtons extends React.Component {
  render() {
    const {allowToDeleteMember, allowToMakeOwner, onButtonPress, isSelf} = this.props;

    const removeButton = allowToDeleteMember ? (
      <TouchableOpacity onPress={() => onButtonPress('remove')}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    ) : null;

    const makeOwnerButton = allowToMakeOwner ? (
      <TouchableOpacity onPress={() => onButtonPress('ownership')}>
        <Text style={styles.makeOwnerButton}>Make Owner</Text>
      </TouchableOpacity>
    ) : null;

    const directMessageButton = !isSelf ? (
      <TouchableOpacity onPress={() => onButtonPress('dm')} >
        <Text style={styles.directMessageButton}>Direct Message</Text>
      </TouchableOpacity>
    ) : null;

    return (
      <View style={styles.container}>
        {directMessageButton}
        {makeOwnerButton}
        {removeButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  directMessageButton: {
    marginBottom: 10,
    color: '#007aff',
  },
  removeButton: {
    color: 'red',
  },
  makeOwnerButton: {
    color: '#d35400',
    marginBottom: 10,
  },
});
