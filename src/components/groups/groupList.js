import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import GroupCard from './groupCard';

const extractKey = ({id}) => id;

export default class GroupList extends React.Component {
  renderItem = ({item}) => {
    const {navigation, route, prevRoute} = this.props;
    return (
      <GroupCard
        item={item}
        navigation={navigation}
        route={route}
        prevRoute={prevRoute}
      />
    );
  };

  render() {
    const {groupsData, onEndReached, onRefresh, refreshing} = this.props;

    return (
      <FlatList
        style={styles.container}
        data={groupsData}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 20,
  },
});
