import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'


export default class NominationButon extends React.Component{

    render(){

        const { onPress, chosenUser, nomination, disabled } = this.props

        let text = 'Nominee'

        if (chosenUser.id != null && nomination.id != null){
            text = 'Nominate ' + chosenUser.displayName + ' for ' + nomination.name
        }

        if (chosenUser.id == null && nomination.id == null && disabled){
            text = 'No nomination'
        }

        return(
            <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled}>
                <Text>{text}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        borderWidth: 2,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'grey',
        marginTop: 20,
        borderRadius: 10,
    }
})