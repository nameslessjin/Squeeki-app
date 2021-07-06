import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {dateConversion} from '../../utils/time';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

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
      id,
    } = item;

    const {onMemberCardPress, user_id} = this.props;
    const time_out = new Date(parseInt(timeout));
    const different = time_out - Date.now();

    let displayNameSize = 16;
    if (displayName.length > 20) {
      displayNameSize = 15;
    }
    if (displayName.length > 25) {
      displayNameSize = 14;
    }

    if (displayName.length > 35) {
      displayNameSize = 13;
    }

    if (displayName.length > 45) {
      displayNameSize = 12;
    }

    let userNameSize = 13;
    if (username.length > 20) {
      userNameSize = 12;
    }

    return (
      <TouchableOpacity
        onPress={() => onMemberCardPress(userId)}
        disabled={user_id == userId}>
        <View style={styles.user_container}>
          <View style={styles.imageContainer}>
            <Image
              source={icon ? {uri: icon} : singleDefaultIcon()}
              style={styles.image}
            />
          </View>
          <View style={styles.name}>
            <Text style={{fontSize: displayNameSize, textAlign: 'center'}}>
              {displayName}
              {is_owner ? (
                <MaterialIcons
                  name={'medal'}
                  size={displayNameSize}
                  color={'gold'}
                />
              ) : null}
              {different > 0 ? (
                <MaterialIcons
                  color={'red'}
                  name={'timer-sand-full'}
                  size={displayNameSize}
                />
              ) : null}
            </Text>
            <Text
              style={{
                fontSize: userNameSize,
                color: 'grey',
                marginTop: 3,
                textAlign: 'center',
              }}>
              @{username}
            </Text>
          </View>
          <View style={styles.time}>
            <Text style={{color: 'grey', fontSize: 11}}>
              Last seen: {dateConversion(lastActiveAt, 'chat')}
            </Text>
          </View>
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
    marginTop: 5,
  },
  user_container: {
    width: 170,
    height: 225,
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: (width - 177 * 2) / 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 5,
    shadowRadius: 1,
    shadowColor: 'grey',
    shadowOpacity: 0.5,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    height: 110,
    justifyContent: 'flex-end',
  },
  image: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
  },
  searchBar: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    width: '100%',
    minHeight: 65,
    maxHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 7,
    paddingHorizontal: 10,
  },
  time: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
