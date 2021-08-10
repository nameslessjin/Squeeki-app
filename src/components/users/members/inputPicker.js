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
import RankSettingModal from '../../rankSetting/rankSettingModal';

export default class InputRankTitle extends React.Component {

  render() {
    const {
      rank,
      onFocus,
      toggled,
      onBackdropPress,
      modifyInput,
      allowToModifyMember,
      userAuth,
      rankName
    } = this.props;


    let rankTitle = rankName.rank1Name;
    if (rank == 1) {
      rankTitle = rankName.rank1Name;
    } else if (rank == 2) {
      rankTitle = rankName.rank2Name;
    } else if (rank == 3) {
      rankTitle = rankName.rank3Name;
    } else if (rank == 4) {
      rankTitle = rankName.rank4Name;
    } else if (rank == 5) {
      rankTitle = rankName.rank5Name;
    } else if (rank == 6) {
      rankTitle = rankName.rank6Name;
    } else if (rank == 7) {
      rankTitle = rankName.rank7Name;
    } 

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Rank</Text>

        <TouchableWithoutFeedback
          onPress={onFocus}
          disabled={!allowToModifyMember || userAuth.rank == rank}>
          <View style={styles.textInputContainer}>
            <Text>{rankTitle}</Text>
          </View>
        </TouchableWithoutFeedback>

        <RankSettingModal
          modalVisible={toggled && allowToModifyMember}
          onBackdropPress={onBackdropPress}
          onRankChange={modifyInput}
          rankName={rankName}
          type={'rank'}
          prevRoute={'member'}
          userRank={userAuth.rank}
        />

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
