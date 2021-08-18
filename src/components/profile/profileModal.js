import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import {iconImagePicker} from '../../utils/imagePicker';

const extractKey = ({id}) => id;

export default class ProfileModal extends React.Component {
  onPress = type => {
    const {onBackdropPress, onChangeMedia} = this.props;
    iconImagePicker(onChangeMedia, type, onBackdropPress);
  };

  iconCard = ({item}) => {
    const {onDefaultIconPress} = this.props;
    return (
      <TouchableOpacity onPress={() => onDefaultIconPress(item.url)}>
        <Image source={{uri: item.url}} style={styles.icon} />
      </TouchableOpacity>
    );
  };

  defaultIconsList = () => {
    return (
      <FlatList
        data={this.props.defaultIcons}
        numColumns={5}
        keyExtractor={extractKey}
        scrollEnabled={false}
        bounces={false}
        style={styles.iconContainerStructure}
        renderItem={this.iconCard}
      />
    );
  };

  render() {
    const {modalVisible, onBackdropPress, defaultIcons, theme} = this.props;
    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={() => onBackdropPress()}>
            <View style={[styles.centeredView]}>
              <View style={[styles.modalView, theme.backgroundColor, theme.shadowColor]}>
                {defaultIcons.length == 0 ? null : (
                  <View
                    style={[
                      styles.iconContainerStructure,
                      styles.iconContainerDetail,
                    ]}>
                    {this.defaultIconsList()}
                  </View>
                )}
                {defaultIcons.length == 0 ? null : (
                  <View style={[styles.underline, theme.underLineColor]} />
                )}
                <TouchableOpacity onPress={() => this.onPress('camera')}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Take Photo</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.borderColor]} />
                <TouchableOpacity onPress={() => this.onPress('library')}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Select From Image Library</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.borderColor]} />
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
    minHeight: 150,
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
});
