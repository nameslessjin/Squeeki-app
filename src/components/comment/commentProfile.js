import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {singleDefaultIcon} from '../../utils/defaultIcon';

export default class CommentProfile extends React.Component {
  render() {
    const {icon} = this.props;

    return (
      <View style={styles.container}>
        <Image
          source={icon ? {uri: icon.uri} : singleDefaultIcon()}
          style={styles.userIcon}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '15%',
    alignItems: 'flex-start',
  },
  userIcon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
});
