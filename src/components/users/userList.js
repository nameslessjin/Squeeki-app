import React from 'react';
import {FlatList, StyleSheet, View, Keyboard} from 'react-native';
import UserCard from '../users/userCard';

const extractKey = ({id}) => id;

export default class UserList extends React.Component {
  state = {
    chosenUser: [],
  };

  renderItem = ({item}) => {
    const {navigation, onChooseUser, prev_route, theme} = this.props;
    if (item.id == 'empty'){
      return <View style={[{width: '100%', height: 50}, theme.greyArea]}/>
    }
    return (
      <UserCard
        {...item}
        onPress={onChooseUser}
        navigation={navigation}
        prev_route={prev_route}
        theme={theme}
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
      currentUserId,
    } = this.props;

    let users = usersData
      .map(u => {
        return {
          ...u,
          chosen: chosenUser
            ? chosenUser.findIndex(c => c.id == u.id) != -1
              ? true
              : false
            : false,
        };
      })
      .filter(u => u.id != currentUserId);
    users = users.length < 10 ? users : users.concat({id: 'empty'})
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
        showsVerticalScrollIndicator={false}
        onScroll={() => Keyboard.dismiss()}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});
