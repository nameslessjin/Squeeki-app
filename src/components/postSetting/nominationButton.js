import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class NominationButon extends React.Component {
  render() {
    const {onPress, chosenUser, nomination, disabled, group, postId} = this.props;

    const {auth, rank_setting} = group;

    let text = 'Nominate your peer';

    const allow_to_nominate = auth.rank <= rank_setting.nominate_rank_required;

    if (chosenUser.id != null && nomination.id != null) {
      text = 'Nominate ' + chosenUser.displayName + ' for ' + nomination.name;
    }

    if (chosenUser.id == null && nomination.id == null && disabled) {
      text = 'No nomination';
    }

    if (postId == null && !allow_to_nominate) {
        text = 'Nominate your peer (rank ' + rank_setting.nominate_rank_required + ' required)' 
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        disabled={disabled ? disabled : !allow_to_nominate}>
        <Text style={{color: !allow_to_nominate ? 'grey' : 'black'}}>{text}</Text>
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
