import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class RightButton extends React.Component {
  render() {
    const {onPress, disabled} = this.props;
    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[styles.button, {color: disabled ? '#95a5a6' : '#3498db'}]}>
          Next
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  headerRightButton: {
    marginRight: 15,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 16,
  },
});
