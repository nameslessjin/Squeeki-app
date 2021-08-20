import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

export default class InputRankTitle extends React.Component {
  render() {
    const {rank, onFocus, allowToModifyMember, userAuth, rankName, theme} = this.props;

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
        <Text style={[styles.header, theme.titleColor]}>Rank</Text>

        <TouchableWithoutFeedback
          onPress={onFocus}
          disabled={!allowToModifyMember || userAuth.rank == rank}>
          <View style={[styles.textInputContainer, theme.underLineColor]}>
            <Text style={theme.textColor}>{rankTitle}</Text>
          </View>
        </TouchableWithoutFeedback>
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
    // backgroundColor: 'white',
    padding: 5,
    paddingVertical: Platform.OS == 'android' ? 9 : 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    maxHeight: 60,
  },
});
