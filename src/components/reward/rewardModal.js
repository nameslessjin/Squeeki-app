import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('screen')

const extractKey = ({id}) => id;
export default class RewardModal extends React.Component {

  onInputChange = value => {
    const {onInputChange, onBackdropPress} = this.props
    onInputChange('listNum', value)
    onBackdropPress()
  }

  renderItem = i => {
    const {value, label} = i.item;
    return (
      <TouchableOpacity onPress={() => this.onInputChange(value)}>
        <View
          style={[
            styles.options,
          ]}>
          <Text style={{color: '#3498db'}}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {modalVisible, onBackdropPress} = this.props;

    const listNo = [
      {id: '1', label: '1', value: '1'},
      {id: '2', label: '2', value: '2'},
      {id: '3', label: '3', value: '3'},
    ];
    let name = 'List No.'

    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView style={styles.view}>
                  <View style={styles.display}>
                    <View style={styles.header}>
                      <Text>{name}</Text>
                    </View>
                    <FlatList
                      data={listNo}
                      renderItem={this.renderItem}
                      alwaysBounceVertical={false}
                      alwaysBounceHorizontal={false}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={extractKey}
                    />
                  </View>
                </KeyboardAvoidingView>
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
  options: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.45,
    height: 45,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey'
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
});
