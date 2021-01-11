import React from 'react'
import { StyleSheet, View, Text, KeyboardAvoidingViewBase, ActivityIndicator } from 'react-native'
import {connect} from 'react-redux'

class RewardHistory extends React.Component{

    state = {
        loading: false
    }

    render() {
        const {loading} = this.state
        return(
            <View>
                <Text>
                    Setting
                </Text>
                <ActivityIndicator animating={loading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({

})

export default connect(null, null)(RewardHistory)