import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SettingEdition extends React.Component {
  render() {
    const {onPress, name} = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.subContainer}>
            <Text>{name}</Text>
            <MaterialIcons name={'chevron-right'} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 50,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  subContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
