import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class addButton extends React.Component {
    render(){
        const {onPress} = this.props
        return (
            <TouchableOpacity
                style={styles.headerRightButton}
                onPress={onPress}
            >
                <MaterialIcons name="plus" size={30} color={ '#EA2027'}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 15,
        width: 35,
        height: 35
    }
})