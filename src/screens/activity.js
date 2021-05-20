import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

const extractKey = ({id}) => id;

export default class Activity extends React.Component {


    componentDidMount(){
        const {navigation} = this.props
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTitle: 'Activity'
        })
        
    }


    render(){
        return (
            <TouchableWithoutFeedback>
                <View>

                </View>
            </TouchableWithoutFeedback>
        )
    }

}