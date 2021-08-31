import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {countFormat} from '../../utils/format';
import {dateConversion} from '../../utils/time';

const {width} = Dimensions.get('screen');

export default class PostFooter extends React.Component {
  onCommentPress = () => {
    const {navigation, postId, prevRoute} = this.props;
    navigation.navigate('Comment', {
      postId: postId,
      prevRoute
    });
  };

  render() {
    const {
      commentCount,
      likeCount,
      // commentTouchable,
      onRespondPost,
      liked,
      loading,
      denyButton,
      confirmButton,
      type,
      pressedButton,
      taskResponse,
      currentUserAuth,
      onViewButtonPress,
      taskExpiration,
      start,
      end,
      theme,
      priority,
      prevRoute,
      locationDescription,
      backgroundColor,
      lat,
      lng,
      position,
    } = this.props;

    let distance = 0;
    if (lat && lng && position) {
      const {latitude, longitude} = position.coords;
      const userLatRadians = (latitude * Math.PI) / 180;
      const userLngRadians = (longitude * Math.PI) / 180;
      const groupLatRadians = (lat * Math.PI) / 180;
      const groupLngRadians = (lng * Math.PI) / 180;
      distance =
        3959 *
        Math.acos(
          Math.cos(userLatRadians) *
            Math.cos(groupLatRadians) *
            Math.cos(groupLngRadians - userLngRadians) +
            Math.sin(userLatRadians) * Math.sin(groupLatRadians),
        );
      distance = distance.toFixed(2);
    }

    const likeCount_text = countFormat(likeCount);
    const commentCount_text = countFormat(commentCount);

    return (
      <View style={styles.footerContainer}>
        {prevRoute == 'CheckInSetting' ? null : (
          <View style={styles.rowContainer}>
            <View style={styles.rowSubContainer}>
              <TouchableOpacity
                onPress={this.onCommentPress}
                // disabled={!commentTouchable}
              >
                <View style={styles.IconContainer}>
                  <MaterialIcons
                    name="comment-outline"
                    size={25}
                    color={priority > 0 ? 'black' : theme.iconColor.color}
                  />
                  {commentCount == 0 ? null : (
                    <Text
                      style={[
                        styles.IconText,
                        {color: priority > 0 ? 'black' : theme.textColor.color},
                      ]}>
                      {commentCount_text}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onRespondPost('like')}
                disabled={loading}>
                <View style={styles.IconContainer}>
                  {loading && pressedButton == 'like' ? (
                    <ActivityIndicator animating={true} color={'grey'} />
                  ) : (
                    <MaterialIcons
                      name={liked ? 'heart' : 'heart-outline'}
                      size={25}
                      style={
                        liked
                          ? {color: '#e84118'}
                          : {
                              color:
                                priority > 0 ? 'black' : theme.iconColor.color,
                            }
                      }
                    />
                  )}

                  {likeCount == 0 ? null : (
                    <Text
                      style={[
                        styles.IconText,
                        {color: priority > 0 ? 'black' : theme.textColor.color},
                      ]}>
                      {likeCount_text}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {type == 'task' ? (
          parseInt(taskExpiration) <= Date.now() &&
          taskResponse != 'completed' ? (
            <View
              style={[
                styles.rowContainer,
                {backgroundColor: 'grey', height: 40},
              ]}>
              <View style={styles.viewButton}>
                <Text style={styles.textStyle}>Expired</Text>
              </View>
            </View>
          ) : currentUserAuth == null ? (
            <View
              style={[
                styles.rowContainer,
                {backgroundColor: '#2ed573', height: 40},
              ]}>
              <TouchableOpacity onPress={() => onViewButtonPress()}>
                <View style={styles.viewButton}>
                  <Text style={styles.textStyle}>View</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : taskResponse == 'completed' ? (
            <View
              style={[
                styles.rowContainer,
                {backgroundColor: '#6ab04c', height: 40},
              ]}>
              <TouchableOpacity disabled={true}>
                <View style={styles.viewButton}>
                  <Text style={styles.textStyle}>Completed</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{width: '100%'}}>
              <View
                style={[
                  styles.rowContainer,
                  {justifyContent: 'space-evenly', height: 40},
                ]}>
                {taskResponse == 'confirm' ? (
                  <TouchableOpacity
                    onPress={() => onRespondPost('verify')}
                    disabled={currentUserAuth == null}>
                    <View
                      style={[
                        styles.textContainer,
                        {
                          backgroundColor:
                            currentUserAuth == null ? 'grey' : '#f39c12',
                        },
                      ]}>
                      <Text style={styles.textStyle}>Verify</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={
                      taskResponse == 'confirm' || currentUserAuth == null
                    }
                    onPress={() => onRespondPost('confirm')}>
                    <View
                      style={[
                        styles.textContainer,
                        {
                          backgroundColor:
                            taskResponse == 'confirm' || currentUserAuth == null
                              ? 'grey'
                              : '#1e90ff',
                        },
                      ]}>
                      {loading && pressedButton == 'confirm' ? (
                        <ActivityIndicator animating={true} color={'white'} />
                      ) : (
                        <Text style={styles.textStyle}>{confirmButton}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  disabled={taskResponse == 'deny' || currentUserAuth == null}
                  onPress={() => onRespondPost('deny')}>
                  <View
                    style={[
                      styles.textContainer,
                      {
                        backgroundColor:
                          taskResponse == 'deny' || currentUserAuth == null
                            ? 'grey'
                            : '#EA2027',
                      },
                    ]}>
                    {loading && pressedButton == 'deny' ? (
                      <ActivityIndicator animating={true} color={'white'} />
                    ) : (
                      <Text style={styles.textStyle}>{denyButton}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={[styles.rowContainer, {height: 25, width: '100%'}]}>
                <Text
                  style={{
                    color: priority > 0 ? 'black' : theme.textColor.color,
                  }}>
                  {dateConversion(taskExpiration, 'expirationDisplay')}
                </Text>
              </View>
            </View>
          )
        ) : type == 'event' ? (
          <View style={[{width: '100%'}]}>
            <View
              style={[
                styles.rowContainer,
                {
                  justifyContent: 'space-evenly',
                  backgroundColor,
                },
              ]}>
              <View
                style={[
                  styles.textContainer,
                  {
                    borderRightWidth: StyleSheet.hairlineWidth,
                    borderRightColor: 'grey',
                  },
                ]}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontWeight: '500',
                      color: priority > 0 ? 'black' : theme.textColor.color,
                    },
                  ]}>
                  {dateConversion(start, 'event')}
                </Text>
              </View>

              <View style={[styles.textContainer]}>
                <Text
                  style={[
                    styles.textStyle,
                    {
                      fontWeight: '500',
                      color: priority > 0 ? 'black' : theme.textColor.color,
                    },
                  ]}>
                  {dateConversion(end, 'event')}
                </Text>
              </View>
            </View>
            {locationDescription ? (
              <View style={styles.locationDescriptionContainer}>
                <Text
                  style={[
                    {
                      textAlign: 'center',
                      color: priority > 0 ? 'black' : theme.textColor.color,
                    },
                  ]}>
                  {locationDescription}
                </Text>
                {distance <= 5 && distance ? (
                  <Text
                    style={[
                      {
                        textAlign: 'center',
                        color: priority > 0 ? 'black' : theme.textColor.color,
                        marginTop: 5
                      },
                    ]}>
                    {distance} miles away
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 0.6 * width,
    marginLeft: 0.125 * width,
  },
  IconContainer: {
    width: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  IconText: {
    marginLeft: 5,
  },
  textContainer: {
    width: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    // borderWidth: StyleSheet.hairlineWidth
  },
  textStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewButton: {
    width: width,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationDescriptionContainer: {
    paddingHorizontal: 5,
    paddingBottom: 7,
  },
});
