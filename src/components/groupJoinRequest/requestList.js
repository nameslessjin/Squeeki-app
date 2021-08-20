import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

const extractKey = ({id}) => id;

export default class RequestList extends React.Component {
  renderItem = i => {
    const {item} = i;
    const {username, displayName, id, icon, loading} = item;
    const {onRespond, theme} = this.props;
    
    let displayNameSize = 16;

    if (displayName.length > 20) {
      displayNameSize = 15;
    }

    if (displayName.length > 30) {
      displayNameSize = 14;
    }

    if (displayName.length > 40) {
      displayNameSize = 13;
    }

    return (
      <TouchableWithoutFeedback>
        <View style={styles.user}>
          <View style={[styles.user, {paddingVertical: 0, width: '65%'}]}>
            <View style={styles.imgHolder}>
              <Image
                source={icon ? {uri: icon.uri} : singleDefaultIcon()}
                style={styles.icon}
              />
            </View>
            <View style={styles.nameStyle}>
              <Text style={[{fontSize: displayNameSize}, theme.textColor]}>{displayName}</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            {loading == 'deny' ? (
              <ActivityIndicator animating={true} color={'grey'} />
            ) : (
              <TouchableOpacity onPress={() => onRespond(id, 'deny')}>
                <View
                  style={[
                    styles.button,
                    {
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: 'grey',
                    },
                  ]}>
                  <Text style={[styles.buttonText, theme.textColor]}>Deny</Text>
                </View>
              </TouchableOpacity>
            )}
            {loading == 'confirm' ? (
              <ActivityIndicator animating={true} color={'grey'} />
            ) : (
              <TouchableOpacity onPress={() => onRespond(id, 'confirm')}>
                <View
                  style={[
                    styles.button,
                    {backgroundColor: '#EA2027', marginRight: 10},
                  ]}>
                  <Text style={[styles.buttonText, {color: 'white'}]}>
                    Confirm
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const {users, onEndReached, refreshing, onRefresh} = this.props;

    return (
      <FlatList
        data={users}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  icon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  nameStyle: {
    justifyContent: 'center',
    width: width * 0.65 - 60,
  },
  buttonsContainer: {
    width: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    width: 60,
    margin: 5,
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    padding: 5,
    fontWeight: '500',
    fontSize: 13,
  },
});
