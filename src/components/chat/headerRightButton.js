import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HeaderRightButton extends React.Component {
  render() {
    const {onPress, type, disabled} = this.props;

    let icon = <Text style={{color: disabled ? '#95a5a6' : null}} >Done</Text>
    if (type == 'create'){
      icon = <MaterialIcons name={'plus'} size={30} color={ '#EA2027'}/>
    } else if (type == 'setting'){
      icon = <MaterialIcons name={'cog'} size={30} color={ '#EA2027'}/>
    }

    return (
      <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled} >
        {icon}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    // marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },
});
