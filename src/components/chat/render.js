import React from 'react';
import {
  TouchableOpacity,
  Linking,
  Share,
  Platform,
  View,
  Dimensions,
  Text,
  FlatList,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Composer,
  Bubble,
  MessageContainer,
  MessageText,
  Time,
  InputToolbar,
} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';
import ImageModal from 'react-native-image-modal';
import {handleDownload} from '../../utils/imagePicker';
import {singleDefaultIcon} from '../../utils/defaultIcon';
import SendButton from '../comment/sendButton';
import AtList from '../comment/AtList';

const {width} = Dimensions.get('screen');

const extractKey = ({userId, groupId}) => (userId ? userId : groupId);

// not using right now
export const RenderSend = props => {
  const {text, onSend} = props;
  return (
    <TouchableOpacity
      onPress={onSend}
      style={{marginBottom: 10, marginRight: 10}}
      disabled={text.length == 0 || text.length > 5000}>
      <MaterialIcons
        size={30}
        name={'arrow-up-drop-circle'}
        color={text.length == 0 || text.length > 5000 ? 'grey' : '#EA2027'}
      />
    </TouchableOpacity>
  );
};

export const RenderActions = props => {
  const {onActionPress, theme} = props;

  return (
    <TouchableOpacity onPress={onActionPress}>
      <View
        style={{
          height: 35,
          width: 35,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 5,
        }}>
        <MaterialIcons size={35} name={'plus'} color={theme.iconColor.color} />
      </View>
    </TouchableOpacity>
  );
};

export const OnLongPress = props => {
  const {updateUserMessage, auth, id, context, message} = props;

  if (message.text.length > 0) {
    const options = ['Copy', 'Delete', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(message.text);
            break;
          case 1:
            const request = {
              token: auth.token,
              messageId: message._id,
              chatId: id,
              status: 'delete',
            };
            updateUserMessage(request);

            break;
        }
      },
    );
  }
};

export const onUrlPress = url => {
  const WWW_URL_PATTERN = /^www\./i;
  // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
  // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
  if (WWW_URL_PATTERN.test(url)) {
    onUrlPress(`http://${url}`);
  } else {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.error('No Handler for URL:', url);
      } else {
        Linking.openURL(url);
      }
    });
  }
};

export const onPhonePress = props => {
  const {phone, getContext} = props;

  const options = ['Call', 'Text', 'Cancel'];
  const cancelButtonIndex = options.length - 1;
  getContext().showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
    },
    buttonIndex => {
      switch (buttonIndex) {
        case 0:
          Communications.phonecall(phone, true);
          break;
        case 1:
          Communications.text(phone);
          break;
        default:
          break;
      }
    },
  );
};

export const onEmailPress = email =>
  Communications.email([email], null, null, null, null);

export const onLinkPhoneLongPress = async props => {
  const {type, content} = props;
  try {
    let result = {};
    if (type == 'url') {
      result =
        Platform.OS == 'android'
          ? await Share.share({
              message: content,
            })
          : await Share.share({
              url: content,
            });
    } else {
      result = await Share.share({message: content});
    }

    if (result.action == Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type
      } else {
        //shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch {
    alert(error.message);
  }
};

export const RenderMessageImage = props => {
  const {giftchat, actionSheet, chatId, auth, updateUserMessage} = props;
  const {_id, image} = giftchat.currentMessage;

  return (
    <View style={{borderRadius: 15, paddingBottom: 2}}>
      <ImageModal
        resizeMode="cover"
        style={{
          width: 200,
          aspectRatio: 1,
          padding: 6,
          borderRadius: 15,
        }}
        source={{uri: image}}
        modalImageResizeMode={'contain'}
        onLongPressOriginImage={() =>
          onMessageImageLongPress({
            actionSheet,
            url: image,
            messageId: _id,
            chatId,
            auth,
            updateUserMessage,
          })
        }
      />
    </View>
  );
};

const onMessageImageLongPress = props => {
  const {actionSheet, url, updateUserMessage, messageId, auth, chatId} = props;
  const options = ['Copy', 'Save', 'Delete', 'Cancel'];
  const cancelButtonIndex = options.length - 1;
  actionSheet.getContext().showActionSheetWithOptions(
    {
      options,
      cancelButtonIndex,
    },
    buttonIndex => {
      switch (buttonIndex) {
        case 0:
          handleDownload({url, is_download: false});
          break;
        case 1:
          handleDownload({url, is_download: true});
          break;
        case 2:
          const request = {
            token: auth.token,
            messageId,
            chatId,
            status: 'delete',
          };
          updateUserMessage(request);
        default:
          break;
      }
    },
  );
};

export const RenderTicks = props => {
  const {message, is_dm, isSelf} = props;
  const {read_count} = message.status;
  return isSelf && is_dm && read_count > 1 ? (
    <View
      style={{
        width: 15,
        aspectRatio: 1,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <MaterialIcons
        name={'check-circle-outline'}
        size={15}
        color={'#dfe4ea'}
      />
    </View>
  ) : null;
};

// not using right now
const renderAtUserItem = ({item, onAtUserNGroupPress, theme}) => {
  const {userId, displayName, username, icon, groupname, groupId} = item;
  const input = {
    id: userId ? userId : groupId,
    name: username ? username : groupname,
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => onAtUserNGroupPress(input, userId ? 'user' : 'group')}>
      <View
        style={{
          minHeight: 50,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 5,
        }}>
        <View
          style={{
            height: 50,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icon ? {uri: icon} : singleDefaultIcon()}
            style={{height: 40, aspectRatio: 1, borderRadius: 20}}
          />
        </View>
        <View
          style={{
            minHeight: 50,
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: width - 150,
          }}>
          <Text style={[{fontSize: 15}, theme.textColor]}>{displayName}</Text>
          <Text style={{color: 'grey', fontSize: 13}}>
            {username ? `@${username}` : `g@${groupname}`}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// not using right now
export const renderComposer = props => {
  const {atSearchResult, composerHeight, onAtUserNGroupPress, theme} = props;
  return (
    <React.Fragment>
      {atSearchResult.length > 0 ? (
        <View
          style={[
            {
              maxHeight: 150,
              backgroundColor: 'white',
              position: 'absolute',
              bottom: composerHeight + 7,
              width: width - 85,
              borderWidth: 0.5,
              left: 42.5,
              borderColor: 'silver',
            },
            theme.backgroundColor,
            theme.borderColor,
            {backgroundColor: 'yellow'},
          ]}>
          <FlatList
            style={{maxHeight: 150, width: width - 85}}
            data={atSearchResult}
            renderItem={props =>
              renderAtUserItem({...props, onAtUserNGroupPress, theme})
            }
            keyExtractor={extractKey}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps={'handled'}
          />
        </View>
      ) : null}
      <Composer
        {...props}
        textInputStyle={[
          {
            width: width - 85,
          },
          theme.textColor,
        ]}
      />
    </React.Fragment>
  );
};

export const renderBubble = props => {
  const {currentMessage} = props;
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: currentMessage.image ? 'transparent' : '#1e90ff',
        },
        left: {backgroundColor: '#a4b0be'},
      }}
    />
  );
};

export const renderText = (matchingString, matches) => {
  if (matches[1].substr(1, matches[1].length) == matches[2]) {
    return matches[1];
  }

  return `${matches[1]}(${matches[2]})`;
};

export const renderMessageContainer = props => {
  return <MessageContainer {...props} />;
};

export const renderMessageText = props => {
  return (
    <MessageText
      {...props}
      textStyle={{right: {color: 'white'}, left: {color: 'white'}}}
      linkStyle={{
        right: {color: 'white', textDecorationLine: 'none'},
        left: {color: '#1e90ff', textDecorationLine: 'none'},
      }}
    />
  );
};

export const renderTime = props => {
  return (
    <Time
      {...props}
      timeTextStyle={{right: {color: '#dfe4ea'}, left: {color: '#dfe4ea'}}}
    />
  );
};

export const renderInputToolBar = props => {
  const {
    theme,
    onActionPress,
    text,
    onInputTextChanged,
    onSend,
    inputHeight,
    inputHeightAdjustment,
    onAtUserNGroupPress,
    atListShow,
    barHeight,
    atSearchResult,
  } = props;

  const formatSearchResult = atSearchResult.map(r => {
    if (r.userId) {
      return {
        username: r.username,
        iconUrl: r.icon,
        displayName: r.displayName,
        id: r.userId,
      };
    }
    if (r.groupId) {
      return {
        groupname: r.groupname,
        iconUrl: r.icon,
        displayName: r.displayName,
        id: r.groupId,
      };
    }
    return r;
  });
  return (
    <View
      style={[
        styles.inputBarContainer,
        theme.backgroundColor,
        // {backgroundColor: 'yellow'},
      ]}>
      {RenderActions({theme, onActionPress})}
      <View
        style={[
          styles.textInputContainer,
          {width: width - 80, height: Math.max(35, barHeight)},
        ]}>
        {atListShow ? (
          <AtList
            theme={theme}
            onAtPress={onAtUserNGroupPress}
            atSearchResult={formatSearchResult}
          />
        ) : null}
        <TextInput
          style={[styles.textInput, theme.textColor]}
          placeholder={'Start chatting...'}
          placeholderTextColor={'#7f8fa6'}
          multiline={true}
          maxLength={500}
          value={text}
          onChangeText={onInputTextChanged}
          onContentSizeChange={e => inputHeightAdjustment(e)}
        />
      </View>
      <SendButton
        sent={false}
        disabled={!(text.length >= 1 && text.length <= 500)}
        inputHeight={inputHeight}
        onSend={onSend}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputBarContainer: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    // position: 'absolute',
    bottom: Platform.OS == 'ios' ? 55 : 20,
  },
  textInputContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 1,
    // backgroundColor: 'yellow'
  },
  textInput: {
    maxHeight: 150,
    fontSize: 16,
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    borderRadius: 10,
    padding: 5,
    paddingLeft: 8,
    // backgroundColor: 'blue',
  },
});
