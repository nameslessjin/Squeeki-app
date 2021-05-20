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

export default class VisibilitySettings extends React.Component {


    componentDidMount(){
        const {navigation} = this.props
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTitle: 'Visibility'
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