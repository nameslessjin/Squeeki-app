import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class addButton extends React.Component {
  render() {
    const {onPress, onJoinRequestPress} = this.props;

    // when is there new people
    // <MaterialIcons name="account-multiple" size={30} color={'#EA2027'} />

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={onJoinRequestPress}>
          <View style={[styles.marginRight]}>
            <MaterialIcons name="account-multiple-outline" size={30} color={'#EA2027'} />
            {/* <Text style={{fontSize: 10}} >+3</Text> */}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerRightButton} onPress={onPress}>
          <MaterialIcons name="plus" size={30} color={'#EA2027'} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerRightButton: {
    marginRight: 15,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  request: {
    marginRight: 5,
    width: 50,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
