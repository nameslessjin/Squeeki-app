import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HeaderRightButton extends React.Component {
  render() {
    const {onPress, type, disabled, icon_url} = this.props;

    let icon = <Text style={{color: disabled ? '#95a5a6' : null}}>Done</Text>;
    if (type == 'create') {
      icon = <MaterialIcons name={'plus'} size={30} color={'#EA2027'} />;
    } else if (type == 'setting') {
      icon = <MaterialIcons name={'cog'} size={30} color={'#EA2027'} />;
    } else if (type == 'icon') {
      const random = Math.floor(Math.random() * 5);
      const icon_options = [
        'emoticon-cool-outline',
        'emoticon-poop',
        'emoticon-kiss-outline',
        'emoticon-wink-outline',
        'emoticon-tongue-outline',
      ];

      const icon_option = icon_options[random];
      icon =
        icon_url == null ? (
          <MaterialIcons name={icon_option} size={30} />
        ) : (
          <Image source={{uri: icon_url}} style={styles.imageStyle} />
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
    // marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow'
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
