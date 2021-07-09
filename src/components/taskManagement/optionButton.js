import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class OptionButton extends React.Component {
  render() {
    const {option, onPress, type} = this.props;

    let title = 'Pending';
    if (type == 'completed') {
      title = 'Completed';
    } else if (type == 'denied') {
      title = 'Denied';
    }

    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderBottomWidth: option == type ? StyleSheet.hairlineWidth : 0,
            borderBottomColor: option == type ? '#EA2027' : null,
          },
        ]}
        disabled={option == type}
        onPress={() => onPress(type)}>
        <Text
          style={{
            fontWeight: '600',
            color: option == type ? '#EA2027' : 'grey',
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: '100%',
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
