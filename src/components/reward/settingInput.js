import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import validator from 'validator';
import {dateConversion} from '../../utils/time';

export default class RewardSettingInput extends React.Component {
  onChangeText = text => {
    const {onInputChange, type} = this.props;
    let output = text;

    if (type.substr(0, 6) == 'chance') {
      if (validator.isFloat(text)) {
        if (text.lastIndexOf('.') != -1) {
          if (text.split('.')[1].length >= 2) {
            output = parseFloat(text)
              .toFixed(1)
              .toString();
          }
        }
      }
    }
    onInputChange(output, type);
  };

  render() {
    const {type, value, onInputChange, onPress, pointCost} = this.props;
    let title = 'Name';
    let display = <View />;
    if (type == 'description') {
      title = 'Description';
    } else if (type == 'chance') {
      title = 'Chance';
    } else if (type == 'count') {
      title = 'Count';
    } else if (type == 'listId') {
      title = 'List';
    } else if (type == 'separateContent') {
      title = 'Separate Content For Each Reward';
    } else if (type == 'contentList') {
      title = 'Content List';
    } else if (type == 'listName') {
      title = 'List Name';
    } else if (type == 'chance1') {
      title = 'Chance 1';
    } else if (type == 'chance2') {
      title = 'Chance 2';
    } else if (type == 'chance3') {
      title = 'Chance 3';
    } else if (type == 'chance4') {
      title = 'Chance 4';
    } else if (type == 'chance5') {
      title = 'Chance 5';
    } else if (type == 'chance1Name') {
      title = 'Chance 1 Name';
    } else if (type == 'chance2Name') {
      title = 'Chance 2 Name';
    } else if (type == 'chance3Name') {
      title = 'Chance 3 Name';
    } else if (type == 'chance4Name') {
      title = 'Chance 4 Name';
    } else if (type == 'chance5Name') {
      title = 'Chance 5 Name';
    } else if (type == 'redeemable') {
      title = 'Redeem Reward With Points';
    } else if (type == 'point') {
      title = 'Required Points';
    } else if (type == 'expiration') {
      title = 'Expiration';
    } else if (type == 'hasExpiration') {
      title = 'Has Expiration Date';
    } else if (type == 'pointCost') {
      title = 'Point Cost';
    }

    const numericKeyboard =
      type == 'point' ||
      type == 'chance1' ||
      type == 'chance2' ||
      type == 'chance3' ||
      type == 'chance4' ||
      type == 'chance5' ||
      type == 'count' ||
      type == 'pointCost'
        ? true
        : false;

    if (
      type == 'separateContent' ||
      type == 'redeemable' ||
      type == 'hasExpiration'
    ) {
      display = (
        <View
          style={[
            styles.container,
            {justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <Text style={{color: 'grey'}}>{title}</Text>

          <TouchableWithoutFeedback onPress={() => onInputChange(null, type)}>
            <MaterialIcons
              name={value ? 'toggle-switch' : 'toggle-switch-off-outline'}
              size={45}
              color={value ? 'green' : 'grey'}
            />
          </TouchableWithoutFeedback>
        </View>
      );
    } else if (type == 'contentList') {
      display = (
        <View style={[styles.container, {justifyContent: 'space-between'}]}>
          <Text style={{color: 'grey'}}>{title}</Text>

          <MaterialIcons name={'chevron-right'} size={30} color={'black'} />
        </View>
      );
    } else {
      display = (
        <View
          style={[styles.container, {height: type == 'description' ? 80 : 45}]}>
          <Text style={{color: 'grey'}}>{title}</Text>

          {type == 'listId' || type == 'chance' || type == 'expiration' ? (
            <Text
              style={{
                marginLeft: 10,
                width: type == 'chance' ? '75%' : '100%',
              }}>
              {type == 'expiration'
                ? value
                  ? dateConversion(value, 'expiration')
                  : 'Permanent'
                : value.toString()}
            </Text>
          ) : (
            <TextInput
              style={[
                styles.textInputStyle,
                {
                  height: type == 'description' ? null : 45,
                },
              ]}
              value={value.toString()}
              keyboardType={numericKeyboard ? 'numeric' : 'default'}
              onChangeText={t => this.onChangeText(t)}
              maxLength={
                type == 'chance1' ||
                type == 'chance2' ||
                type == 'chance3' ||
                type == 'chance4' ||
                type == 'chance5' ||
                type == 'pointCost'
                  ? 4
                  : type == 'count'
                  ? 3
                  : type == 'listId'
                  ? 2
                  : type == 'description'
                  ? 255
                  : type == 'point'
                  ? 6
                  : 30
              }
              multiline={type == 'description'}
              placeholderTextColor={'#7f8fa6'}
            />
          )}

          {type == 'chance' ||
          type == 'chance1' ||
          type == 'chance2' ||
          type == 'chance3' ||
          type == 'chance4' ||
          type == 'chance5' ? (
            <Text>%</Text>
          ) : null}
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => (onPress ? onPress(type) : null)}>
        {display}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  textInputStyle: {
    width: '75%',
    marginLeft: 10,
    color: 'black',
    height: 45,
  },
  question_mark: {
    width: 20,
    height: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question_mark_container: {
    width: '4%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
