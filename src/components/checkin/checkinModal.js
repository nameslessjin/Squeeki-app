import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

export default class CheckinModal extends React.Component {
  state = {
    onSubmit: false,
    password: '',
  };

  onBackdropPress = () => {
    const {onBackdropPress} = this.props;
    this.setState({password: '', onSubmit: false});
    onBackdropPress();
  };

  onSubmit = async () => {
    const {password} = this.state;
    const {onSubmit, checkin_id} = this.props;

    this.setState({onSubmit: true});
    await onSubmit({checkin_id: checkin_id, password: password});
    this.onBackdropPress();
  };

  onInputChange = value => {
    this.setState({password: value.trim()});
  };

  render() {
    const {modalVisible, onBackdropPress, theme} = this.props;
    const {onSubmit, password} = this.state;

    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView
                  style={[styles.view, theme.backgroundColor]}>
                  <View style={styles.header}>
                    <Text
                      style={[
                        {fontSize: 18, fontWeight: 'bold'},
                        theme.textColor,
                      ]}>
                      Password
                    </Text>
                  </View>
                  <View style={styles.textInput}>
                    <TextInput
                      style={[{width: '100%', height: '100%'}, theme.textColor]}
                      maxLength={30}
                      value={password}
                      onChangeText={t => this.onInputChange(t)}
                      textAlign={'center'}
                    />
                  </View>
                  <View style={styles.footer}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          borderRightWidth: StyleSheet.hairlineWidth,
                        },
                      ]}
                      disabled={password.length == 0 || onSubmit}
                      onPress={this.onSubmit}>
                      <Text
                        style={{
                          fontSize: 15,
                          color:
                            password.length == 0 ? '#7f8fa6' : theme.textColor.color,
                        }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={onBackdropPress}>
                      <Text style={{color: 'red'}}>Cancel</Text>
                    </TouchableOpacity>
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
    width: '95%',
    height: 100,
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
  header: {
    height: 35,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    height: 30,
    width: '100%',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    height: 35,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
