import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import {color} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { countFormat } from '../../utils/format'

export default class CommentFooter extends React.Component {
  render() {
    const {
      loading,
      onCommentLike,
      liked,
      likeCount,
      onOptionToggle,
      onCommentReplyPress,
      commentId,
    } = this.props;

    const likeCount_text = countFormat(likeCount)  

    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator animating={true} color={'grey'}/>
        ) : (
          <TouchableOpacity onPress={onCommentLike}>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={liked ? 'heart' : 'heart-outline'}
                size={25}
                style={{color: liked ? '#e84118' : 'grey'}}
              />
              {likeCount == 0 ? null : (
                <Text
                  style={styles.iconText}>
                  {likeCount_text}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => onCommentReplyPress(commentId)}>
          <Text style={styles.replyButtonText}>REPLY</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOptionToggle}>
          <View style={styles.iconSeparation}>
            <MaterialIcons name={'dots-horizontal'} size={25} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    marginLeft: 5,
  },
  iconSeparation: {
    marginLeft: 0,
  },
  replyButton: {
    paddingHorizontal: 3,
    marginHorizontal: 10,
  },
  replyButtonText: {
    fontWeight: '500',
    color: '#2c3e50',
  },
});
