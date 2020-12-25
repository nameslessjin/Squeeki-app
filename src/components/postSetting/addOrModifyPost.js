import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export default class addOrModifyPost extends React.Component {

  render() {
      const {onPress, update, loading} = this.props
      const disabled = !(update && !loading)

    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={onPress}
        disabled={disabled}
        >
        <Text style={[styles.button, disabled ? {color: '#95a5a6'} : null ]}>Done</Text>
        {/* <MaterialIcons name="plus" size={30} /> */}
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
        alignItems: 'center'

    },
    button:{
      fontSize: 16
    }
})