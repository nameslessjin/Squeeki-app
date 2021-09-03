import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import {dateConversion} from '../../utils/time';

export default class ScanScreenModal extends React.Component {
  render() {
    const {
      modalVisible,
      onBackgroundPress,
      theme,
      data,
      prevRoute,
      onPress,
    } = this.props;

    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackgroundPress}>
            <View style={[styles.centeredView]}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalView,
                    theme.backgroundColor,
                    theme.shadowColor,
                  ]}>
                  {data ? (
                    data.message ? (
                      <View style={[styles.subContainer, {paddingVertical: 30}]}>
                        <Text style={theme.textColor}>{data.message}</Text>
                      </View>
                    ) : prevRoute == 'RewardManagement' ? (
                      <View style={[styles.subContainer]}>
                        <Text
                          style={[
                            theme.textColor,
                            styles.rewardText,
                            {fontSize: 20, fontWeight: 'bold'},
                          ]}>
                          {data.name}
                        </Text>
                        <Text style={[theme.textColor, styles.rewardText]}>
                          {data.pointCost
                            ? `Point Cost: ${data.pointCost}`
                            : `Chance: ${data.chance}`}
                        </Text>
                        <Text style={[theme.textColor, styles.rewardText]}>
                          On: {dateConversion(data.createdAt, 'reward')}
                        </Text>
                      </View>
                    ) : null
                  ) : (
                    <View style={{alignItems: 'center'}}>
                      <View style={styles.subContainer}>
                        <Text
                          style={[
                            theme.textColor,
                            {fontSize: 20, fontWeight: 'bold'},
                          ]}>
                          Loading
                        </Text>
                      </View>
                      <View style={[styles.subContainer, {height: 100}]}>
                        <ActivityIndicator
                          animating={true}
                          style={theme.textColor}
                          size={'large'}
                        />
                      </View>
                    </View>
                  )}

                  <View style={[styles.underline, theme.borderColor]} />
                  {data ? (
                    data.message ? (
                      <TouchableOpacity onPress={() => onBackgroundPress()}>
                        <View style={styles.buttonContainer}>
                          <Text style={{color: 'red'}}>Cancel</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={[
                          styles.buttonContainer,
                          {justifyContent: 'space-evenly'},
                        ]}>
                        <TouchableOpacity onPress={() => onBackgroundPress()}>
                          <View style={[styles.buttonContainer, {width: 150}]}>
                            <Text style={{color: 'red'}}>Cancel</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => onPress('redeem', data.id)}>
                          <View style={[styles.buttonContainer, {width: 150}]}>
                            <Text style={theme.textColor}>Redeem</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  ) : (
                    <TouchableOpacity onPress={() => onBackgroundPress()}>
                      <View style={styles.buttonContainer}>
                        <Text style={{color: 'red'}}>Cancel</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableWithoutFeedback>
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // minHeight: 150,
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
  buttonContainer: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 5,
  },
  iconContainerStructure: {
    minHeight: 70,
    width: 300,
  },
  iconContainerDetail: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
  },
  subContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  rewardText: {
    marginTop: 5,
  },
});
