import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default class PostNomination extends React.Component {
  render() {
    const {
      nomination,
      onPress,
      voting,
      theme,
      priority,
      group,
      groupId,
    } = this.props;

    const now = Date.now();
    const voteButton = nomination.voted ? (
      <View style={{marginVertical: 5}}>
        <Text style={{color: 'grey'}}>Voted</Text>
      </View>
    ) : group.id == null || group.id != groupId ? null : now <=
      nomination.endAt ? (
      <TouchableOpacity style={{marginVertical: 5}} onPress={onPress}>
        <Text style={{color: 'red'}}>Vote</Text>
      </TouchableOpacity>
    ) : (
      <View style={{marginVertical: 5}}>
        <Text style={{color: 'grey'}}>Completed</Text>
      </View>
    );
    return (
      <View style={styles.container}>
        <Text
          style={[
            {
              paddingHorizontal: 10,
              color: priority > 0 ? 'black' : theme.textColor.color,
            },
          ]}>
          <Text style={{fontWeight: 'bold'}}>{nomination.nominee_name}</Text> is
          nominated for{' '}
          <Text style={{fontWeight: 'bold'}}>{nomination.nomination_name}</Text>
        </Text>
        {voting ? (
          <ActivityIndicator color={'grey'} animating={true} />
        ) : (
          voteButton
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
