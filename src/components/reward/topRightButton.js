import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class RewardTopRightButton extends React.Component {
  render() {
    const {type, onPress, disabled} = this.props;
    let button = <MaterialIcons name="plus" size={30} color={'#EA2027'} />
    if (type == 'history'){
      button = <Text style={{color: '#EA2027'}}>History</Text>
    } else if (type == 'done'){
      button = <Text style={{ fontSize: 16, color: disabled ? '#95a5a6' : 'black'}}>Done</Text>
    }

    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {button}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
