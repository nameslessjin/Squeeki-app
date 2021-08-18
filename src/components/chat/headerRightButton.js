import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {singleDefaultIcon} from '../../utils/defaultIcon';

export default class HeaderRightButton extends React.Component {
  render() {
    const {onPress, type, disabled, icon_url, theme} = this.props;
    let icon = (
      <Text style={{color: disabled ? '#95a5a6' : theme.textColor.color, fontSize: 16}}>
        Done
      </Text>
    );
    if (type == 'create') {
      icon = <MaterialIcons name={'plus'} size={30} color={'#EA2027'} />;
    } else if (type == 'setting') {
      icon = <MaterialIcons name={'cog'} size={30} color={'#EA2027'} />;
    } else if (type == 'icon') {
      icon = (
        <Image
          source={icon_url ? {uri: icon_url} : singleDefaultIcon()}
          style={[styles.imageStyle, theme.backgroundColor]}
        />
      );
    }

    return (
      <TouchableOpacity
        style={
          type == 'create'
            ? styles.createButtonContainer
            : type == 'icon'
            ? styles.iconContainer
            : styles.container
        }
        onPress={onPress}
        disabled={disabled}>
        {icon}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  createButtonContainer: {
    width: 35,
    height: 35,
    marginRight: 5,
  },
  container: {
    width: 50,
    height: 50,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 35,
    height: 35,
    marginRight: 7,
  },
  imageStyle: {
    height: 35,
    aspectRatio: 1,
    borderRadius: 37,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
