import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class NominationButon extends React.Component {
  render() {
    const {
      onPress,
      chosenUser,
      nomination,
      disabled,
      group,
      postId,
      theme,
      rankName,
    } = this.props;

    const {auth, rank_setting} = group;

    let text = 'Nominate other members';

    const allow_to_nominate = auth.rank <= rank_setting.nominate_rank_required;

    if (chosenUser.id != null && nomination.id != null) {
      text = 'Nominate ' + chosenUser.displayName + ' for ' + nomination.name;
    }

    if (chosenUser.id == null && nomination.id == null && disabled) {
      text = 'No nomination';
    }

    let rankTitle = rankName.rank1Name;
    switch (rank_setting.nominate_rank_required) {
      case 1:
        rankTitle = rankName.rank1Name;
        break;
      case 2:
        rankTitle = rankName.rank2Name;
        break;
      case 3:
        rankTitle = rankName.rank3Name;
        break;
      case 4:
        rankTitle = rankName.rank4Name;
        break;
      case 5:
        rankTitle = rankName.rank5Name;
        break;
      case 6:
        rankTitle = rankName.rank6Name;
        break;
      case 7:
        rankTitle = rankName.rank7Name;
        break;
    }

    if (postId == null && !allow_to_nominate) {
      text = 'Nominate other members (rank ' + rankTitle + ' required)';
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={disabled ? disabled : !allow_to_nominate}>
        <Text
          style={{color: !allow_to_nominate ? 'grey' : theme.textColor.color}}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    marginTop: 20,
    borderRadius: 10,
  },
});
