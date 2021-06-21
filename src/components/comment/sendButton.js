import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class SendButton extends React.Component {
  render() {
    const {sent, disabled, onSend, inputHeight} = this.props;

    return (
      <View
        style={[
          styles.sendButtonContainer,
          {height: Math.max(40, inputHeight)},
        ]}>
        {sent ? (
          <ActivityIndicator animating={true} color={'grey'} />
        ) : (
          <TouchableOpacity
            disabled={disabled}
            onPress={onSend}
            style={{marginBottom: 5}}>
            <MaterialIcons
              name={
                disabled
                  ? 'arrow-up-drop-circle-outline'
                  : 'arrow-up-drop-circle'
              }
              size={30}
              color={disabled ? '#718093' : '#EA2027'}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sendButtonContainer: {
    width: 35,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
