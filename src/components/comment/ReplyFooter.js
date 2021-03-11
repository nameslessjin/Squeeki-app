import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ReplyFooter extends React.Component {
  render() {
    const {
      loading,
      onReplyLike,
      liked,
      likeCount,
      onOptionToggle,
      onReplyPress,
      commentId,
    } = this.props;


    let likeCount_text = likeCount.toString()
    if (likeCount >= 1000) {
      likeCount_text =
        Math.floor(likeCount / 1000) +
        Math.floor(
          (likeCount -
            Math.floor(likeCount / 1000) * 1000) /
            100,
        ) /
          10 +
        'k';
    }
    
    if (likeCount >= 1000000) {
      likeCount_text =
        Math.floor(likeCount / 1000000) +
        Math.floor(
          (likeCount -
            Math.floor(likeCount / 1000000) * 1000000) /
            100000,
        ) /
          10 +
        'k';
    }

    return (
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator animating={true} />
        ) : (
          <TouchableOpacity onPress={onReplyLike}>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
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
          onPress={() => onReplyPress(commentId)}>
          <Text style={styles.replyButtonText}>REPLY</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onOptionToggle}>
          <View style={styles.iconSeparation}>
            <MaterialIcons name={'dots-horizontal'} size={20} />
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
    fontSize: 12,
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
    fontSize: 12,
  },
});
