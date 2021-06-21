import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class ReplyIndicator extends React.Component {
  render() {
    const {
      isReply,
      inputHeight,
      onCancelReply,
      replyType,
      replyTo,
    } = this.props;

    const username = replyTo.length <= 10 ? replyTo : `${replyTo.substr(0,7)}...`

    return isReply ? (
      <View
        style={[
          styles.replyIndicatorContainer,
          {height: Math.max(40, inputHeight)},
        ]}>
        <TouchableOpacity onPress={onCancelReply}>
          <View style={styles.replyButton}>
            <Text style={styles.replyText}>
              {replyType == 'reply' ? 'REPLY:' : username}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  replyIndicatorContainer: {
    justifyContent: 'center',
    width: 50,
    alignItems: 'center',
    marginRight: 3,
  },
  replyButton: {
    backgroundColor: '#e84118',
    width: 50,
    padding: 3,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  replyText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
});
