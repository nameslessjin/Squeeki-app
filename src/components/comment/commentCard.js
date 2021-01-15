import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {dateConversion} from '../../utils/time';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CommentCard extends React.Component {
  state = {
    icon_option: 'emoticon-cool-outline',
    comment: this.props.comment,
    loading: false,
    // likeCount: this.props.comment.likeCount,
    // liked: this.props.comment.liked,
    ...this.props.comment
  };

  componentDidMount() {
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]});
  }

  onCommentLike = async () => {
    const {onCommentLike, comment} = this.props;
    const {liked, likeCount} = this.state.comment;

    this.setState({loading: true});
    await onCommentLike(comment.id);
    this.setState({loading: false});

    this.setState(prevState => {
      return {
        ...prevState,
        liked: !prevState.liked,
        likeCount: prevState.liked ? prevState.likeCount - 1 : prevState.likeCount + 1
      }
    })
  };

  onOptionToggle = () => {
    const {user, id} = this.state.comment;
    const {onOptionToggle} = this.props;
    onOptionToggle({commentId: id, userId: user.id});
  };

  render() {
    const {comment, icon_option, loading, liked, likeCount} = this.state;
    const {
      container,
      LeftContainer,
      usernameContainer,
      commentContainer,
      rightContainer,
      userIcon,
      usernameStyle,
      commentStyle,
      timeStyle,
      displayNameStyle,
    } = styles;

    const {user} = comment;
    const {icon} = user;
    const date = dateConversion(comment.createdAt);

    return (
      <TouchableWithoutFeedback>
        <View style={container}>
          <View style={LeftContainer}>
            {icon != null ? (
              <Image source={{uri: icon.uri}} style={userIcon} />
            ) : (
              <MaterialIcons name={icon_option} size={40} />
            )}
          </View>

          <View style={rightContainer}>
            <View style={usernameContainer}>
              <View>
                <Text style={displayNameStyle}>{user.displayName}</Text>
                <Text style={usernameStyle}>{user.username}</Text>
              </View>
              <Text style={timeStyle}>{date}</Text>
            </View>
            <View style={commentContainer}>
              <Text style={commentStyle}>{comment.content}</Text>
            </View>
            <View style={styles.footContainer}>
              {loading ? (
                <ActivityIndicator animating={true} />
              ) : (
                <TouchableOpacity onPress={this.onCommentLike}>
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
              <TouchableOpacity onPress={() => this.onOptionToggle()}>
                <View style={styles.iconSeparation}>
                  <MaterialIcons name={'dots-horizontal'} size={25} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 200,
    minHeight: 100,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  userIcon: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
  },
  LeftContainer: {
    width: '15%',
    maxHeight: 200,
    alignItems: 'flex-start',
  },
  usernameContainer: {
    width: '100%',
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 3,
  },
  displayNameStyle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  usernameStyle: {
    fontSize: 11,
    color: '#95a5a6',
  },
  commentContainer: {
    width: '100%',
    maxHeight: 100,
  },
  rightContainer: {
    width: '85%',
    maxHeight: 200,
  },
  commentStyle: {
    lineHeight: 20,
  },
  timeStyle: {
    marginLeft: 20,
    color: '#95a5a6',
  },
  footContainer: {
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
    marginLeft: 10,
  },
});
