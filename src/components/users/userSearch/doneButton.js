import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

export default class addButton extends React.Component {
  render() {
    const {onPress, disabled} = this.props;
    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[styles.text, {color: disabled ? '#95a5a6' : 'black'}]}>
          Done
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
  text: {
    fontSize: 16,
  },
});
