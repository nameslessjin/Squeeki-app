import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class ProfileButton extends React.Component {
  render() {
    const {onPress, update, loading, theme} = this.props;
    const disabled = !(!loading && update);
    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={onPress}
        disabled={disabled}>
        <Text
          style={[
            styles.button,
            {color: disabled ? '#95a5a6' : theme.textColor.color},
          ]}>
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
  button: {
    fontSize: 16,
  },
});
