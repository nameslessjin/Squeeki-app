import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  TouchableHighlight,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {chatTimeFormat} from '../../utils/time';
import {countFormat} from '../../utils/format';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';

const {width, height} = Dimensions.get('screen');

export default class ChatList extends React.Component {
  componentDidMount() {
    this._ref = undefined;
  }

  onChatPress = item => {
    const {onChatPress} = this.props;

    this.onCloseAllRows();

    onChatPress(item);
  };

  onCloseAllRows = () => {
    const {chat} = this.props;

    if (this._ref) {
      chat.forEach(c => {
        this._ref._rows[c.id].closeRow();
      });
    }
  };

  renderItem = ({item}) => {
    const {
      name,
      icon,
      rank_req,
      id,
      last_message,
      unread_message_count,
      available,
      is_pinned,
      notification,
    } = item;

    if (id == 'empty') {
      if (this._ref) {
        return (
          <TouchableWithoutFeedback onPress={this.onCloseAllRows}>
            <View
              style={{
                width: '100%',
                height: this._ref.props.extraData.heightDifference,
              }}
            />
          </TouchableWithoutFeedback>
        );
      }
      return <View />;
    }

    const unread_message_count_text = countFormat(unread_message_count);

    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];

    const icon_option = icon_options[random];

    let message_preview =
      last_message == null
        ? 'Not messages yet.'
        : last_message.content.length == 0
        ? `${last_message.username}: [Photo/Video]`
        : last_message.system
        ? last_message.content
        : `${last_message.username}: ${last_message.content}`;

    let allow_to_join = true;
    if (rank_req != null) {
      if (!available) {
        message_preview = `This chat requires rank ${rank_req} or above`;
        allow_to_join = false;
      }
    }

    let backgroundColor = 'white';
    if (allow_to_join) {
      if (is_pinned) {
        backgroundColor = '#fab1a0';
      }
    } else {
      backgroundColor = 'silver';
    }

    return (
      <View style={[styles.chat_container, {backgroundColor: backgroundColor}]}>
        <TouchableOpacity
          onPress={() => this.onChatPress(item)}
          disabled={!allow_to_join}>
          <View style={styles.chat_sub_container}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
              }}>
              <View style={styles.imgHolder}>
                {icon != null ? (
                  <Image source={{uri: icon.uri}} style={styles.imageStyle} />
                ) : (
                  <MaterialIcons name={icon_option} size={width * 0.18} />
                )}
              </View>

              <View style={styles.rightStyle}>
                <View style={styles.chat_right_up_container}>
                  <View style={styles.chat_name_container}>
                    <Text style={styles.chat_name_style} numberOfLines={2}>
                      {name}
                    </Text>
                  </View>
                  <View style={styles.chat_time_container}>
                    <Text style={{color: 'grey', fontSize: width * 0.034}}>
                      {/* 12:58 AM */}
                      {last_message == null
                        ? null
                        : chatTimeFormat(last_message.createdAt)}
                    </Text>
                  </View>
                </View>
                <View style={styles.chat_right_bottom_container}>
                  <View style={{height: '100%', width: '85%', paddingLeft: 3}}>
                    <Text style={{color: 'grey'}} numberOfLines={2}>
                      {message_preview}
                    </Text>
                  </View>
                  <View style={styles.unread_message_container}>
                    {unread_message_count == 0 ? null : (
                      <View style={styles.unread_message}>
                        <Text style={{color: 'white', fontSize: width * 0.034}}>
                          {unread_message_count_text}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  onHiddenItemPress = (chatId, type) => {
    const {changeUserChatNotification, updatePinChat} = this.props;

    if (type == 'mute') {
      changeUserChatNotification(chatId);
    }

    if (type == 'pin') {
      updatePinChat(chatId);
    }
  };

  renderHiddenItem = (data, rowMap) => {
    const {rank_req, id, available, is_pinned, notification} = data.item;

    if (id == 'empty') {
      return null;
    }

    let allow_to_join = true;
    if (rank_req != null) {
      if (!available) {
        allow_to_join = false;
      }
    }

    const is_pinned_disabled = allow_to_join ? false : !is_pinned;
    const notification_disabled = allow_to_join ? false : !notification;

    return (
      <View style={styles.rowBack}>
        {/* <TouchableOpacity onPress={() => this.onHiddenItemPress(id, 'hide')}>
          <View style={[styles.hiddenItem, {backgroundColor: '#a7ecee'}]}>
            <MaterialIcons name={'eye-off'} size={30} color={'white'} />
            <Text>Hide</Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          disabled={notification_disabled}
          onPress={() => this.onHiddenItemPress(id, 'mute')}>
          <View
            style={[
              styles.hiddenItem,
              {backgroundColor: notification ? 'white' : 'red'},
            ]}>
            <MaterialIcons
              name={'bell'}
              size={30}
              color={notification ? 'red' : 'white'}
            />
            <Text style={{marginTop: 2, color: notification ? 'red' : 'white'}}>
              {notification ? 'on' : 'off'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={is_pinned_disabled}
          onPress={() => this.onHiddenItemPress(id, 'pin')}>
          <View
            style={[
              styles.hiddenItem,
              {backgroundColor: is_pinned ? 'white' : 'purple'},
            ]}>
            <MaterialIcons
              name={'pin'}
              size={30}
              color={is_pinned ? 'purple' : 'white'}
            />
            <Text style={{marginTop: 2, color: is_pinned ? 'purple' : 'white'}}>
              {is_pinned ? 'on' : 'off'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  extractKey = ({id}) => id;

  render() {
    const {onRefresh, refreshing, onEndReached, chat} = this.props;
    const occupiedHeight = 85 * chat.length;
    const heightDifference = height - occupiedHeight;
    let chatData = chat;
    if (heightDifference > 0) {
      chatData = chatData.concat({id: 'empty'});
    }

    return (
      <SwipeListView
        ref={ref => (this._ref = ref)}
        style={styles.container}
        data={chatData}
        keyExtractor={this.extractKey}
        alwaysBounceHorizontal={false}
        renderItem={this.renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        disableRightSwipe={true}
        rightOpenValue={-160}
        renderHiddenItem={this.renderHiddenItem}
        closeOnRowBeginSwipe={true}
        closeOnScroll={true}
        extraData={{heightDifference}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  chat_container: {
    width: '100%',
    height: 85,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'silver',
    paddingLeft: 8,
  },
  chat_sub_container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  imageStyle: {
    height: width * 0.18,
    aspectRatio: 1,
    borderRadius: width * 0.09,
  },
  imgHolder: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightStyle: {
    height: width * 0.18,
    width: width - 10 - width * 0.18,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // paddingTop: 5,
  },
  chat_name_style: {
    fontSize: 15,
    fontWeight: '500',
  },
  chat_name_container: {
    height: 35,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 3,
    // backgroundColor: 'green'
  },
  chat_right_up_container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxHeight: 35,
  },
  chat_right_bottom_container: {
    height: 35,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // paddingTop: 5,
  },
  chat_time_container: {
    width: '25%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 5,
  },
  unread_message_container: {
    height: '100%',
    width: '15%',
    alignItems: 'flex-end',
    paddingHorizontal: 5,
  },
  unread_message: {
    borderRadius: 50,
    backgroundColor: '#EA2027',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '55%',
    height: '51%',
    padding: 1,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  hiddenItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
    width: 80,
    backgroundColor: 'purple',
  },
});
