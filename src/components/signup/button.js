import React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, Text} from 'react-native';


export default class SignUpButton extends React.Component {


    render() {
        const {onPress} = this.props
        return (
            <TouchableOpacity style={styles.signUpButton} onPress={onPress}>
                <Text style={styles.signUnButtonText}>Sign Up</Text>
            </TouchableOpacity>
        )
    }

}

const styles = StyleSheet.create({
    signUpButton:{
        height: '5%',
        width: '30%',
        backgroundColor: '#EA2027',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    signUnButtonText:{
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Jellee-Roman',
    },
})