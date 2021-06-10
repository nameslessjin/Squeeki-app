import React from 'react';
import {TouchableOpacity, Linking, Share, Platform, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';
import ImageModal from 'react-native-image-modal';
import {handleDownload} from '../../utils/imagePicker';

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
  const {_id, image} = giftchat.currentMessage

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
          onMessageImageLongPress({actionSheet, url: image, messageId: _id, chatId, auth, updateUserMessage})
        }
      />
    </View>
  );
};

const onMessageImageLongPress = props => {
  const {actionSheet, url, updateUserMessage, messageId, auth, chatId} = props;
  const options = ['Copy', 'Download', 'Delete' ,'Cancel'];
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
  const {message, is_dm} = props;
  const {read_count} = message.status

  return is_dm && read_count > 1 ? (
    <View style={{width: 15, aspectRatio: 1, marginRight: 10}}>
      <MaterialIcons
        name={'check-circle-outline'}
        size={15}
        color={'#ecf0f1'}
      />
    </View>
  ) : null;
};
