import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LeaveButton extends React.Component {
  onPress = () => {
    const {auth, onPress} = this.props;
    const title = auth.rank <= 1 ? 'Disband the group' : 'Leave the group';
    const message =
      auth.rank != 1
        ? 'Are you sure you want to leave the group?'
        : 'Disband the group can force everyone to leave the group';
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => onPress(), style:'destructive'},
      ],
    );
  };

  render() {
    const {auth, onPress} = this.props;
    let text = 'Leave';
    if (auth.rank <= 1) {
      text = 'Disband';
    }
    const leaveButton = (
      <TouchableOpacity style={styles.leaveButton} onPress={this.onPress}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    );

    return leaveButton;
  }
}

const styles = StyleSheet.create({
  leaveButton: {
    backgroundColor: '#EA2027',
    marginLeft: 20,
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  settingButton: {
    marginLeft: 25,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Jellee-Roman',
    color: 'white',
  },
});
