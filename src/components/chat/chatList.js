import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

const extractKey = ({id}) => id;

export default class ChatList extends React.Component {

    renderItem = ({item}) => {
        return <View/>
    }


    render(){
        const {onRefresh, refresh, onEndReached, chatlist} = this.props


        return (
            <FlatList
                style={styles.container}
                data = {chatlist}
                keyExtractor={extractKey}
                alwaysBounceHorizontal = {false}
                renderItem={this.renderItem}
                
            />
        )

    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },

})