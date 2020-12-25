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
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export default class UserCard extends React.Component {

  state = {
    icon_option: 'emoticon-cool-outline'
  }

  componentDidMount(){
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]})
  }

  OnUserPress = () => {

    const {id, displayName, onPress} = this.props;
    const user = {
      id: id,
      displayName: displayName,
    };
    onPress(user);
  };

  render() {
    const {username, displayName, icon, in_group, chosen, prev_route} = this.props;
    const { icon_option } = this.state
    const in_group_message = (in_group == 1 && prev_route != 'PostSetting') ? 'In your group' : null;

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

    return (
      <TouchableWithoutFeedback disabled={(in_group && prev_route != 'PostSetting')} onPress={this.OnUserPress}>
        <View
          style={[
            styles.container,
            chosen ? {backgroundColor: '#c7ecee'} : null,
          ]}>
          <View style={styles.imgHolder}>
            {icon != null ? (
              <Image source={{uri: icon.uri}} style={styles.imageStyle} />
            ) : (
              <MaterialIcons name={icon_option} size={70} />
            )}
          </View>
          <View style={[styles.nameStyle, {width: (width - 70) * 0.7}]}>
            <Text style={{fontSize: displayNameSize}}>{displayName}</Text>
            <Text style={[styles.usernameStyle, {fontSize: userNameSize}]}>
              {username}
            </Text>
          </View>
          <View
            style={[
              styles.inGroupMessageContainer,
              {width: (width - 70) * 0.3},
            ]}>
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
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
    fontSize: 13,
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  nameStyle: {
    paddingLeft: 8,
    height: '100%',
    justifyContent: 'center',
  },
  inGroupMessageContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
});
