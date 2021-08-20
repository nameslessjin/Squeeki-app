import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

export default class LeaderboardCard extends React.Component {
  render() {
    const {theme, i} = this.props;
    const {index, item} = i;
    const {base_point, user} = item;
    const {username, id, displayName, icon, group_username} = user;
    const trophyColors = ['#f1bc12', '#bdc3c7', '#cd6133'];

    return (
      <TouchableWithoutFeedback>
        <View style={styles.user}>
          <View style={[styles.user, {paddingVertical: 0, width: '90%'}]}>
            {index <= 3 ? (
              <View style={styles.trophy}>
                <MaterialIcons
                  name={index == 0 ? 'trophy' : 'trophy-variant'}
                  color={trophyColors[index - 1]}
                  size={40}
                />
              </View>
            ) : (
              <View style={[styles.trophy, theme.textColor]}>
                <Text>{index}</Text>
              </View>
            )}
            <View style={styles.imgHolder}>
              <Image
                source={icon ? {uri: icon.uri} : singleDefaultIcon()}
                style={styles.icon}
              />
            </View>
            <View style={styles.nameStyle}>
              <Text style={theme.textColor}>{group_username}</Text>
            </View>
          </View>
          <View style={styles.pointContainer}>
            <Text style={theme.textColor}>{base_point}</Text>
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
    marginRight: 5,
  },
  icon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  nameStyle: {
    justifyContent: 'center',
    width: width * 0.9 - 115,
  },
  trophy: {
    width: 40,
    height: 40,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointContainer: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
