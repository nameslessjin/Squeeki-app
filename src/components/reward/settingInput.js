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
    const {type, value, onInputChange, onQuestionMarkPress} = this.props;
    let title = 'Name';
    let display = <View />;
    if (type == 'content') {
      title = 'Content';
    } else if (type == 'chance') {
      title = 'Chance(%)';
    } else if (type == 'hide') {
      title = 'Hide Content';
    }

    const question_mark = (
      <View
        style={styles.question_mark_container}>
        <TouchableOpacity onPress={onQuestionMarkPress}>
          <View
            style={styles.question_mark}>
            <MaterialIcons name={'help'} size={15} color={'white'} />
          </View>
        </TouchableOpacity>
      </View>
    );

    if (type == 'hide') {
      display = (
        <View style={[styles.container, {justifyContent: 'space-between'}]}>
          <Text>{title}</Text>
          <TouchableWithoutFeedback onPress={() => onInputChange(type)}>
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
        <View style={[styles.container, {height: type=='content' ? 80 : 45}]}>
          <Text>{title}</Text>
          <TextInput
            style={[
              styles.textInputStyle,
              {width: type == 'chance' ? '70%' : '81%', height: type=='content' ? 55 : 45},
            ]}
            value={value.toString()}
            keyboardType={type == 'chance' ? 'numeric' : null}
            onChangeText={t => onInputChange(type, t)}
            maxLength={type == 'chance' ? 3 : ( type == 'content' ? 100 : 40)}
            multiline={type == 'content'}

            placeholder={type == 'chance' ? '1, 4, 10, 15, 30 or 40' : null}
          />
          {type == 'chance' ? question_mark : null}
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
    marginLeft: 10,
    color: 'grey',
    height: 50,
  },
  question_mark: {
    width: 20,
    height: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question_mark_container:{
    width: '4%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
