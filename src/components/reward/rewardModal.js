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
  FlatList
} from 'react-native';


const extractKey = ({id}) => id;
export default class RewardModal extends React.Component {
  state = {};

  onBackdropPress = () => {
    const {onBackdropPress} = this.props;
    onBackdropPress();
  };

  renderItem = i => {
    const {name, rate} = i.item;
    return (
      <View style={[styles.reward, {marginTop: name == 'Bronze' ? 30 : 0}]}>
        <Text style={{width: 100}}>{name}:</Text>
        <Text>{rate}</Text>
      </View>
    );
  };

  render() {
    const {modalVisible, onBackdropPress} = this.props;
    const reward_rate = [
      {id: '1', name: 'Bronze', rate: '40%'},
      {id: '2', name: 'Silver', rate: '30%'},
      {id: '3', name: 'Gold', rate: '15%'},
      {id: '4', name: 'Emerald', rate: '10%'},
      {id: '5', name: 'Sapphire', rate: '4%'},
      {id: '6', name: 'Diamond', rate: '1%'},
    ];

    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView style={styles.view}>
                  <View style={styles.reward_display}>
                    <FlatList
                      data={reward_rate}
                      renderItem={this.renderItem}
                      alwaysBounceVertical={false}
                      alwaysBounceHorizontal={false}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={extractKey}
                    />
                  </View>
                  <View style={styles.footer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={onBackdropPress}>
                      <Text style={{color: 'grey'}}>Close</Text>
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
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 150,
    marginVertical: 10,
  },
  reward_display: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
