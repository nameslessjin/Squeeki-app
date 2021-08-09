import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import ImageModal from 'react-native-image-modal';
import {PostImagePicker} from '../../utils/imagePicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('screen');

const extractKey = ({id}) => id;
export default class RewardModal extends React.Component {
  state = {
    time: new Date(),
    process: 1,
  };

  onInputChange = ({value, label}) => {
    const {onInputChange, onBackdropPress, modalType} = this.props;

    onInputChange({id: value.toString(), label}, modalType);
    onBackdropPress();
  };

  onPress = type => {
    const {onBackdropPress, onInputChange} = this.props;
    PostImagePicker(onInputChange, type, onBackdropPress);
    onBackdropPress();
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

  renderItem = i => {
    const {value, label} = i.item;
    const {modalType} = this.props;
    return (
      <TouchableOpacity onPress={() => this.onInputChange({value, label})}>
        <View style={[styles.options]}>
          <Text style={{color: '#3498db'}}>
            {label}
            {modalType == 'chance' ? '%' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      modalVisible,
      onBackdropPress,
      modalType,
      rewardList,
      listId,
      expiration,
      onInputChange,
      result,
      isGift,
      systemRewardSetting,
    } = this.props;
    const {process} = this.state;

    let listNo = [];
    let listChance = [];

    if (modalType == 'listId' || modalType == 'chance') {
      if (isGift) {
        // the system reward settings is directly fron the backend and only managable from there
        if (systemRewardSetting) {
          listNo = systemRewardSetting.list;
          listChance = systemRewardSetting.chance.filter(
            c => c.listId == listId,
          );
        }
      } else {
        listNo = rewardList
          .map(r => {
            return {
              id: r.id,
              label: r.listName,
              value: r.id,
            };
          })
          .filter(r => r.id != '0');

        let currentList = rewardList[0];
        switch (listId) {
          case '1':
            currentList = rewardList[0];
            break;
          case '2':
            currentList = rewardList[1];
            break;
          case '3':
            currentList = rewardList[2];
            break;
          default:
            currentList = rewardList[0];
            break;
        }

        listChance[0] = currentList.chance1;
        listChance[1] = currentList.chance2;
        listChance[2] = currentList.chance3;
        listChance[3] = currentList.chance4;
        listChance[4] = currentList.chance5;

        listChance = listChance.map((c, i) => {
          return {
            id: c,
            label: c,
            value: i + 1,
          };
        });
      }
    }

    let name = 'List';
    if (modalType == 'listId') {
      name = 'List';
    } else if (modalType == 'chance') {
      name = 'Chance';
    } else if (modalType == 'result') {
      name = 'Result';
    }

    // for expiration time
    let timeModal = null;

    // create an reward with expiration up to 1 year
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    if (Platform.OS == 'ios') {
      timeModal = (
        <View style={[styles.modalView, {width: 210, height: 100}]}>
          <Text>SELECT DATE</Text>
          <DateTimePicker
            mode={'datetime'}
            value={new Date(parseInt(expiration))}
            minimumDate={new Date()}
            maximumDate={maxDate}
            display={'default'}
            style={{width: 190, marginLeft: 20}}
            onChange={(event, date) => onInputChange(date, modalType)}
          />
        </View>
      );
    } else {
      if (process == 1) {
        timeModal = (
          <DateTimePicker
            mode={'date'}
            value={new Date(parseInt(expiration))}
            minimumDate={new Date()}
            maximumDate={maxDate}
            display={'default'}
            onChange={(event, date) => this.setTimeOnAndroid(date, 'date')}
          />
        );
      } else if (process == 2) {
        timeModal = (
          <DateTimePicker
            mode={'time'}
            value={new Date(parseInt(expiration))}
            minimumDate={new Date()}
            display={'default'}
            onChange={(event, date) => this.setTimeOnAndroid(date, 'time')}
          />
        );
      }
      if (process == 3) {
        onInputChange(this.state.time, modalType);
        this.setState({time: new Date()});
        onBackdropPress();
        return null;
      }
    }

    return modalType == 'expiration' && Platform.OS == 'android' ? (
      timeModal
    ) : (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={styles.centeredView}>
              {modalType == 'image' ? (
                <View style={[styles.imageModalView]}>
                  <TouchableOpacity onPress={() => this.onPress('camera')}>
                    <View style={styles.button}>
                      <Text>Take Photo</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.underline} />
                  <TouchableOpacity onPress={() => this.onPress('library')}>
                    <View style={styles.button}>
                      <Text>Select From Image Library</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.underline} />
                  <TouchableOpacity onPress={() => onBackdropPress()}>
                    <View style={styles.button}>
                      <Text style={{color: 'red'}}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : modalType == 'expiration' ? (
                timeModal
              ) : modalType == 'result' ? (
                <TouchableWithoutFeedback>
                  <View style={styles.resultContainer}>
                    <View
                      style={[
                        styles.modalView,
                        {
                          width: '100%',
                          height: 200,
                          margin: 0,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          padding: 5,
                          paddingHorizontal: 8,
                        },
                      ]}>
                      <View style={styles.resultTitle}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>
                          Your reward
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: 140,
                          flexDirection: 'row',
                        }}>
                        <View style={styles.resultImageContainer}>
                          <View
                            style={{
                              height: 130,
                              width: '95%',
                              alignItems: 'center',
                            }}>
                            {result.image ? (
                              <ImageModal
                                style={{
                                  width: width * 0.9 * 0.55 * 0.95 * 0.95,
                                  height: 125,
                                }}
                                resizeMode="cover"
                                modalImageResizeMode={'contain'}
                                source={{
                                  uri: result.image,
                                }}
                              />
                            ) : (
                              <MaterialIcons
                                name={'treasure-chest'}
                                size={120}
                                color={'#EA2027'}
                              />
                            )}
                          </View>
                          <Text>
                            {result.chanceDisplay
                              ? `Chance: ${result.chanceDisplay}%`
                              : result.pointCost
                              ? `Cost: ${result.pointCost}pts`
                              : null}
                          </Text>
                        </View>
                        <View style={styles.resultContent}>
                          <Text style={{fontWeight: 'bold'}}>
                            {result.name}
                          </Text>
                          <ScrollView
                            style={{
                              height: 10,
                              width: '100%',
                            }}>
                            <Text>{result.description}</Text>
                          </ScrollView>
                          <View style={{width: '100%', height: 10}} />
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity onPress={onBackdropPress}>
                      <View style={styles.closeButton}>
                        <Text style={{color: 'white'}}>Close</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback>
                  <KeyboardAvoidingView style={styles.view}>
                    <View style={styles.display}>
                      <View style={styles.header}>
                        <Text>{name}</Text>
                      </View>
                      <FlatList
                        data={modalType == 'listId' ? listNo : listChance}
                        renderItem={this.renderItem}
                        alwaysBounceVertical={false}
                        alwaysBounceHorizontal={false}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={extractKey}
                      />
                    </View>
                  </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
              )}
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
  view: {
    backgroundColor: 'white',
    width: '50%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 100,
  },
  underline: {
    width: 300,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  imageModalView: {
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
  button: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  options: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
    height: 45,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  display: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  resultContainer: {
    width: width * 0.9,
    height: 250,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  resultTitle: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    height: 160,
    width: '45%',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  resultImageContainer: {
    height: 160,
    width: '55%',
    alignItems: 'center',
  },
  closeButton: {
    width: 65,
    height: 35,
    backgroundColor: 'grey',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
  },
});
