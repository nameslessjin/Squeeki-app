import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default class GroupHeaderRight extends React.Component {
  render() {
    const {onPress, update, loading} = this.props;
    const disabled = !(update && !loading);
    return loading ? (
      <ActivityIndicator
        animating={true}
        style={styles.headerRightButton}
        color={'grey'}
      />
    ) : (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={onPress}
        disabled={disabled}>
        <Text style={[styles.text, {color: disabled ? '#95a5a6' : 'black'}]}>
          Done
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  headerRightButton: {
    width: 50,
    height: 50,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
