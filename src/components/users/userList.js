import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import UserCard from '../users/userCard';

const extractKey = ({id}) => id;

export default class UserList extends React.Component {
  state = {
    chosenUser: [],
  };

  renderItem = ({item}) => {
    const {navigation, onChooseUser, prev_route} = this.props;

    return (
      <UserCard
        {...item}
        onPress={onChooseUser}
        navigation={navigation}
        prev_route={prev_route}
      />
    );
  };

  render() {
    const {
      usersData,
      onEndReached,
      onRefresh,
      refreshing,
      chosenUser,
    } = this.props;

    const users = usersData.map(u => {
      return {
        ...u,
        chosen: chosenUser ? chosenUser.findIndex(c => c.id == u.id) != -1 ? true : false : false,
      };
    });

    return (
      <FlatList
        style={styles.container}
        data={users}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyboardShouldPersistTaps={'handled'}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
    
  },
});
