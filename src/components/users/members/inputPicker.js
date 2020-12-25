import React from 'react';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-community/picker';
import {StyleSheet, TextInput, Text, View, Platform} from 'react-native';

export default class InputRankTitle extends React.Component {
  rankOptions = [
    {key: '1', label: '1', value: 1},
    {key: '2', label: '2', value: 2},
    {key: '3', label: '3', value: 3},
    {key: '4', label: '4', value: 4},
    {key: '5', label: '5', value: 5},
    {key: '6', label: '6', value: 6},
    {key: '7', label: '7', value: 7},
  ];

  render() {
    const {
      rank,
      onFocus,
      toggled,
      onBackdropPress,
      modifyInput,
      allowToChangeRank,
      userAuth
    } = this.props;
    
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Rank</Text>

        <TextInput
          style={styles.textInputContainer}
          placeholder={'rank'}
          value={rank.toString()}
          editable={allowToChangeRank}
          onFocus={() => onFocus()}
          
        />

        <Modal
          isVisible={toggled && allowToChangeRank}
          style={Platform.OS == 'ios' ? styles.Modal : null}
          onBackdropPress={onBackdropPress}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}>
          <Picker
            style={Platform.OS == 'ios' ? styles.Picker: {backgroundColor: 'white'}}
            selectedValue={Platform.OS == 'ios' ? rank : rank-1}
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
        </Modal>
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
    color: 'black'
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
