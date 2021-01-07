import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const extractKey = ({user}) => user.id;
export default class Leaderboard extends React.Component {
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

  renderItem = i => {
    const {index, item} = i;
    const {base_point, user} = i.item;
    const {username, id, displayName, icon} = user;
    const {icon_option} = this.state;

    const trophyColors = ['#f1bc12', '#bdc3c7', '#cd6133'];

    return (
      <TouchableWithoutFeedback>
        <View style={styles.user}>
          <View style={[styles.user, {paddingVertical: 0, width: '80%'}]}>
            {index <= 2 ? (
              <View style={styles.trophy}>
                <MaterialIcons
                  name={index == 0 ? 'trophy' : 'trophy-variant'}
                  color={trophyColors[index]}
                  size={40}
                />
              </View>
            ) : (
              <View style={[styles.trophy]}>
                <Text>{index + 1}</Text>
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
          <View
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{base_point}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {users, onEndReached} = this.props;

    return (
      <FlatList
        data={users}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
      />
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
    alignItems: 'center'
  },
});
