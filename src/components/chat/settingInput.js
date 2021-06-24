import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import {singleDefaultIcon} from '../../utils/defaultIcon';

export default class RewardSettingInput extends React.Component {

  render() {
    const {type, value, onInputChange, disabled} = this.props;

    let title = 'Name';
    if (type == 'type') {
      title = 'Type';
    } else if (type == 'rank') {
      title = 'Rank Required';
    } else if (type == 'delete') {
      title = 'Delete';
    } else if (type == 'leave') {
      title = 'Leave';
    }

    const icon = (
      <TouchableOpacity
        style={styles.imageStyle}
        disabled={disabled}
        onPress={() => onInputChange('icon')}>
        <Image
          source={
            value && type == 'icon' ? {uri: value.uri} : singleDefaultIcon()
          }
          style={styles.imageStyle}
        />
      </TouchableOpacity>
    );

    const button = (
      <TouchableOpacity
        onPress={() => onInputChange(type)}
        style={styles.button}>
        <Text style={styles.leaveChatText}> {title} </Text>
      </TouchableOpacity>
    );

    return type == 'icon' ? (
      icon
    ) : type == 'leave' || type == 'delete' ? (
      button
    ) : (
      <View style={styles.container}>
        <Text style={{color: 'grey'}}>{title}</Text>
        {type == 'type' ? (
          <TouchableOpacity
            onPress={() => onInputChange(type)}
            disabled={disabled}>
            <View style={{marginLeft: 20}}>
              <Text style={{color: 'grey'}}>{value}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={styles.textInputStyle}
            value={value ? value : ''}
            onChangeText={v => onInputChange(type, v)}
            keyboardType={type == 'rank' ? 'number-pad' : 'default'}
            maxlength={type == 'rank' ? 1 : 50}
            placeholder={type == 'name' ? 'Chat Name' : ''}
            placeholderTextColor={'#bdc3c7'}
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
    height: 45,
    marginTop: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  textInputStyle: {
    width: '100%',
    marginLeft: 10,
    color: 'black',
    height: 50,
  },
  imageStyle: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  leaveChatText: {
    color: 'red',
  },
  button: {
    marginTop: 20,
  },
});
