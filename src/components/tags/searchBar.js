import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

export default class TagSearchBar extends React.Component {
  render() {
    const {onChange, value, PrevRoute, theme} = this.props;

    return (
      <View style={[styles.searchBar, theme.backgroundColor, theme.shadowColor]}>
        <TextInput
          style={[styles.textInput, theme.textColor]}
          placeholder={PrevRoute == 'GroupSetting' ? 'search tags or create new tag with #' : 'search tags'}
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
    height: 100,
    textAlign: 'center',
    color: 'black',
  },
});
