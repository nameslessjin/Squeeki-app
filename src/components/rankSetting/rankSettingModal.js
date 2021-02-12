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

const {width} = Dimensions.get('window');

const extractKey = ({id}) => id;
export default class RankSettingModal extends React.Component {
  state = {};

  onBackdropPress = () => {
    const {onBackdropPress} = this.props;
    onBackdropPress();
  };

  onRankChange = value => {
    const {onRankChange, type, onBackdropPress} = this.props;
    onRankChange(type, value);
    onBackdropPress();
  };

  renderItem = i => {
    const {name} = i.item;
    return (
      <TouchableOpacity onPress={() => this.onRankChange(name)}>
        <View
          style={[
            styles.rank,
            {marginBottom: name == 7 ? 20 : 0},
          ]}>
          <Text>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {modalVisible, onBackdropPress} = this.props;
    const ranks = [
      {id: '1', name: 1},
      {id: '2', name: 2},
      {id: '3', name: 3},
      {id: '4', name: 4},
      {id: '5', name: 5},
      {id: '6', name: 6},
      {id: '7', name: 7},
    ];

    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={onBackdropPress}>
            <View style={styles.centeredView}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView style={styles.view}>
                  <View style={styles.rank_display}>
                    <View style={styles.header}>
                      <Text>Minimum rank required</Text>
                    </View>
                    <FlatList
                      data={ranks}
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
  rank: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.5,
    height: 45,
  },
  rank_display: {
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
