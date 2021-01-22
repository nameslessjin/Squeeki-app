import React from 'react';
import {FlatList, View, Text, StyleSheet, Image} from 'react-native';
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
    const {username, id, displayName, icon, group_username} = user;
    const {icon_option} = this.state;

    const trophyColors = ['#f1bc12', '#bdc3c7', '#cd6133']

    return index <= 2 ? (
        
      <View style={styles.user}>
        <View style={[styles.user, {paddingVertical: 0, width: '80%'}]}>
            <View style={{width: 25, height: 25, marginRight: 5}}>
                <MaterialIcons name={index == 0 ? 'trophy' : 'trophy-variant'} color={trophyColors[index]} size={25} />
            </View>
          <View style={styles.imgHolder}>
            {icon != null ? (
              <Image source={{uri: icon.uri}} style={styles.icon} />
            ) : (
              <MaterialIcons name={icon_option} size={25} />
            )}
          </View>
          <View style={styles.nameStyle}>
            <Text style={{marginLeft: 4}}>{group_username}</Text>
          </View>
        </View>
        <View style={{width: '20%', justifyContent: 'center', alignItems: 'center'}}>
          <Text>{base_point}</Text>
        </View>
      </View>
    ) : null
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
  },
  icon: {
    height: 25,
    aspectRatio: 1,
    borderRadius: 12,
  },
  nameStyle: {
    justifyContent: 'center',
  },
});
