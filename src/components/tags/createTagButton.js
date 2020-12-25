import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CreateTagButton extends React.Component{


    render(){
        const {onPress, create} = this.props
        return (
            <TouchableOpacity style={styles.container} onPress={onPress} >
                <MaterialIcons name="plus" size={35} color={ '#EA2027'} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '10%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})