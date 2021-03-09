import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class GroupHeaderRight extends React.Component {

  render() {

      const {onPress, update, loading} = this.props
      const disabled = !(update && !loading)
    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={onPress}
        disabled={disabled}
        >
        <Text style={[styles.text, disabled ? {color: '#95a5a6'} : null]} >Done</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 5,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
    }
})