import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class GroupCreationButton extends React.Component {
  render() {
    const {createButton, buttonText} = styles;
    const {onCreateGroup, createGroupButtonActive} = this.props;
    return (
      <TouchableOpacity
        style={[createButton, createGroupButtonActive ? null : {backgroundColor: 'grey'}]}
        onPress={onCreateGroup}
        disabled={!createGroupButtonActive}>
        <Text style={buttonText}>Create</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  createButton: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    backgroundColor: '#EA2027',
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Jellee-Roman',
    fontSize: 20,
  },
});
