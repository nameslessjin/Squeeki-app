import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {singleDefaultIcon} from '../../utils/defaultIcon';

export default class UserCard extends React.Component {
  OnUserPress = () => {
    const {id, displayName, onPress, group_username} = this.props;
    const user = {
      id: id,
      displayName: group_username != null ? group_username : displayName,
    };
    onPress(user);
  };

  render() {
    const {
      username,
      displayName,
      icon,
      in_group,
      chosen,
      prev_route,
      onPress,
      checked,
      group_username,
      in_chat,
      theme
    } = this.props;

    let disable = false;

    let in_group_message = null;
    if (
      in_group == 1 &&
      prev_route != 'PostSetting' &&
      prev_route != 'CheckInResult'
    ) {
      in_group_message = 'In group';
      disable = true;
    } else if (checked && prev_route == 'CheckInResult') {
      in_group_message = 'Checked';
      disable = true;
    } else if (in_chat) {
      disable = true;
      in_group_message = 'In Chat';
    }

    let displayNameSize = 16;
    if (displayName.length > 25) {
      displayNameSize = 15;
    }
    if (displayName.length > 35) {
      displayNameSize = 14;
    }

    let group_username_size = 16;
    if (group_username) {
      if (group_username.length > 25) {
        group_username_size = 15;
      }
      if (group_username.length > 35) {
        group_username_size = 14;
      }
    }

    let userNameSize = 13;

    return (
      <TouchableWithoutFeedback
        disabled={disable}
        onPress={onPress ? this.OnUserPress : null}>
        <View
          style={[
            styles.container,
            chosen ? {backgroundColor: '#c7ecee'} : theme.backgroundColor, theme.borderColor
          ]}>
          <View style={{width: '80%', flexDirection: 'row'}}>
            <View style={styles.imgHolder}>
              <Image
                source={icon ? {uri: icon.uri} : singleDefaultIcon()}
                style={styles.imageStyle}
              />
            </View>
            <View style={styles.nameStyle}>
              <Text
                style={[{
                  fontSize:
                    group_username != null
                      ? group_username_size
                      : displayNameSize,
                }, theme.textColor]}>
                {group_username != null ? group_username : displayName}
              </Text>
              <Text style={[styles.usernameStyle, {fontSize: userNameSize}]}>
                @{username}
              </Text>
            </View>
          </View>
          <View style={styles.inGroupMessageContainer}>
            <Text style={styles.inGroupMessage}>{in_group_message}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 75,
    maxHeight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  imageStyle: {
    height: 70,
    aspectRatio: 1,
    borderRadius: 35,
  },
  imgHolder: {
    aspectRatio: 1,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  usernameStyle: {
    fontSize: 13,
    color: '#95a5a6',
  },
  inGroupMessage: {
    fontSize: 12,
    color: '#95a5a6',
  },
  nameStyle: {
    paddingLeft: 10,
    height: '100%',
    width: '75%',
    justifyContent: 'center',
  },
  inGroupMessageContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5,
    width: '20%',
  },
});
