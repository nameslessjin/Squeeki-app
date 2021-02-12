import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class groupButton extends React.Component {
  render() {
    const {
      auth,
      method,
      onNotificationPress,
      onAddPost,
      join_requested,
      rank_setting
    } = this.props;

    const joinButton = (
      <TouchableOpacity style={styles.joinButton} onPress={method}>
        <Text style={styles.text}>Join</Text>
      </TouchableOpacity>
    );

    const request_send = (
      <TouchableOpacity style={[styles.joinButton, {backgroundColor: 'grey', width: 100}]} disabled={true}>
        <Text style={[styles.text, {fontSize: 13}]}>Request sent</Text>
      </TouchableOpacity>
    );

    let create_post_allowed = false
    console.log(rank_setting)
    console.log(auth)
    if (rank_setting && auth){
      console.log(rank_setting.post_rank_required)
      console.log(auth.rank)
      if (rank_setting.post_rank_required >= auth.rank){
        create_post_allowed = true
      }
    }

    const createButton = (
      <TouchableOpacity onPress={onAddPost} disabled={!create_post_allowed}>
        <MaterialIcons name={'plus'} size={50} color={create_post_allowed ? '#EA2027' : 'grey'} />
      </TouchableOpacity>
    );

    const button =
      auth == null ? join_requested ? (request_send) : (
        joinButton
      ) : (
        <View style={styles.authorizedUserButton}>
          <TouchableOpacity
            onPress={onNotificationPress}
            style={[
              styles.touchButton,
              {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <MaterialIcons
              name={auth.notification ? 'bell' : 'bell-off'}
              color={auth.notification ? '#576889' : null}
              size={30}
            />
            <Text style={{color: '#576889', fontWeight: 'bold'}}>
              {auth.notificationPriority != -1
                ? auth.notificationPriority
                : null}
            </Text>
          </TouchableOpacity>
          {createButton}
        </View>
      );
    return button;
  }
}

const styles = StyleSheet.create({
  joinButton: {
    backgroundColor: '#EA2027',
    marginLeft: 20,
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  authorizedUserButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '70%',
    marginLeft: 5,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Jellee-Roman',
    color: 'white',
  },
  touchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
