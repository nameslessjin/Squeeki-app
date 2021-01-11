import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class RewardSettingInput extends React.Component {

  render() {
    const {type, value, onInputChange} = this.props;
    let title = 'Name';
    let display = <View />;
    if (type == 'content') {
      title = 'Content';
    } else if (type == 'chance') {
      title = 'Chance(%)';
    } else if (type == 'hide') {
      title = 'Hide Content';
    }

    if (type == 'hide') {
      display = (
        <View style={[styles.container, {justifyContent: 'space-between'}]}>
          <Text>{title}</Text>
          <TouchableWithoutFeedback
            onPress={() => onInputChange(type)}>
            <MaterialIcons
              name={value ? 'toggle-switch' : 'toggle-switch-off-outline'}
              size={45}
              color={value ? 'green' : 'grey'}
            />
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      display = (
        <View style={styles.container}>
          <Text>{title}</Text>
          <TextInput
            style={styles.textInputStyle}
            value={value.toString()}
            keyboardType={type == 'chance' ? 'numeric' : null}
            onChangeText={t => onInputChange(type, t)}
            maxLength={type == 'chance' ? 3 : 45}
            placeholder={type == 'chance' ? '1, 4, 10, 15, 30 or 40' : null}
          />
        </View>
      );
    }

    return display;
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    marginTop: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  textInputStyle: {
    width: '100%',
    marginLeft: 20,
    color: 'grey',
    height: 50,
  },
});
