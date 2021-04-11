import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const extractKey = ({id}) => id.toString();
export default class newChatModal extends React.Component {
  options = [
    {id: 0, name: 'Start A Chatroom', icon: 'account-multiple-plus', type: 'chatroom'},
    {id: 1, name: 'Direct Message', icon: 'message-text', type: 'DM'},
  ];

  onPress = type => {
    const {navigateToOptions, onBackdropPress} = this.props;
    onBackdropPress();
    navigateToOptions(type)
  };

  renderOptions = i => {
    const {index, item} = i;
    const {name, icon, onPress, type} = item;
    return (
      <View style={[styles.options]}>
        <TouchableOpacity onPress={() => this.onPress(type)}>
          <View
            style={{
              height: '100%',
              width: '100%',
              flexDirection: 'row',
            }}>
            <MaterialIcons name={icon} size={35} />
            <View style={[styles.underline, styles.modalTextView]}>
              <Text style={styles.modalText}>{name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {modalVisible, onBackdropPress} = this.props;

    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={[styles.centeredView]}>
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <View style={[styles.modalHeader, styles.underline]}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>
                      Start
                    </Text>
                  </View>

                  <FlatList
                    data={this.options}
                    keyExtractor={extractKey}
                    renderItem={this.renderOptions}
                    scrollEnabled={false}
                  />
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    paddingBottom: 50,
  },
  modalTextView: {
    marginLeft: 5,
    height: 40,
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 14,
  },
  modalHeader: {
    height: 60,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underline: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: 'silver',
  },
  button: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  options: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
    // backgroundColor: 'grey'
  },
  view: {
    backgroundColor: 'white',
    width: 300,
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
});
