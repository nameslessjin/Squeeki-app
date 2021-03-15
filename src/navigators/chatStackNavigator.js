import {createStackNavigator} from '@react-navigation/stack';
import React from 'react'
// import Chats from '../screens/chats';
import ChatSetting from '../screens/chatSetting';
import Chat from '../screens/chat';

const Stack = createStackNavigator();

export default class ChatStackNavigator extends React.Component {

    componentDidMount() {
        const {navigation} = this.props
        navigation.setOptions({
            headerShown: false
        })
    }

    render() {
        return (
            <Stack.Navigator initialRouteName={"Chat"}>
              <Stack.Screen name="ChatSetting" component={ChatSetting} />
              <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        )
    }
}