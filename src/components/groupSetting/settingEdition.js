import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SettingEdition extends React.Component {
  render() {
    const {onPress, name, disabled, theme} = this.props;

    return (
      <View style={[styles.container, theme.underLineColor]}>
        <TouchableOpacity onPress={onPress} disabled={disabled}>
          <View style={styles.subContainer}>
            <Text style={{color: disabled ? 'grey' : theme.textColor.color}}>{name}</Text>
            <MaterialIcons
              name={'chevron-right'}
              size={25}
              color={disabled ? 'silver' : theme.iconColor.color}
            />
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
