import React from 'react';
import PropTypes from 'prop-types';
import {Linking, StyleSheet, View, Text} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

const WWW_URL_PATTERN = /^www\./i;
const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];

export default class MessageText extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      !!this.props.currentMessage &&
      !!nextProps.currentMessage &&
      this.props.currentMessage.text !== nextProps.currentMessage.text
    );
  }

  onUrlPress = url => {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          console.error('No handler for URL:', url);
        } else {
          Linking.openURL(url);
        }
      });
    }
  };


  render() {
    const {currentMessage, position} = this.props;
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

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginVertical: 5,
  marginHorizontal: 10,
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    lineHeight: 20,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  right: {
    color: 'white',
    ...textStyle,
  },
  link: {
    textDecorationLine: 'underline',
  },
  left: {
    color: 'black',
    ...textStyle,
  },
});
