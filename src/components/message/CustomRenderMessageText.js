import React from 'react';
import {Linking, StyleSheet, View, Text} from 'react-native';

const WWW_URL_PATTERN = /^www\./i;

export default class MessageText extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      !!this.props.currentMessage &&
      !!nextProps.currentMessage &&
      this.props.currentMessage.text !== nextProps.currentMessage.text
    );
  }

  render() {
    const {currentMessage} = this.props;
    const current_user = this.props.user;
    const message_owner = currentMessage.user;
    const is_self = current_user._id == message_owner._id;
    const {text} = currentMessage;
    return (
      <View>
        <Text style={[styles.textStyle, {color: is_self ? 'white' : 'black'}]}>
          {text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
});
