import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

const extractKey = ({id}) => id;

export default class disPlayNameList extends React.Component {

    onPress = (user) => {
        const {onChooseUser} = this.props
        onChooseUser(user)
    }

  renderItem = ({item}) => {
    const {id, displayName} = item;
    const colors = ['#fab1a0', '#c7ecee', '#b8e999'];
    const chosenColor = colors[Math.floor(Math.random() * 3)];
    const user = {
        id: id,
        displayName: displayName
    }
    return (
      <TouchableWithoutFeedback onPress={() => this.onPress(user)}>
        <View style={[styles.card, {backgroundColor: chosenColor}]}>
          <Text numberOfLines={1}>{displayName}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {chosenUser} = this.props;

    return (
      <FlatList
        alwaysBounceVertical={false}
        horizontal={true}
        data={chosenUser}
        style={styles.container}
        keyExtractor={extractKey}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    maxWidth: 100,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 10,
    marginRight: 3
  },
});
