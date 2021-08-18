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
} from 'react-native';

const {width} = Dimensions.get('window');

const extractKey = ({id}) => id;
export default class InputPickerModal extends React.Component {

  onBackdropPress = () => {
    const {onBackdropPress} = this.props;
    onBackdropPress();
  };

  modifyInput = value => {
    const {modifyInput, type, onBackdropPress} = this.props;
    modifyInput(value, type);
    onBackdropPress();
  };

  renderItem = i => {
    const {value, label} = i.item;
    const {theme} = this.props
    return (
      <TouchableOpacity onPress={() => this.modifyInput(value)}>
        <View
          style={[
            styles.options,
            theme.borderColor
          ]}>
          <Text style={{color: '#3498db'}}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {modalVisible, onBackdropPress, options, type, theme} = this.props;
    let name
    if (type == 'priority'){
        name = 'Priority Level'
    } else if (type == 'type'){
        name = 'Post Type'
    } else if (type == 'comment'){
        name = 'Allow Comment'
    } else if (type == 'visibility'){
        name = ' Visibility'
    }

    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView style={[styles.view, theme.backgroundColor, theme.shadowColor]}>
                  <View style={styles.display}>
                    <View style={[styles.header]}>
                      <Text style={theme.textColor}>{name}</Text>
                    </View>
                    <FlatList
                      data={options}
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
    borderColor: 'grey'
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
