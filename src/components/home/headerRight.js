import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HomeHeaderRight extends React.Component {



  render() {
      const {onPress} = this.props
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.headerRightButton}>
        <MaterialIcons name="plus" size={30} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
    headerRightButton: {
        marginRight: 15,
        width: 35,
        height: 35
    }
})