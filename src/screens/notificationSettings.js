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

export default class NotificationSettings extends React.Component {

    state = {
        options: [
          {id: 'All'},
          {id: 'Groups'},
          {id: 'My Posts'},
          {id: 'My Comments'},
          {id: 'Chats'},
          {id: 'Invite'}
        ],
      };

    componentDidMount(){
        const {navigation} = this.props
        navigation.setOptions({
            headerBackTitleVisible: false,
            headerTitle: 'Notifications'
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