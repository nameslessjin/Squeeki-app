import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ToggleSetting extends React.Component {
  render() {
    const {on, onToggle, disabled, loading, type, theme} = this.props;

    const title = type == 'visibility' ? 'Private Group' : 'Request to join';

    let icon = <View />;

    if (type == 'visibility') {
      icon = (
        <MaterialIcons
          name={on ? 'toggle-switch-off-outline' : 'toggle-switch'}
          size={45}
          color={on ? 'grey' : 'green'}
        />
      );
    } else if (type == 'request_to_join') {
      icon = (
        <MaterialIcons
          name={on ? 'toggle-switch' : 'toggle-switch-off-outline'}
          size={45}
          color={on ? 'green' : 'grey'}
        />
      );
    }

    return (
      <View style={[styles.container, theme.underLineColor]}>
        <Text style={{color: disabled ? 'grey' : theme.textColor.color}}>{title}</Text>
        {loading ? (
          <ActivityIndicator loading={loading} color={'grey'}/>
        ) : (
          <TouchableWithoutFeedback
            disabled={disabled}
            onPress={disabled ? null : () => onToggle(type)}>
            {icon}
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
});
