import React from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ToggleSetting extends React.Component {
  render() {
    const {on, onToggle, disabled, type} = this.props;

    let title = 'All Notifications';

    if (type == 'all') {
      title = 'All Notifications';
    } else if (type == 'groups') {
      title = 'Group Activity';
    } else if (type == 'post_like') {
      title = 'Like On Your Post';
    } else if (type == 'post_comment') {
      title = 'Comment On Your Post';
    } else if (type == 'comment_like') {
      title = 'Like On Your Comment';
    } else if (type == 'comment_reply') {
      title = 'Reply On Your Comment';
    } else if (type == 'chats') {
      title = 'Chat Activity';
    }

    let icon = (
      <MaterialIcons
        name={on ? 'toggle-switch' : 'toggle-switch-off-outline'}
        size={45}
        color={on ? 'green' : 'grey'}
      />
    );

    return (
      <View style={styles.container}>
        <Text style={{color: disabled ? 'grey' : 'black'}}>{title}</Text>

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
