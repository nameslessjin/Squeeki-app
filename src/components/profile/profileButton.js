import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class ProfileButton extends React.Component {

  render() {
      const {onPress, update, loading} = this.props
      const disabled = !(update && !loading)
    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={onPress}
        disabled={disabled}
        >
        <Text style={[styles.button, disabled ? null : {color: '#95a5a6'}]}>Done</Text>

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 5,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'

    },
    button:{
      fontSize: 16
    }
})