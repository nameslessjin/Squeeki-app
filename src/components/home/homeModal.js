import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Platform,
  Linking,
} from 'react-native';

const appStoreLink = 'itms-apps://apps.apple.com/us/app/squeeki/id1529519910';

export default class HomeModal extends React.Component {
  state = {};

  directToStore = () => {
    const appStoreLink =
      Platform.OS == 'ios'
        ? 'itms-apps://apps.apple.com/us/app/squeeki/id1529519910'
        : 'market://details?id=com.squeeki';
    Linking.canOpenURL(appStoreLink).then(
      supported => {
        supported && Linking.openURL(appStoreLink);
      },
      err => console.log(err),
    );
  };

  render() {
    const {modalVisible, onBackdropPress, type} = this.props;

    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={[styles.centeredView]}>
              <View style={styles.modalView}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'grey'}}>
                  A New Version is available
                </Text>
                <TouchableOpacity onPress={this.directToStore}>
                  <View style={styles.button}>
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20,
                      }}>
                      Go to App Store
                    </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EA2027',
    padding: 10,
    borderRadius: 20,
  },
});
