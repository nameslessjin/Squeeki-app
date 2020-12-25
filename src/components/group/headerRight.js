import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HomeHeaderLeft extends React.Component {



  render() {
      const {onPress} = this.props
    return (
      <TouchableOpacity
        style={styles.headerLeftButton}
        onPress={onPress}>
        <MaterialIcons name="menu" size={30} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    headerLeftButton: {
        marginRight: 20,
        width: 30,
        height: 30
    }
})