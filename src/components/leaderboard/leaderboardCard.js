import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LeaderboardCard extends React.Component {
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

  render() {
    const {index, item} = this.props.i;
    const {base_point, user} = item;
    const {username, id, displayName, icon} = user;
    const {icon_option} = this.state;
    const trophyColors = ['#f1bc12', '#bdc3c7', '#cd6133'];

    return (
      <TouchableWithoutFeedback>
        <View style={styles.user}>
          <View style={[styles.user, {paddingVertical: 0, width: '80%'}]}>
            {index <= 3 ? (
              <View style={styles.trophy}>
                <MaterialIcons
                  name={index == 0 ? 'trophy' : 'trophy-variant'}
                  color={trophyColors[index-1]}
                  size={40}
                />
              </View>
            ) : (
              <View style={[styles.trophy]}>
                <Text>{index}</Text>
              </View>
            )}
            <View style={styles.imgHolder}>
              {icon != null ? (
                <Image source={{uri: icon.uri}} style={styles.icon} />
              ) : (
                <MaterialIcons name={icon_option} size={40} />
              )}
            </View>
            <View style={styles.nameStyle}>
              <Text style={{marginLeft: 4}}>{displayName}</Text>
            </View>
          </View>
          <View style={styles.pointContainer}>
            <Text>{base_point}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
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
  nameStyle: {
    justifyContent: 'center',
  },
  trophy: {
    width: 40,
    height: 40,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
