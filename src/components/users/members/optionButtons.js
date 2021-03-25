import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

export default class OptionButtons extends React.Component {
  render() {
    const {allowToDeleteMember, allowToMakeOwner, optionAlert} = this.props;

    const removeButton = allowToDeleteMember ? (
      <TouchableOpacity onPress={() => optionAlert('remove')}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    ) : null;

    const makeOwnerButton = allowToMakeOwner ? (
        <TouchableOpacity onPress={() => optionAlert('ownership')}>
            <Text style={styles.makeOwnerButton}>Make Owner</Text>
        </TouchableOpacity>
    ) : null

    return (
      <View style={styles.container}>
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
        width: '100%'
    },
    removeButton: {
        color: 'red'
    },
    makeOwnerButton: {
        color: '#007aff',
        marginBottom: 10
    }
});
