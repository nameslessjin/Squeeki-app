import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {dateConversion} from '../../utils/time';

const { width } = Dimensions.get('screen')

export default class CommentUsername extends React.Component {
  render() {
    const {user, createdAt} = this.props;
    const {group_username, displayName, username} = user;
    const date = dateConversion(createdAt, 'comment');

    // sizing displayNmae
    let displayNameSize = 14;
    if (displayName.length > 30) {
      displayNameSize = 13;
    }
    if (displayName.length > 40) {
      displayNameSize = 12;
    }

    let group_username_size = 14;
    if (group_username) {
      if (group_username.length > 30) {
        group_username_size = 13;
      }
      if (group_username.length > 40) {
        group_username_size = 12;
      }
    }

    // sizing username
    let userNameSize = 13;
    if (username.length > 25) {
      userNameSize = 12;
    }

    return (
      <View style={styles.container}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.displayNameStyle,
              {
                fontSize:
                  group_username != null
                    ? group_username_size
                    : displayNameSize,
              },
            ]}>
            {group_username != null ? group_username : displayName}
          </Text>
          <Text style={styles.usernameStyle}>@{username}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeStyle}>{date}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 3,
  },
  nameContainer: {
    maxWidth: width * 0.85 - 70,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  displayNameStyle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  usernameStyle: {
    fontSize: 12,
    color: '#95a5a6',
  },
  timeContainer: {
    width: 70,
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeStyle: {
    fontSize: 12,
    color: '#95a5a6',
  },
});
