import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HomeHeaderLeft extends React.Component {



  render() {
      const {onPress, theme} = this.props
    return (
      <TouchableOpacity
        style={[styles.headerButton]}
        onPress={onPress}>
        <MaterialIcons name="menu" size={30} color={theme.textColor.color}/>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    headerButton: {
        marginRight: 5,
        width: 35,
        height: 35
    }
})