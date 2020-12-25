import React from 'react'
import {StyleSheet, TouchableOpacity, Text} from 'react-native'

export default class addButton extends React.Component {

    render(){
        const {onPress, disabled} = this.props
        return (
            <TouchableOpacity
            style={styles.headerRightButton}
            onPress={onPress}
            disabled={disabled}
            >
            <Text style={[styles.text, disabled ? {color: '#95a5a6'} : null]} >Done</Text>
          </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 15,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
    }
})