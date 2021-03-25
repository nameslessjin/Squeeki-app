import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {dateConversion} from '../../utils/time';

const extractKey = ({userId}) => userId;

export default class UserChatList extends React.Component {
  renderItem = ({item}) => {
    const {
      userId,
      notification,
      is_owner,
      timeout,
      lastActiveAt,
      displayName,
      username,
      icon,
    } = item;
    const random = Math.floor(Math.random() * 5);
    let icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    icon_options = icon_options[random];

    let displayNameSize = 16;
    if (displayName.length > 20) {
      displayNameSize = 15;
    }
    if (displayName.length > 25) {
      displayNameSize = 13;
    }

    let userNameSize = 13;
    if (username.length > 25) {
      userNameSize = 12;
    }
    const time = dateConversion(lastActiveAt);

    return (
      <TouchableOpacity>
        <View style={styles.user_container}>
          {icon != null ? (
            <Image source={{uri: icon}} style={styles.image} />
          ) : (
            <MaterialIcons
              name={icon_options}
              size={120}
              style={{height: 115}}
            />
          )}
          {is_owner ? (
            <Text style={{fontSize: displayNameSize, marginTop: 10}}>
              <View style={{width: 15, height: 15}} />
              {displayName}
              <MaterialIcons
                name={'medal'}
                size={displayNameSize}
                color={'gold'}
              />
            </Text>
          ) : (
            <Text style={{fontSize: displayNameSize, marginTop: 10}}>
              {displayName}
            </Text>
          )}
          {/* <Text style={{}}>{username}</Text> */}
          <Text style={{color: 'grey', fontSize: 11, marginTop: 3}}>
            Last seen: {time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {users, onEndReached, onRefresh, refreshing} = this.props;

    return (
      <FlatList
        style={styles.container}
        data={users}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'green'
  },
  user_container: {
    width: 170,
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    // marginHorizontal: 10,
  },
  image: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
  },
});