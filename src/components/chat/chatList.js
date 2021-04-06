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
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {chatTimeFormat} from '../../utils/time';
import {countFormat} from '../../utils/format'

const {width, height} = Dimensions.get('screen');

const extractKey = ({id}) => id;

export default class ChatList extends React.Component {


  renderItem = ({item}) => {
    const {name, icon, rank_req, id, last_message, unread_message_count, available} = item;

    const unread_message_count_text = countFormat(unread_message_count) 

    const {onChatPress, userGroupAuthRank} = this.props;

    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];

    const icon_option = icon_options[random]

    let message_preview =
      last_message == null
        ? 'Not messages yet.'
        : last_message.content.length == 0
        ? `${last_message.username}: [Photo/Video]`
        : `${last_message.username}: ${last_message.content}`;

    let allow_to_join = true
    if (rank_req != null) {
      if (!available) {
        message_preview = `This chat requires rank ${rank_req} or above`;
        allow_to_join = false
      }
    }

    return (
      <View style={[styles.chat_container,{backgroundColor: allow_to_join ? 'white' : 'silver'}]}>
        <TouchableOpacity onPress={() => onChatPress(item)} disabled={!allow_to_join} >
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

  render() {
    const {onRefresh, refreshing, onEndReached, chat} = this.props;

    return (
      <FlatList
        style={styles.container}
        data={chat}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        renderItem={this.renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
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
    paddingTop: 5,
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
});
