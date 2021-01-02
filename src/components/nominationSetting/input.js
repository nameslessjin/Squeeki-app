import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Modal from 'react-native-modal';

export default class Input extends React.Component {
  options = [
    // {key: '0', label: 'Once', value: 0},
    {key: '1', label: 'Once Every Week', value: 7},
    // {key: '2', label: 'Once Every Two Weeks', value: 14},
    // {key: '3', label: 'Once Every Month', value: 30},
  ];

  render() {
    let {
      type,
      onInputChange,
      value,
      moddleToggled,
      onBackdropPress,
      backdrop,
    } = this.props;

    let title = 'Nomination Name';
    let placeholder = 'Best of the week (at least 6 chars)';
    let selectedValue = value;
    if (type == 'point') {
      title = 'Reward Points';
      placeholder = '1000';
    } else if (type == 'period') {
      title = 'Period';
      placeholder = 'Once Every Week';

      if (value == 7) {
        value = 'Once Every Week';
      } else if (value == 14) {
        value = 'Once Every Two Weeks';
      } else if (value == 30) {
        value = 'Once Every Month';
      } else if (value == 0) {
        value = 'Once';
      }
    }

    const disabled = type == 'period' ? false : true;

    return (
      <View style={styles.container}>
        <Text>{title}</Text>
        <TextInput
          style={styles.textInputStyle}
          value={value}
          placeholder={placeholder}
          onChangeText={t => onInputChange(type, t)}
          onFocus={!disabled ? moddleToggled : null}
        />

        {!disabled ? (
          <Modal
            isVisible={backdrop}
            style={Platform.OS == 'ios' ? styles.Modal : null}
            onBackdropPress={onBackdropPress}
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}>
            <Picker
              style={
                Platform.OS == 'ios'
                  ? styles.Picker
                  : {backgroundColor: 'white'}
              }
              selectedValue={selectedValue}
              onValueChange={v => onInputChange('period', v)}>
              {this.options.map(option => {
                return (
                  <Picker.Item
                    key={option.key}
                    label={option.label}
                    value={option.value}
                  />
                );
              })}
            </Picker>
          </Modal>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
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
    height: 50
  },
  Modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  Picker: {
    width: 1000,
    height: 250,
    backgroundColor: 'white',
  },
});
