import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    return (
      <View style={footerContainer}>
        <TouchableOpacity
          onPress={this.onCommentPress}
          // disabled={!commentTouchable}
          >
          <View style={IconContainer}>
            <MaterialIcons name="comment-outline" size={25} />
            <Text style={IconText}>{commentCount}</Text>
          </View>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator animating={true} />
        ) : (
          <TouchableOpacity onPress={onLikePress}>
            <View style={IconContainer}>
              <MaterialIcons
                name={liked ? 'heart' : 'heart-outline'}
                size={25}
                style={liked ? {color: '#e84118'} : null}
              />
              <Text style={IconText}>{likeCount || 0}</Text>
            </View>
          </TouchableOpacity>
        )}
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
    justifyContent: 'space-evenly',
  },
  IconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  IconText: {
    marginLeft: 5,
  },
});
