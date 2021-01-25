import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class addButton extends React.Component {
  render() {
    const {onPress, onJoinRequestPress, group_join_request_count} = this.props;

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={onJoinRequestPress}>
          <View style={{flexDirection: 'row'}}>
            {group_join_request_count == 0 ? null : (
              <View style={styles.notification}>
                <Text style={styles.notificationText}>
                  {group_join_request_count}
                </Text>
              </View>
            )}
            <MaterialIcons
              name="account-multiple-outline"
              size={30}
              color={'#EA2027'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerRightButton} onPress={onPress}>
          <MaterialIcons name="plus" size={30} color={'#EA2027'} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerRightButton: {
    marginRight: 15,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  request: {
    marginRight: 5,
    width: 50,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notification: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EA2027',
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});
