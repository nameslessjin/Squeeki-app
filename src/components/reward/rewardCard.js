import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getFormalTime} from '../../utils/time';

export default class RewardCard extends React.Component {
  state = {
    icon_option: 'emoticon-cool-outline',
  };

  componentDidMount() {
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]});
  }

  onDelete = () => {
    const {onDeleteReward, item} = this.props;
    const {id} = item;

    Alert.alert('Delete reward', null, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: () => onDeleteReward(id),
        style: 'destructive',
      },
    ]);
  };

  render() {
    const {item, auth} = this.props;
    const {from, type, content, name, hide, createdAt, user} = item;
    const {icon_option} = this.state;
    let id = null;
    let displayName = null;
    let username = null;
    let icon = null;
    if (user != null) {
      id = user.id;
      displayName = user.displayName;
      username = user.username;
      icon = user.icon;
    }

    const {year, month, date} = getFormalTime(parseInt(createdAt));
    const timeText = (
      <Text style={{fontSize: 15, marginVertical: 5}}>
        At: {month + 1 + '/' + date + '/' + year}
      </Text>
    );

    return (
      <TouchableWithoutFeedback>
        <View style={styles.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.name, styles.text]}>{name}</Text>
            {user == null ? (
              auth.rank <= 1 && from == 'group' ? (
                <TouchableOpacity onPress={this.onDelete}>
                  <Text
                    style={[
                      styles.name,
                      styles.text,
                      {color: 'red', marginLeft: 3},
                    ]}>
                    X
                  </Text>
                </TouchableOpacity>
              ) : null
            ) : null}
          </View>

          {user != null && hide ? null : (
            <Text style={{backgroundColor: hide ? 'black' : null}}>
              {content}
            </Text>
          )}
          <Text>From: {from == 'system' ? 'Squeeki' : from}</Text>
          {user == null ? null : (
            <View style={styles.user}>
              <View style={[styles.user, {paddingVertical: 0, width: '80%'}]}>
                <Text>By: </Text>
                <View style={styles.imgHolder}>
                  {icon != null ? (
                    <Image source={{uri: icon.uri}} style={styles.icon} />
                  ) : (
                    <MaterialIcons name={icon_option} size={40} />
                  )}
                </View>
                <View style={styles.usernameStyle}>
                  <Text style={{marginLeft: 4}}>{displayName}</Text>
                </View>
              </View>
            </View>
          )}
          {user == null ? null : timeText}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  text: {
    marginVertical: 3,
  },
  user: {
    width: '100%',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgHolder: {
    aspectRatio: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  usernameStyle: {
    justifyContent: 'center',
  },
});
