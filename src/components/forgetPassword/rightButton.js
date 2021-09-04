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
        <Text style={[styles.button, {color: disabled ? '#95a5a6' : 'black'}]}>
          Next
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  headerRightButton: {
    width: 50,
    height: 50,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 16,
  },
});
