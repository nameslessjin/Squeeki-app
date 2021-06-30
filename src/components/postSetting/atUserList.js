import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width, height} = Dimensions.get('screen');

const extractKey = ({id}) => id;

export default class AtUserList extends React.Component {
  renderItem = ({item}) => {
    const {id, displayName, username, iconUrl} = item;
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
          <View style={styles.nameHolder}>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.username}>@{username}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {atSearchResult, isPicSet} = this.props;

    return (
      <View
        style={[
          styles.container,
          {height: isPicSet ? height - 680 : height - 400},
        ]}>
        <FlatList
          data={atSearchResult}
          renderItem={this.renderItem}
          keyExtractor={extractKey}
          style={styles.list}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps={'handled'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    height: height - 300,
    alignItems: 'center',
  },
  list: {
    width: '90%',
  },
  card: {
    minHeight: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  imgHolder: {
    height: 60,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
  nameHolder: {
    minHeight: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: width * 0.9 - 70,
  },
  displayName: {
    color: 'black',
    fontSize: 16,
  },
  username: {
    color: 'grey',
    fontSize: 13,
  },
});