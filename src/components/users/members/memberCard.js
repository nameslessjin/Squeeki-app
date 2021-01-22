import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { dateConversion } from '../../../utils/time'

class MemberCard extends React.Component {

  state = {
    icon_option: 'emoticon-cool-outline'
  }

  onPress = () => {
      const {navigation, item} = this.props
      const {id, username, displayName, auth, icon} = item;
      navigation.navigate("Member", {
          ...item
      })
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

  render() {
    const {item, navigation} = this.props;
    const {id, username, displayName, auth, icon, lastActiveAt, group_username} = item;
    const time = dateConversion(lastActiveAt)
    const { icon_option} = this.state

    let group_username_size = 14;
    if (group_username.length > 20) {
      group_username_size = 13;
    }
    if (group_username.length > 25) {
      group_username_size = 10;
    }

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          {icon != null ? (
            <Image
              source={{uri: icon.uri}}
              style={styles.image}
            />
          ) : (
            <MaterialIcons
              name={icon_option}
              size={120}
              style={{height: 115}}
            />
          )}
          <Text style={[styles.displayName, {fontSize: group_username_size}]}>
            {group_username}
          </Text>
          <Text numberOfLines={2} style={styles.title}>{"<" + auth.title.charAt(0).toUpperCase() + auth.title.slice(1) + '>'}</Text>
          <Text style={{color: 'grey', fontSize: 11, marginTop: 3}} >Last seen: {time}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    margin: 5
  },
  image: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
  },
  displayName: {
    marginTop: 10,
  },
  title: {
    marginTop: 5,
  },
});

export default connect(null, null)(MemberCard)