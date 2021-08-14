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
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

const extractKey = ({id}) => id;

export default class AtList extends React.Component {
  renderItem = ({item}) => {
    const {displayName, username, iconUrl, groupname} = item;
    const {onAtPress} = this.props;

    return (
      <TouchableWithoutFeedback onPress={() => onAtPress(item)}>
        <View style={styles.card}>
          <View style={styles.imgHolder}>
            <Image
              source={iconUrl ? {uri: iconUrl} : singleDefaultIcon()}
              style={styles.img}
            />
          </View>
          <View style={styles.name}>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.username}>
              {username ? `@${username}` : `g@${groupname}`}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {atSearchResult} = this.props;

    const searchResult = atSearchResult.map(r => {
      if (r.groupId) {
        return {
          groupname: r.groupname,
          iconUrl: r.icon,
          displayName: r.displayName,
          id: r.groupId,
        };
      }
      return r;
    });

    return atSearchResult.length > 0 ? (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={searchResult}
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
    zIndex: 1,
  },
  list: {
    maxHeight: 150,
    width: '100%',
    backgroundColor: 'white',
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
