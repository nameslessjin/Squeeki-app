import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
} from 'react-native';
import {backgroundImagePicker, iconImagePicker} from '../../utils/imagePicker';

export default class GroupSettingModal extends React.Component {
  onPress = type => {
    const {onBackdropPress, onChangeMedia, isBackground} = this.props;
    if (isBackground) {
      backgroundImagePicker(onChangeMedia, type, onBackdropPress);
    } else {
      iconImagePicker(onChangeMedia, type, onBackdropPress);
    }
  };

  render() {
    const {modalVisible, onBackdropPress, theme} = this.props;
    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={() => onBackdropPress()}>
            <View style={[styles.centeredView]}>
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
                <View style={styles.underline} />
                <TouchableOpacity onPress={() => this.onPress('library')}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>
                      Select From Image Library
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.underline} />
                <TouchableOpacity onPress={() => onBackdropPress()}>
                  <View style={styles.button}>
                    <Text style={{color: 'red'}}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>
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
