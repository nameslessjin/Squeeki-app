import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

export default class AdminSearchBar extends React.Component {
  render() {
    const {onInputChange, value, theme, type} = this.props;

    let placeHolder = 'Search user';
    if (type == 'user') {
      placeHolder = 'Search user';
    } else if (type == 'group') {
      placeHolder = 'Search group';
    } else if (type == 'post') {
      placeHolder = 'Search post';
    } else if (type == 'comment') {
      placeHolder = 'Search comment';
    }

    return (
      <View
        style={[styles.searchBar, theme.backgroundColor, theme.shadowColor]}>
        <TextInput
          style={[styles.textInput, theme.textColor]}
          placeholder={placeHolder}
          placeholderTextColor={'#95a5a6'}
          onChangeText={text => onInputChange('searchTerm', text)}
          value={value}
          maxLength={50}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    backgroundColor: 'white',
    width: '75%',
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
