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
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('screen');

const extractKey = ({id}) => id;
export default class RewardModal extends React.Component {
  onInputChange = ({value, label}) => {
    const {onInputChange, onBackdropPress, modalType} = this.props;
    onInputChange(modalType, {id: value.toString(), label});
    onBackdropPress();
  };

  renderItem = i => {
    const {value, label} = i.item;
    return (
      <TouchableOpacity onPress={() => this.onInputChange({value, label})}>
        <View style={[styles.options]}>
          <Text style={{color: '#3498db'}}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      modalVisible,
      onBackdropPress,
      modalType,
      rewardList,
      listNum,
    } = this.props;

    const listNo = rewardList.map(r => {
      return {
        id: r.id,
        label: r.listName,
        value: r.id,
      };
    });

    let listChance = [];
    let currentList = rewardList[0];
    switch (listNum) {
      case '1':
        currentList = rewardList[0];
        break;
      case '2':
        currentList = rewardList[1];
        break;
      case '3':
        currentList = rewardList[2];
        break;
      default:
        currentList = rewardList[0];
        break;
    }

    listChance[0] = currentList.chance1;
    listChance[1] = currentList.chance2;
    listChance[2] = currentList.chance3;
    listChance[3] = currentList.chance4;
    listChance[4] = currentList.chance5;

    listChance = listChance.map((c, i) => {
      return {
        id: c,
        label: `${c}%`,
        value: i + 1,
      };
    });

    let name = modalType == 'listNum' ? 'List' : 'Chance';

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
                      data={modalType == 'listNum' ? listNo : listChance}
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
    borderBottomColor: 'grey',
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
