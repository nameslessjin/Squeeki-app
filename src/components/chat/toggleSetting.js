import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ToggleSetting extends React.Component {
  render() {
    const {on, onToggle, disabled, type, theme} = this.props;

    const title =
      type == 'invite'
        ? 'Allow users to invite other users'
        : 'Allow users to modify chat';

    let icon = (
      <MaterialIcons
        name={on ? 'toggle-switch' : 'toggle-switch-off-outline'}
        size={45}
        color={on ? 'green' : 'grey'}
      />
    );

    return (
      <View style={[styles.container, theme.backgroundColor]}>
        <Text style={{color: disabled ? 'grey' : theme.textColor.color}}>{title}</Text>

        <TouchableWithoutFeedback
          disabled={disabled}
          onPress={disabled ? null : () => onToggle(type)}>
          {icon}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
});
