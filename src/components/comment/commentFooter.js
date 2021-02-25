import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CommentFooter extends React.Component {
  render() {
    const {
      loading,
      onCommentLike,
      liked,
      likeCount,
      onOptionToggle,
      onCommentReplyPress,
      commentId
    } = this.props;

    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator animating={true} />
        ) : (
          <TouchableOpacity onPress={onCommentLike}>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={liked ? 'heart' : 'heart-outline'}
                size={25}
                style={{color: liked ? '#e84118' : null}}
              />
              <Text style={styles.iconText}>{likeCount}</Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.replyButton} onPress={() => onCommentReplyPress(commentId)}>
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
      marginHorizontal: 10
  },
  replyButtonText: {
      fontWeight: '500',
      color: '#2c3e50'
  }
});
