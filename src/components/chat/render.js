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
} from 'react-native';
import {
  Composer,
  Bubble,
  MessageContainer,
  MessageText,
  Time,
} from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';
import ImageModal from 'react-native-image-modal';
import {handleDownload} from '../../utils/imagePicker';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

const extractKey = ({userId}) => userId;

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
  const {onActionPress, bottomOffset} = props;

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        marginBottom: bottomOffset - 23,
      }}
      onPress={onActionPress}>
      <MaterialIcons size={30} name={'plus'} />
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
  console.log(props);
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
        color={'#747d8c'}
      />
    </View>
  ) : null;
};

const renderAtUserItem = ({item, onAtUserPress}) => {
  const {userId, displayName, username, icon} = item;
  
  const user = {
    userId,
    username,
  };

  return (
    <TouchableWithoutFeedback onPress={() => onAtUserPress(user)}>
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
          <Text style={{color: 'black', fontSize: 15}}>{displayName}</Text>
          <Text style={{color: 'grey', fontSize: 13}}>@{username}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const renderComposer = props => {
  const {atSearchResult, composerHeight, onAtUserPress} = props;

  return (
    <React.Fragment>
      {atSearchResult.length > 0 ? (
        <View
          style={{
            maxHeight: 150,
            backgroundColor: 'white',
            position: 'absolute',
            bottom: composerHeight + 7,
            width: width - 85,
            borderWidth: 0.5,
            left: 42.5,
            borderColor: 'silver',
          }}>
          <FlatList
            style={{maxHeight: 150, width: width - 85}}
            data={atSearchResult}
            renderItem={props => renderAtUserItem({...props, onAtUserPress})}
            keyExtractor={extractKey}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps={'handled'}
          />
        </View>
      ) : null}
      <Composer
        {...props}
        textInputStyle={{
          width: width - 85,
        }}
      />
    </React.Fragment>
  );
};

export const renderBubble = props => {
  return (
    <Bubble {...props} wrapperStyle={{right: {backgroundColor: '#ced6e0'}}} />
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
      textStyle={{right: {color: 'black'}}}
      linkStyle={{
        left: {color: '#1e90ff', textDecorationLine: 'none'},
        right: {color: '#1e90ff', textDecorationLine: 'none'},
      }}
    />
  );
};

export const renderTime = props => {
  return <Time {...props} timeTextStyle={{right: {color: '#747d8c'}}} />;
};
