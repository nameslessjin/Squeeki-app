import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

export default class RewardSearchBar extends React.Component {
  render() {
    const {onChange, value} = this.props;

    return (
      <View style={styles.searchBar}>
        <TextInput
          style={styles.textInput}
          placeholder={'search reward'}
          placeholderTextColor={'#95a5a6'}
          onChangeText={text => onChange(text)}
          value={value}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    backgroundColor: 'white',
    width: '80%',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 5,
    shadowRadius: 2,
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    height: 50,
    color: 'black',
    textAlign: 'center',
  },
});