import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Platform,
} from 'react-native';
import {PostImagePicker, PostVideoPicker} from '../../utils/imagePicker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class PostSettingModal extends React.Component {
  state = {
    time: new Date(),
    process: 1,
  };

  onPress = type => {
    const {onBackdropPress, onChangeMedia} = this.props;
    PostImagePicker(onChangeMedia, type, onBackdropPress);
  };

  setTimeOnAndroid = (time, type) => {
    let newTime = this.state.time;
    if (type == 'date') {
      const day = time.getDate();
      const month = time.getMonth();
      const year = time.getFullYear();
      newTime.setFullYear(year);
      newTime.setMonth(month);
      newTime.setDate(day);
      this.setState({time: newTime, process: 2});
    }

    if (type == 'time') {
      const hours = time.getHours();
      const minutes = time.getMinutes();
      newTime.setHours(hours);
      newTime.setMinutes(minutes);
      this.setState({time: newTime, process: 3});
    }
  };

  render() {
    const {
      modalVisible,
      onBackdropPress,
      type,
      priority,
      priorityExpiration,
      taskExpiration,
      modifyInput,
      theme,
      eventStart,
      eventEnd,
    } = this.props;
    const {process} = this.state;

    let timeModal = null;

    let time = 0;

    switch (type) {
      case 'priorityExpiration':
        time = priorityExpiration;
        break;
      case 'taskExpiration':
        time = taskExpiration;
        break;
      case 'eventStart':
        time = eventStart;
        break;
      case 'eventEnd':
        time = eventEnd;
        break;
      default:
        break;
    }

    if (Platform.OS == 'ios') {
      timeModal = (
        <View
          style={[
            styles.modalView,
            {width: 210, height: 100},
            theme.backgroundColor,
            theme.borderColor,
          ]}>
          {type == 'priorityExpiration' ? (
            priority == 0 ? (
              <Text style={theme.textColor}>
                Please select a priority first
              </Text>
            ) : (
              <View
                style={[
                  styles.modalView,
                  {width: 210, height: 100},
                  theme.backgroundColor,
                  theme.shadowColor,
                ]}>
                <Text style={theme.textColor}>SELECT DATE</Text>
                <DateTimePicker
                  mode={'datetime'}
                  value={new Date(parseInt(time))}
                  minimumDate={new Date()}
                  display={'default'}
                  style={{width: 190, marginLeft: 20}}
                  onChange={(event, date) =>
                    modifyInput(date, 'priorityExpiration')
                  }
                />
              </View>
            )
          ) : (
            <View style={[styles.modalView, {width: 210, height: 100}]}>
              <Text>SELECT DATE</Text>
              <DateTimePicker
                mode={'datetime'}
                value={new Date(parseInt(time))}
                minimumDate={
                  type == 'eventEnd'
                    ? new Date(parseInt(eventStart))
                    : new Date()
                }
                display={'default'}
                style={{width: 190, marginLeft: 20}}
                onChange={(event, date) => modifyInput(date, type)}
              />
            </View>
          )}
        </View>
      );
    } else {
      if (type == 'priorityExpiration' && priority == 0) {
        timeModal = (
          <View style={[styles.centeredView]}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}>
              <TouchableWithoutFeedback onPress={() => onBackdropPress()}>
                <View style={[styles.centeredView]}>
                  <View
                    style={[
                      styles.modalView,
                      {width: 210, height: 100},
                      theme.shadowColor,
                      theme.backgroundColor,
                    ]}>
                    <Text style={theme.textColor}>
                      Please select a priority first
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        );
      } else {
        if (process == 1) {
          timeModal = (
            <DateTimePicker
              mode={'date'}
              value={new Date(parseInt(time))}
              minimumDate={
                type == 'eventEnd' ? new Date(parseInt(eventStart)) : new Date()
              }
              display={'default'}
              onChange={(event, date) => this.setTimeOnAndroid(date, 'date')}
            />
          );
        } else if (process == 2) {
          timeModal = (
            <DateTimePicker
              mode={'time'}
              value={new Date(parseInt(time))}
              minimumDate={
                type == 'eventEnd' ? new Date(parseInt(eventStart)) : new Date()
              }
              display={'default'}
              onChange={(event, date) => this.setTimeOnAndroid(date, 'time')}
            />
          );
        }
        if (process == 3) {
          modifyInput(this.state.time, type);
        }
      }
    }

    return (type == 'priorityExpiration' ||
      type == 'taskExpiration' ||
      type == 'eventStart' ||
      type == 'eventEnd') &&
      Platform.OS == 'android' ? (
      timeModal
    ) : (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={[styles.centeredView]}>
              {type == 'image' ? (
                <View
                  style={[
                    styles.modalView,
                    theme.backgroundColor,
                    theme.shadowColor,
                  ]}>
                  <TouchableOpacity onPress={() => this.onPress('camera')}>
                    <View style={styles.button}>
                      <Text style={theme.textColor}>Take Photo</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.underline, theme.borderColor]} />
                  <TouchableOpacity onPress={() => this.onPress('library')}>
                    <View style={styles.button}>
                      <Text style={theme.textColor}>
                        Select From Image Library
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.underline, theme.borderColor]} />
                  <TouchableOpacity onPress={() => onBackdropPress()}>
                    <View style={styles.button}>
                      <Text style={{color: 'red'}}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : type == 'priorityExpiration' ||
                type == 'taskExpiration' ||
                type == 'eventStart' ||
                type == 'eventEnd' ? (
                timeModal
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 150,
    width: 300,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  underline: {
    width: 300,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
});
