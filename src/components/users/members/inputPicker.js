import React from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-community/picker';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import RankSettingModal from './rankSettingModal';

export default class InputRankTitle extends React.Component {
  rankOptions = [
    {id: '1', value: 1},
    {id: '2', value: 2},
    {id: '3', value: 3},
    {id: '4', value: 4},
    {id: '5', value: 5},
    {id: '6', value: 6},
    {id: '7', value: 7},
  ];

  render() {
    const {
      rank,
      onFocus,
      toggled,
      onBackdropPress,
      modifyInput,
      allowToModifyMember,
      userAuth,
    } = this.props;

    const rankOptions = this.rankOptions.filter(op => op.value > userAuth.rank)

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Rank</Text>

        <TouchableWithoutFeedback
          onPress={onFocus}
          disabled={!allowToModifyMember || userAuth.rank == rank}>
          <View style={styles.textInputContainer}>
            <Text>{rank}</Text>
          </View>
        </TouchableWithoutFeedback>

        <RankSettingModal
          modalVisible={toggled && allowToModifyMember}
          onBackdropPress={onBackdropPress}
          rankOptions={rankOptions}
          onRankChange={modifyInput}
          type={'rank'}
        />

        {/* <Modal
          isVisible={toggled && allowToChangeRank}
          style={Platform.OS == 'ios' ? styles.Modal : null}
          onBackdropPress={onBackdropPress}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}>
          <Picker
            style={
              Platform.OS == 'ios' ? styles.Picker : {backgroundColor: 'white'}
            }
            selectedValue={Platform.OS == 'ios' ? rank : rank - 1}
            onValueChange={v => modifyInput('rank', v)}>
            {this.rankOptions.map(option => {
              if (option.value > userAuth.rank) {
                return (
                  <Picker.Item
                    key={option.key}
                    label={option.label}
                    value={option.value}
                  />
                );
              }
            })}
          </Picker>
        </Modal> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '40%',
  },
  header: {
    width: '100%',
    height: 20,
    color: '#273c75',
    fontSize: 12,
    paddingLeft: 5,
  },
  textInputContainer: {
    width: '100%',
    height: 25,
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    color: 'black',
  },
  Modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  Picker: {
    width: 1000,
    height: 250,
    backgroundColor: 'white',
  },
});
