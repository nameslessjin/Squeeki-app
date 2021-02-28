import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {dateConversion} from '../../utils/time';


export default class ReplyUsername extends React.Component {
  render() {
    const {user, createdAt} = this.props;
    const {group_username, displayName, username} = user;
    const date = dateConversion(createdAt);

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.displayNameStyle}>
            {group_username != null
              ? group_username
              : displayName}
          </Text>
          <Text style={styles.usernameStyle}>{username}</Text>
        </View>
        <Text style={styles.timeStyle}>{date}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 3,
  },
  displayNameStyle: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  usernameStyle: {
    fontSize: 10,
    color: '#95a5a6',
  },
  timeStyle: {
    marginLeft: 18,
    color: '#95a5a6',
  },
});
