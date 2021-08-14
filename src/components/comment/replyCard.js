import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import ReplyProfile from './ReplyProfile';
import ReplyUsername from './ReplyUsername';
import ReplyFooter from './ReplyFooter';
import ParsedText from 'react-native-parsed-text';
import {
  onUrlPress,
  onLinkPhoneLongPress,
  renderText,
  onPhonePress,
  onEmailPress,
} from '../chat/render';

export default class ReplyCard extends React.Component {
  state = {
    loading: false,
    ...this.props.item,
  };

  onReplyLike = async () => {
    const {onReplyLike} = this.props;
    const {id} = this.state;
    this.setState({loading: true});
    await onReplyLike(id);
    this.setState({loading: false});

    this.setState(prevState => {
      return {
        ...prevState,
        liked: !prevState.liked,
        likeCount: prevState.liked
          ? prevState.likeCount - 1
          : prevState.likeCount + 1,
      };
    });
  };

  onOptionToggle = () => {
    const {user, id} = this.state;
    const {onOptionToggle} = this.props;
    onOptionToggle({commentId: id, userId: user.id});
  };

  render() {
    const {
      loading,
      liked,
      likeCount,
      id,
      content,
      createdAt,
      user,
    } = this.state;
    const {
      onReplyPress,
      commentId,
      _actionSheetRef,
      onAtUserNGroupHightlightPress,
    } = this.props;
    const {icon} = user;

    return (
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <ReplyProfile icon={icon} />

          <View style={styles.rightContainer}>
            <ReplyUsername createdAt={createdAt} user={user} />

            <View style={styles.replyContainer}>
              <ParsedText
                style={styles.replyStyle}
                parse={[
                  {
                    type: 'url',
                    style: {color: '#1e90ff'},
                    onPress: onUrlPress,
                    onLongPress: url =>
                      onLinkPhoneLongPress({type: 'url', content: url}),
                  },
                  {
                    type: 'phone',
                    style: {color: '#1e90ff'},
                    onPress: phone => onPhonePress({phone, ..._actionSheetRef}),
                    onLongPress: phone =>
                      onLinkPhoneLongPress({type: 'phone', content: phone}),
                  },
                  {
                    type: 'email',
                    style: {color: '#1e90ff'},
                    onPress: onEmailPress,
                    onLongPress: email =>
                      onLinkPhoneLongPress({type: 'email', content: email}),
                  },
                  {
                    pattern: /\[(@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
                    style: {color: '#1e90ff'},
                    renderText: renderText,
                  },
                  {
                    pattern: /\[(g@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
                    style: {color: '#1e90ff', fontWeight: '500'},
                    renderText: renderText,
                    onPress: m => onAtUserNGroupHightlightPress(m),
                  },
                ]}
                childrenProps={{allowFontScaling: false}}>
                {content}
              </ParsedText>
            </View>

            <ReplyFooter
              loading={loading}
              onReplyLike={this.onReplyLike}
              liked={liked}
              likeCount={likeCount}
              onOptionToggle={this.onOptionToggle}
              onReplyPress={onReplyPress}
              commentId={commentId}
              user={user}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // minHeight: 100,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  rightContainer: {
    width: '85%',
  },
  replyContainer: {
    width: '100%',
  },
  replyStyle: {
    lineHeight: 20,
  },
});
