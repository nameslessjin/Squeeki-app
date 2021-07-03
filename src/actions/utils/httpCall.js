import {http, http_upload} from '../../../server_config';

export const httpCall = async (token, graphql) => {
  let req = {};

  if (token != null) {
    req = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });
  } else {
    req = await fetch(http, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });
  }

  const result = await req.json();

  return result;
};

export const httpUpload = async (token, file, fileCategory) => {
  let fileData = new FormData();
  fileData.append('fileType', file.type);
  fileData.append('fileData', file.data);
  fileData.append('fileCategory', fileCategory);

  const uploadRequest = await fetch(http_upload, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data',
    },
    body: fileData,
  });
  if (uploadRequest == 500) {
    alert('Upload file failed');
    return 1;
  }
  fileData = await uploadRequest.json();
  return fileData;
};
