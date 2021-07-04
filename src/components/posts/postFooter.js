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

const {width} = Dimensions.get('screen');

export default class PostFooter extends React.Component {
  onCommentPress = () => {
    const {navigation, postId} = this.props;
    navigation.navigate('Comment', {
      postId: postId,
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
    } = this.props;

    const likeCount_text = countFormat(likeCount);
    const commentCount_text = countFormat(commentCount);

    return (
      <View style={styles.footerContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.rowSubContainer}>
            <TouchableOpacity
              onPress={this.onCommentPress}
              // disabled={!commentTouchable}
            >
              <View style={styles.IconContainer}>
                <MaterialIcons name="comment-outline" size={25} />
                {commentCount == 0 ? null : (
                  <Text style={styles.IconText}>{commentCount_text}</Text>
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
                    style={liked ? {color: '#e84118'} : null}
                  />
                )}

                {likeCount == 0 ? null : (
                  <Text style={styles.IconText}>{likeCount_text}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {type == 'task' ? (
          currentUserAuth == null ? (
            <View
              style={[
                styles.rowContainer,
                {backgroundColor: '#2ed573', height: 40},
              ]}>
              <TouchableOpacity onPress={onViewButtonPress}>
                <View style={styles.viewButton}>
                  <Text style={styles.textStyle}>View</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : taskResponse == 'verified' ? (
            <View
              style={[
                styles.rowContainer,
                {backgroundColor: 'grey', height: 40},
              ]}>
              <TouchableOpacity disabled={true}>
                <View style={styles.viewButton}>
                  <Text style={styles.textStyle}>Verified</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
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
          )
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    minHeight: 50,
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
});
