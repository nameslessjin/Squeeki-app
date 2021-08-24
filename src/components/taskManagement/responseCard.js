import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

export default class ResponseCard extends React.Component {
  render() {
    let {
      userId,
      postId,
      taskResponse,
      displayName,
      iconUrl,
      taskReplyId,
      onPress,
      theme
    } = this.props;

    return (
      <TouchableWithoutFeedback>
        <View style={styles.user}>
          <View style={[styles.user, {paddingVertical: 0, width: width - 130}]}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    taskResponse == 'confirm'
                      ? '#f39c12'
                      : taskResponse == 'completed'
                      ? '#2ed573'
                      : '#EA2027',
                },
              ]}
            />
            <View style={styles.imgHolder}>
              <Image
                source={iconUrl ? {uri: iconUrl} : singleDefaultIcon()}
                style={styles.icon}
              />
            </View>
            <View style={styles.nameStyle}>
              <Text style={theme.textColor}>{displayName}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {taskReplyId && taskResponse != 'deny' ? (
              <TouchableOpacity
                onPress={() => onPress(userId, 'getVerification')}>
                <View
                  style={[
                    styles.button,
                    {
                      marginRight: 5,
                      backgroundColor: '#f39c12',
                    },
                  ]}>
                  <Text style={{color: 'white'}}>Proof</Text>
                </View>
              </TouchableOpacity>
            ) : !taskReplyId && taskResponse != 'completed' && taskResponse != 'deny' ? (
              <TouchableOpacity
                onPress={() => onPress(userId, 'deny')}>
                <View
                  style={[
                    styles.button,
                    {
                      marginRight: 5,
                      backgroundColor: '#EA2027',
                    },
                  ]}>
                  <Text style={{color: 'white'}}>Deny</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {taskResponse == 'completed' || taskResponse == 'confirm' ? (
              <TouchableOpacity
                onPress={() => onPress(userId, 'completed')}
                disabled={taskResponse == 'completed'}>
                <View
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        taskResponse == 'completed' ? '#2ed573' : '#1e90ff',
                    },
                  ]}>
                  <Text style={{color: 'white'}}>
                    {taskResponse == 'completed' ? 'Completed' : 'Confirm'}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  statusDot: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  imgHolder: {
    aspectRatio: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  icon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  nameStyle: {
    justifyContent: 'center',
    width: width * 0.9 - 115,
  },
  buttonContainer: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#2ed573',
    padding: 3,
  },
});
