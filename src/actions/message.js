import {getChatMessageQuery, sendMessageMutation, chatMessageSubscription} from './query/messageQuery';
import {http, http_upload} from '../../server_config'
// import { useSubscription, useQuery } from '@apollo/client'

export const getChatMessage = request => {
  const {chatId, token, pointer} = request;

  return async function(dispatch) {
    const input = {
      chatId: chatId,
      pointer: pointer,
    };

    const graphql = {
      query: getChatMessageQuery,
      variables: {
        input: input,
      },
    };

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return result.data.getChatMessage;
  };
};

// const getChatMessageReducer = data => {
//   return {
//     type: 'getChatMessage',
//     i: data,
//   };
// };

export const sendMessage = request => {
  const {token, content, chatId, media} = request;

  return async function(dispatch) {
    let media_url = null
    if (media != null){
      const {type, data} = media
      const mediaForm = new FormData()
      mediaForm.append('fileType', type)
      mediaForm.append('fileData', data)
      mediaForm.append('fileCategory', 'messagePhotos')
      const mediaUpload = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: mediaForm
      })
      if (mediaUpload.status == 500){
        alert('uploading photo failed')
        return 1
      }

      const mediaData = await mediaUpload.json()
      media_url = mediaData
    }

    const input = {
      content,
      chatId,
      media: media_url,
    };

    const graphql = {
      query: sendMessageMutation,
      variables: {
        input: input,
      },
    };

    const req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return 0;
  };
};
