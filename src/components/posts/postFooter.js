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
import {countFormat} from '../../utils/format'

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
      onLikePress,
      liked,
      loading,
    } = this.props;

    const {footerContainer, IconContainer, IconText} = styles;

    const likeCount_text = countFormat(likeCount)
    const commentCount_text = countFormat(commentCount)

    return (
      <View style={footerContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 0.6 * width,
            marginLeft: 0.125 * width,
          }}>
          <TouchableOpacity
            onPress={this.onCommentPress}
            // disabled={!commentTouchable}
          >
            <View style={IconContainer}>
              <MaterialIcons name="comment-outline" size={25} />
              {commentCount == 0 ? null : (
                <Text style={IconText}>{commentCount_text}</Text>
              )}
            </View>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator animating={true} color={'grey'} />
          ) : (
            <TouchableOpacity onPress={onLikePress}>
              <View style={IconContainer}>
                <MaterialIcons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={25}
                  style={liked ? {color: '#e84118'} : null}
                />

                {likeCount == 0 ? null : <Text style={IconText}>{likeCount_text}</Text>}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  IconContainer: {
    width: 70,
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  IconText: {
    marginLeft: 5,
  },
});
