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
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const extractKey = ({id}) => id;

export default class RequestList extends React.Component {
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
    const {item} = i;
    const {username, displayName, id, icon, loading} = item;
    const {icon_option} = this.state;
    const {onRespond} = this.props;
    return (
      <TouchableWithoutFeedback>
        <View style={styles.user}>
          <View style={[styles.user, {paddingVertical: 0, width: '65%'}]}>
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
          <View style={styles.buttonsContainer}>
            {loading == 'deny' ? (
              <ActivityIndicator animating={true} color={'grey'}/>
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
                  <Text style={styles.buttonText}>Deny</Text>
                </View>
              </TouchableOpacity>
            )}
            {loading == 'confirm' ? (
              <ActivityIndicator animating={true} color={'grey'}/>
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
  },
  icon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  nameStyle: {
    justifyContent: 'center',
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
