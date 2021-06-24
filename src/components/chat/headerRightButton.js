import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {singleDefaultIcon} from '../../utils/defaultIcon';

export default class HeaderRightButton extends React.Component {
  render() {
    const {onPress, type, disabled, icon_url} = this.props;

    let icon = <Text style={{color: disabled ? '#95a5a6' : null}}>Done</Text>;
    if (type == 'create') {
      icon = <MaterialIcons name={'plus'} size={30} color={'#EA2027'} />;
    } else if (type == 'setting') {
      icon = <MaterialIcons name={'cog'} size={30} color={'#EA2027'} />;
    } else if (type == 'icon') {

      icon = (
        <Image
          source={icon_url ? {uri: icon_url} : singleDefaultIcon()}
          style={styles.imageStyle}
        />
      );
    }

    return (
      <TouchableOpacity
        style={[styles.container, {marginRight: type == 'create' ? 0 : 5}]}
        onPress={onPress}
        disabled={disabled}>
        {icon}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    height: 30,
    aspectRatio: 1,
    borderRadius: 37,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
