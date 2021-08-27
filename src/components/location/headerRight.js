import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class LocationHeaderRight extends React.Component {
  render() {
    const {onPress, theme} = this.props;
    return (
      <TouchableOpacity style={styles.headerRightButton} onPress={onPress}>
        <Text style={[styles.text, theme.textColor]}>SET NULL</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  headerRightButton: {
    // width: 50,
    height: 50,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
