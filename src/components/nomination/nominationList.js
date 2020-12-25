import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from 'react-native';
import NominationCard from '../nomination/nominationCard'

const extractKey = ({id}) => id;

export default class NominationList extends React.Component {

  renderItem = ({item}) => {
    const {navigation, onEditPress, prev_route, onNominationSelect} = this.props;
    return (
      <NominationCard item={item} onEditPress={onEditPress} navigation={navigation} onNominationSelect={onNominationSelect} prev_route={prev_route} />
    );
  };

  render() {
    const {nominations} = this.props;
    return (
      <FlatList
        style={styles.container}
        data={nominations}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        keyboardShouldPersistTaps={'handled'}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: 'white'
  },
});
