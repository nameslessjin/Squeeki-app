import React from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ToggleSetting extends React.Component {
  render() {
    const {on, onToggle, disabled, type} = this.props;

    let title = 'All Notifications';

    if (type == 'notification_all') {
      title = 'All notifications';
    } else if (type == 'notification_group') {
      title = 'Group activity';
    } else if (type == 'notification_post_like') {
      title = 'When like your post';
    } else if (type == 'notification_post_comment') {
      title = 'When comment on your post';
    } else if (type == 'notification_post_mention') {
      title = 'When mentioned on a post';
    } else if (type == 'notification_comment_like') {
      title = 'When like your comment';
    } else if (type == 'notification_comment_reply') {
      title = 'When reply to your comment';
    } else if (type == 'notification_comment_mention') {
      title = 'When mentioned on a comment';
    } else if (type == 'notification_chat') {
      title = 'Chat activity';
    } else if (type == 'notification_chat_message') {
      title = 'When there is a new message in a chat';
    } else if (type == 'notification_chat_mention') {
      title = 'When mentioned on a chat';
    } else if (type == 'visibility_all'){
      title = 'All visibility'
    } else if (type == 'visibility_chat_search'){
      title = 'User can be searched for chat invitation'
    } else if (type == 'visibility_group_search'){
      title = 'User can be searched for group invitation'
    } else if (type == 'visibility_post_at'){
      title = '@ user in post allowed'
    } else if (type == 'visibility_chat_at'){
      title = '@ user in chat allowed'
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
