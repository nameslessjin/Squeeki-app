import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';

export default class SearchTypeSwtich extends React.Component {
  render() {
    const {type, onInputChange} = this.props;
    return (
      <TouchableOpacity onPress={() => onInputChange('type', type)}>
        <View style={styles.container}>
          <Text style={styles.text}>{type.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    paddingHorizontal: 5,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12
  },
});
