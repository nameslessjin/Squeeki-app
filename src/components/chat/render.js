import React from 'react';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';

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
