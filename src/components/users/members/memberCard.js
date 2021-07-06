import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {dateConversion} from '../../../utils/time';
import {singleDefaultIcon} from '../../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

class MemberCard extends React.Component {

  onPress = () => {
    const {navigation, item} = this.props;
    const {id, username, displayName, auth, icon} = item;
    navigation.navigate('Member', {
      ...item,
      prev_route: 'Members',
    });
  };


  render() {
    const {item, navigation} = this.props;
    const {
      id,
      username,
      displayName,
      auth,
      icon,
      lastActiveAt,
      group_username,
    } = item;
    const time = dateConversion(lastActiveAt, 'member');

    let group_username_size = 16;

    if (group_username.length > 20) {
      group_username_size = 15;
    }
    if (group_username.length > 25) {
      group_username_size = 14;
    }

    if (group_username.length > 35) {
      group_username_size = 13;
    }

    if (group_username.length > 45) {
      group_username_size = 12;
    }

    let titleSize = 13;
    if (auth.title.length > 20) {
      titleSize = 12;
    }

    return (
      <TouchableWithoutFeedback onPress={this.onPress}>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              source={icon ? {uri: icon.uri} : singleDefaultIcon()}
              style={styles.image}
            />
          </View>
          <View style={styles.name}>
            <Text style={{fontSize: group_username_size, textAlign: 'center'}}>
              {group_username}
            </Text>
            <Text
              style={{
                fontSize: titleSize,
                color: 'grey',
                marginTop: 3,
                textAlign: 'center',
              }}>
              {'<' + auth.title + '>'}
            </Text>
          </View>
          <View style={styles.time}>
            <Text style={{color: 'grey', fontSize: 11}}>Last seen: {time}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
  image: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    height: 110,
    justifyContent: 'flex-end',
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

export default connect(
  null,
  null,
)(MemberCard);
