import React from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class visibilitySetting extends React.Component {
  render() {
    const {visibility, onVisibilitySwitchToggle, disabled} = this.props;

    return (
      <View
        style={styles.container}>
        <Text>Private Group</Text>

        <TouchableWithoutFeedback disabled={disabled} onPress={disabled ? null : onVisibilitySwitchToggle} >
            <MaterialIcons
              name={visibility== 'public' ? 'toggle-switch-off-outline' : 'toggle-switch'}
              size={45}
              color={visibility== 'public' ? 'grey' : 'green'}
            />
          </TouchableWithoutFeedback>
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
