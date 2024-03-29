import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  FlatList,
} from 'react-native';

const extractKey = ({id}) => id;
export default class ChatMemberModal extends React.Component {
  state = {
    is_timeout: false,
  };

  timeout_options = [
    {id: '1', name: '10 minutes', value: 10 * 60},
    {id: '2', name: '30 minutes', value: 30 * 60},
    {id: '3', name: '1 hour', value: 60 * 60},
    {id: '4', name: '3 hours', value: 3 * 60 * 60},
    {id: '5', name: '1 day', value: 24 * 60 * 60},
    {id: '6', name: '1 week', value: 7 * 24 * 60 * 60},
    {id: '7', name: 'Permanent', value: 100 * 365 * 24 * 60 * 60},
    {id: '8', name: 'Undone', value: 0},
  ];

  renderOptions = i => {
    const {index, item} = i;
    const {name, value} = item;
    const {onOptionSelect, theme} = this.props;
    const lastId = this.timeout_options.length - 1;
    return (
      <View style={[styles.options]}>
        <TouchableOpacity onPress={() => onOptionSelect('timeout', value)}>
          <View style={[styles.options]}>
            <Text style={{color: '#3498db'}}>{name}</Text>
          </View>
        </TouchableOpacity>
        {lastId != index ? <View style={styles.underline} /> : null}
      </View>
    );
  };

  render() {
    const {
      modalVisible,
      onBackdropPress,
      func_disabled,
      onOptionSelect,
      is_owner,
      can_remove_user,
      theme,
    } = this.props;
    const {is_timeout} = this.state;

    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={() => onBackdropPress()}>
            <View style={[styles.centeredView]}>
              {is_timeout ? (
                <View
                  style={[
                    styles.view,
                    theme.backgroundColor,
                    theme.shadowColor,
                  ]}>
                  <FlatList
                    data={this.timeout_options}
                    renderItem={this.renderOptions}
                    alwaysBounceVertical={false}
                    alwaysBounceHorizontal={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={extractKey}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.modalView,
                    theme.backgroundColor,
                    theme.shadowColor,
                  ]}>
                  <TouchableOpacity onPress={() => onOptionSelect('dm')}>
                    <View style={styles.button}>
                      <Text style={theme.textColor}>Direct Message</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={[styles.underline, theme.borderColor]} />

                  {func_disabled ? null : (
                    <TouchableOpacity
                      onPress={() => this.setState({is_timeout: true})}>
                      <View style={styles.button}>
                        <Text style={theme.textColor}>Timeout</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {func_disabled ? null : <View style={[styles.underline, theme.borderColor]} />}

                  {is_owner ? (
                    <TouchableOpacity
                      onPress={() => onOptionSelect('ownership')}>
                      <View style={styles.button}>
                        <Text style={theme.textColor}>Make Owner</Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}

                  {is_owner ? <View style={[styles.underline, theme.borderColor]} /> : null}

                  {can_remove_user ? (
                    <TouchableOpacity onPress={() => onOptionSelect('delete')}>
                      <View style={styles.button}>
                        <Text style={theme.textColor}>Remove</Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}

                  {can_remove_user ? <View style={[styles.underline, theme.borderColor]} /> : null}

                  <TouchableOpacity onPress={() => onBackdropPress()}>
                    <View style={styles.button}>
                      <Text style={{color: 'red'}}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
    elevation: 10,
    // height: 150,
    width: 300,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  underline: {
    width: 300,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
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
    width: 300,
    height: 45,
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
    elevation: 10,
    marginBottom: 100,
  },
});
