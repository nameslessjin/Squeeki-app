import React from 'react';
import {
  FlatList,
  StyleSheet,
  Keyboard,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import {powerByGoogleIconPick} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

const extractKey = ({place_id}) => place_id;

export default class LocationList extends React.Component {
  renderItem = ({item}) => {
    const {description, place_id} = item;
    const {theme, onPress, isWhite} = this.props;
    console.log(isWhite)
    if (place_id == 'powerByGoogle') {
      return (
        <View style={{width: width, alignItems: 'center'}}>
          <Image
            source={powerByGoogleIconPick(isWhite)}
          />
        </View>
      );
    } else {
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
    }
  };

  render() {
    const {locations} = this.props;
    let data = [{place_id: 'powerByGoogle'}]

    if (locations.length == 0){
      data = []
    } else {
      data = data.concat(locations)
    }

    return (
      <FlatList
        styles={styles.container}
        data={data}
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
