import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HeaderRightButton extends React.Component {
  render() {
    const {onPress, type, disabled} = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled} >
        {type == 'create' ? (
          <MaterialIcons name={'plus'} size={30} color={ '#EA2027'}/>
        ) : (
          <Text style={{color: disabled ? '#95a5a6' : null}} >Done</Text>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
