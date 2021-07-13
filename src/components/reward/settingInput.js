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
    onInputChange(type, output);
  };

  render() {
    const {type, value, onInputChange, onPress} = this.props;
    let title = 'Name';
    let display = <View />;
    if (type == 'content') {
      title = 'Content';
    } else if (type == 'chance') {
      title = 'Chance';
    } else if (type == 'hide') {
      title = 'Hide Content';
    } else if (type == 'count') {
      title = 'Count';
    } else if (type == 'listNum') {
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
    }

    const numericKeyboard =
      type == 'chance1' ||
      type == 'chance2' ||
      type == 'chance3' ||
      type == 'chance4' ||
      type == 'chance5' ||
      type == 'count'
        ? true
        : false;

    if (type == 'hide' || type == 'separateContent') {
      display = (
        <View
          style={[
            styles.container,
            {justifyContent: 'space-between', alignItems: 'center'},
          ]}>
          <Text style={{color: 'grey'}}>{title}</Text>

          <TouchableWithoutFeedback onPress={() => onInputChange(type)}>
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
        <View style={[styles.container, {height: type == 'content' ? 80 : 45}]}>
          <Text style={{color: 'grey'}}>{title}</Text>

          {type == 'listNum' || type == 'chance' ? (
            <Text style={{marginLeft: 10, width: '100%'}}>
              {value.toString()}
            </Text>
          ) : (
            <TextInput
              style={[
                styles.textInputStyle,
                {
                  width: '81%',
                  height: type == 'content' ? null : 45,
                },
              ]}
              value={value.toString()}
              keyboardType={numericKeyboard ? 'numeric' : 'default'}
              onChangeText={t => this.onChangeText(t)}
              maxLength={
                type == 'chance' ||
                type == 'chance1' ||
                type == 'chance2' ||
                type == 'chance3' ||
                type == 'chance4' ||
                type == 'chance5'
                  ? 4
                  : type == 'count'
                  ? 3
                  : type == 'listNum'
                  ? 2
                  : type == 'content'
                  ? 255
                  : 30
              }
              multiline={type == 'content'}
              placeholderTextColor={'#7f8fa6'}
            />
          )}
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
    width: '100%',
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
