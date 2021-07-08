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

export default class RewardSettingInput extends React.Component {
  render() {
    const {type, value, onInputChange, onPress} = this.props;
    let title = 'Name';
    let display = <View />;
    if (type == 'content') {
      title = 'Content';
    } else if (type == 'chance') {
      title = 'Chance(0.1 - 100%)';
    } else if (type == 'hide') {
      title = 'Hide Content';
    } else if (type == 'count') {
      title = 'Count';
    } else if (type == 'listNum') {
      title = 'List No.';
    } else if (type == 'separateContent') {
      title = 'Separate Content For Each Reward';
    } else if (type == 'contentList') {
      title = 'Content List';
    }

    const numericKeyboard =
      type == 'chance' || type == 'count' || type == 'listNum' ? true : false;

    if (type == 'hide' || type == 'separateContent') {
      display = (
        <View style={[styles.container, {justifyContent: 'space-between'}]}>
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

          <TouchableWithoutFeedback onPress={() => onInputChange(type)}>
            <MaterialIcons name={'chevron-right'} size={30} color={'black'} />
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      display = (
        <View style={[styles.container, {height: type == 'content' ? 80 : 45}]}>
          <Text style={{color: 'grey'}}>{title}</Text>
          {type == 'listNum' ? (
            <Text style={{marginLeft: 10, width: '100%'}}>
              {value.toString()}
            </Text>
          ) : (
            <TextInput
              style={[
                styles.textInputStyle,
                {
                  width: type == 'chance' ? '70%' : '81%',
                  height: type == 'content' ? 80 : 45,
                },
              ]}
              value={value.toString()}
              keyboardType={numericKeyboard ? 'numeric' : 'default'}
              onChangeText={t => onInputChange(type, t)}
              maxLength={
                type == 'chance'
                  ? 3
                  : type == 'count'
                  ? 4
                  : type == 'listNum'
                  ? 2
                  : type == 'content'
                  ? 200
                  : 40
              }
              multiline={type == 'content'}
              placeholderTextColor={'#7f8fa6'}
            />
          )}
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={() => onPress(type)}>
        {display}
      </TouchableWithoutFeedback>
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
