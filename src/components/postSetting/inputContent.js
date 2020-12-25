import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export default class InputContent extends React.Component {
  render() {
    const {content, modifyInput, onKeyboardInputFocus} = this.props;
    return (
      <View style={styles.container}>
        {content.length == 0 ? null : (
          <Text style={styles.contentPlaceHolderStyle}>
            What's in your mind...
          </Text>
        )}
        <TextInput
          style={[
            styles.contentStyle,
            content.length == 0 ? {marginTop: 15} : null,
          ]}
          multiline={true}
          maxLength={250}
          placeholder={"What's in your mind..."}
          value={content}
          onChangeText={v => modifyInput(v, 'content')}
          onFocus={onKeyboardInputFocus}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
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
  },
});
