import {
  getChatMessageQuery,
  sendMessageMutation,
  chatMessageSubscription,
  updateUserMessageMutation,
} from './query/messageQuery';
import {http_upload} from '../../server_config';
import {httpCall} from './utils/httpCall';
// import { useSubscription, useQuery } from '@apollo/client'

export const getChatMessage = request => {
  const {chatId, token, pointer, is_dm} = request;

  return async function(dispatch) {
    const input = {
      chatId,
      pointer,
      is_dm
    };

    const graphql = {
      query: getChatMessageQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.getChatMessage;
  };
};


export const sendMessage = request => {
  const {token, content, chatId, media, status} = request;

  return async function(dispatch) {
    let media_url = null;
    if (media != null) {
      const {type, data} = media;
      const mediaForm = new FormData();
      mediaForm.append('fileType', type);
      mediaForm.append('fileData', data);
      mediaForm.append('fileCategory', 'messagePhotos');
      const mediaUpload = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: mediaForm,
      });
      if (mediaUpload.status == 500) {
        alert('uploading photo failed');
        return 1;
      }

      const mediaData = await mediaUpload.json();
      media_url = mediaData;
    }

    const input = {
      content,
      chatId,
      media: media_url,
      status,
    };

    const graphql = {
      query: sendMessageMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const updateUserMessage = request => {
  const {token, messageId, status, chatId} = request;

  return async function(dispatch) {
    const input = {
      messageId,
      status,
      chatId,
    };

    const graphql = {
      query: updateUserMessageMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return 0;
  };
};
