import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('screen');

const extractKey = ({userId}) => userId;

export default class AtList extends React.Component {
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

  renderItem = ({item}) => {
    const {displayName, username, iconUrl} = item;
    const {icon_option} = this.state;
    const {onAtPress} = this.props;

    return (
      <TouchableWithoutFeedback onPress={() => onAtPress(item)}>
        <View style={styles.card}>
          <View style={styles.imgHolder}>
            {iconUrl ? (
              <Image source={{uri: iconUrl}} style={styles.img} />
            ) : (
              <MaterialIcons name={icon_option} size={40} />
            )}
          </View>
          <View style={styles.name}>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {atSearchResult} = this.props;

    return atSearchResult.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={atSearchResult}
          keyExtractor={extractKey}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          keyboardShouldPersistTaps={'handled'}
          renderItem={this.renderItem}
        />
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    bottom: 35,
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 1
  },
  list: {
    maxHeight: 150,
    width: '100%',
    backgroundColor: 'white'
  },
  card: {
    minHeight: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 5,
  },
  imgHolder: {
    height: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  name: {
    minHeight: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: width * 0.9 - 60,
  },
  displayName: {
    color: 'black',
    fontSize: 15,
  },
  username: {
    color: 'grey',
    fontSize: 13,
  },
});
