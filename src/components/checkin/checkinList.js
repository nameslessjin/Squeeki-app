import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import CheckinCard from './checkinCard';

const extractKey = ({id}) => id;

export default class CheckinList extends React.Component {
  renderItem = ({item}) => {
    const {onCheckInPress, currentUserId, auth, onDeleteCheckIn, onResultPress} = this.props;
    return (
      <CheckinCard
        item={item}
        onCheckInPress={onCheckInPress}
        currentUserId={currentUserId}
        auth={auth}
        onDeleteCheckIn={onDeleteCheckIn}
        onResultPress={onResultPress}
      />
    );
  };

  render() {
    const {checkin, onEndReached, onRefresh, refresh} = this.props;

    return (
        <FlatList
          style={styles.container}
          data={checkin}
          keyExtractKey={extractKey}
          alwaysBounceHorizontal={false}
          renderItem={this.renderItem}
          keyboardShouldPersistTaps={'handled'}
          refreshing={refresh}
          onRefresh={onRefresh}
          onEndReachedThreshold={0.1}
          onEndReached={onEndReached}
          showsVerticalScrollIndicator={false}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // backgroundColor: 'white'
    height: '100%',
  },
});
