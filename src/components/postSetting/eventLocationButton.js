import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class EventLocationButton extends React.Component {
  render() {
    const {location, theme, onPress} = this.props;

    let text = location ? location.description : 'No location';

    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={theme.textColor}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderWidth: 2,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    marginTop: 20,
    borderRadius: 10,
  },
});
