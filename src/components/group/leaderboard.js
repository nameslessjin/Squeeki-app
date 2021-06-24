import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

const extractKey = ({user}) => user.id;
export default class Leaderboard extends React.Component {
  renderItem = i => {
    const {index, item} = i;
    const {base_point, user} = i.item;
    const {username, id, displayName, icon, group_username} = user;

    const trophyColors = ['#f1bc12', '#bdc3c7', '#cd6133'];

    return index <= 2 ? (
      <View style={styles.user}>
        <View style={[styles.user, {paddingVertical: 0, width: '90%'}]}>
          <View style={{width: 25, height: 25, marginRight: 5}}>
            <MaterialIcons
              name={index == 0 ? 'trophy' : 'trophy-variant'}
              color={trophyColors[index]}
              size={25}
            />
          </View>
          <View style={styles.imgHolder}>
            <Image
              source={icon ? {uri: icon.uri} : singleDefaultIcon()}
              style={styles.icon}
            />
          </View>
          <View style={styles.nameStyle}>
            <Text>{group_username}</Text>
          </View>
        </View>
        <View
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          <Text>{base_point}</Text>
        </View>
      </View>
    ) : null;
  };

  render() {
    const {users} = this.props;

    return (
      <FlatList
        data={users}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  user: {
    width: '100%',
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgHolder: {
    aspectRatio: 1,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  icon: {
    height: 25,
    aspectRatio: 1,
    borderRadius: 12,
  },
  nameStyle: {
    justifyContent: 'center',
    width: width * 0.9 - 80,
  },
});
