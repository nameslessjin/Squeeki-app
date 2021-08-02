import React from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'

export default class modifyButton extends React.Component{

    render(){
        const {onPress, update, loading} = this.props
        const disabled = !(update && !loading)

        return (
            <TouchableOpacity
            style={styles.headerRightButton}
            onPress={onPress}
            disabled={disabled}
            >
            <Text style={[styles.button, disabled ? {color: '#95a5a6'} : null ]}>Done</Text>
          </TouchableOpacity>
        )
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
    button:{
      fontSize: 16
    }
})