import React from 'react';
import {
  FlatList,
  StyleSheet,
  Keyboard,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('screen');

const extractKey = ({place_id}) => place_id;

export default class LocationList extends React.Component {
  renderItem = ({item}) => {
    const {description, place_id} = item;
    const {theme, onPress} = this.props;
    return (
      <View style={{width: width, padding: 10, alignItems: 'center'}}>
        <TouchableOpacity onPress={() => onPress(item)}>
          <View
            style={[
              {padding: 10, borderRadius: 15, width: width * 0.9},
              theme.backgroundColor,
            ]}>
            <Text style={[theme.textColor]}>{description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {locations} = this.props;

    return (
      <FlatList
        styles={styles.container}
        data={locations}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        onScroll={() => Keyboard.dismiss()}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 20,
  },
});
