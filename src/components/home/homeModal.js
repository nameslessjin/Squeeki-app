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
    const {modalVisible, onBackdropPress, type, theme} = this.props;

    let message = 'A New Version is available'
    if (type == 'update'){
      message = 'A New Version is available'
    } else if (type == 'error'){
      message = 'An error has occurred, please visit us on twitter for more information'
    } else if (type == 'account'){
      message = 'This account is currently suspended, please contact us for more information'
    }
 
    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={[styles.centeredView]}>
              <View
                style={[
                  styles.modalView,
                  theme.backgroundColor,
                  theme.shadowColor,
                ]}>
                <Text
                  style={[{fontSize: 18, fontWeight: 'bold'}, theme.textColor]}>
                  {message}
                </Text>
                {type == 'update' ? (
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
                ) : null}
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
    padding: 10
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
