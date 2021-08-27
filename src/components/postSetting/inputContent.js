import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import {onUrlPress, onLinkPhoneLongPress} from '../chat/render';

export default class InputContent extends React.Component {
  render() {
    const {
      content,
      modifyInput,
      onKeyboardInputFocus,
      type,
      disabled,
      theme,
    } = this.props;
    return (
      <View style={styles.container}>
        {content.length == 0 ? null : (
          <Text style={[styles.contentPlaceHolderStyle, theme.titleColor]}>
            {type == 'post'
              ? "What's in your mind..."
              : type == 'verify'
              ? 'Show that you completed the task...'
              : type == 'reward'
              ? 'Description'
              : ''}
          </Text>
        )}

        {type == 'reward' ? (
          <View
            style={[
              styles.contentStyle,
              content.length == 0 ? {marginTop: 15} : null,
              theme.textColor,
              theme.underLineColor,
            ]}>
            <ParsedText
              style={theme.textColor}
              parse={[
                {
                  type: 'url',
                  style: {color: '#1e90ff'},
                  onPress: onUrlPress,
                  onLongPress: url =>
                    onLinkPhoneLongPress({type: 'url', content: url}),
                },
              ]}
              childrenProps={{allowFontScaling: false}}>
              {content}
            </ParsedText>
          </View>
        ) : (
          <TextInput
            style={[
              styles.contentStyle,
              content.length == 0 ? {marginTop: 15} : null,
              theme.textColor,
              theme.underLineColor,
            ]}
            multiline={true}
            maxLength={1000}
            placeholder={
              type == 'post'
                ? "What's in your mind..."
                : type == 'verify'
                ? 'Show that you completed the task...'
                : 'Description'
            }
            placeholderTextColor={'#7f8fa6'}
            value={content}
            onChangeText={v => (modifyInput ? modifyInput(v, 'content') : null)}
            onFocus={() =>
              onKeyboardInputFocus ? onKeyboardInputFocus() : null
            }
            editable={!disabled}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    maxHeight: 180,
  },
  contentPlaceHolderStyle: {
    width: '90%',
    height: 20,
    marginTop: 15,
    color: '#273c75',
    fontSize: 12,
    paddingLeft: 5,
  },
  contentStyle: {
    width: '90%',
    maxHeight: 160,
    minHeight: 40,
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    color: 'black',
  },
});
