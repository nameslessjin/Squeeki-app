import {
  getGroupPostsQuery,
  getFeedQuery,
  getPostQuery,
  createPostMutation,
  updatePostMutation,
  deletePostMutation,
  respondPostMutation,
  changePostNotificationMutation,
  reportPostMutation,
  getNominationPostQuery,
  getGroupPostForCheckInQuery,
  getPostTaskResponseQuery,
  createUpdateTaskVerifyMutation,
  getUserTaskVerificationQuery,
  manageUserTaskResponseMutation,
} from './query/postQuery';
import {http_upload} from '../../server_config';
import {httpCall, httpUpload} from './utils/httpCall';

export const getGroupPosts = data => {
  const {groupId, token, count} = data;
  return async function(dispatch) {
    const input = {
      groupId: groupId,
      count: count,
    };

    const graphql = {
      query: getGroupPostsQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }
    dispatch(getGroupPostsData(result.data.getGroupPosts));

    return 0;
  };
};

const getGroupPostsData = data => {
  return {
    type: 'getGroupPosts',
    data: data,
  };
};

export const getFeed = data => {
  const {token, count, lat, lng} = data;
  return async function(dispatch) {
    const input = {
      count,
      lat,
      lng,
    };
    const graphql = {
      query: getFeedQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    dispatch(getFeedData(result.data.getFeed));

    return 0;
  };
};

const getFeedData = data => {
  return {
    type: 'getFeed',
    data: data,
  };
};

export const getPost = data => {
  const {token, postId} = data;
  return async function(dispatch) {
    const graphql = {
      query: getPostQuery,
      variables: {
        postId: postId,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    const post = result.data.getPost;
    return post;
  };
};

export const createPost = data => {
  const {
    image,
    content,
    priority,
    priorityExpiration,
    allowComment,
    type,
    groupId,
    token,
    nomination,
    visibility,
    confirmButton,
    denyButton,
    taskExpiration,
    start,
    end,
    locationDescription,
    place_id,
    lat,
    lng,
  } = data;

  return async function(dispatch) {
    let uploadImage = null;
    if (image != null) {
      const imageData = new FormData();
      imageData.append('fileType', image.type);
      imageData.append('fileData', image.data);
      imageData.append('fileCategory', 'postImgs');

      const imagePost = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: imageData,
      });
      if (imagePost.status == 500) {
        alert('Cannot upload image.  Try again later.');
        return 1;
      }
      const imageUri = await imagePost.json();
      if (imageUri.errors) {
        return imageUri;
      }

      uploadImage = {
        uri: imageUri.url,
        width: image.width,
        height: image.height,
        name: imageUri.name,
      };
    }

    const postInput = {
      content: content,
      priority: priority,
      allowComment: allowComment,
      type: type,
      groupId: groupId,
      image: uploadImage,
      visibility,
      nomination: type == 'general' ? nomination : {},
      priorityExpiration: new Date(parseInt(priorityExpiration)),
      confirmButton: confirmButton,
      denyButton: denyButton,
      taskExpiration:
        type == 'task' ? new Date(parseInt(taskExpiration)) : null,
      start: type == 'event' ? new Date(parseInt(start)) : null,
      end: type == 'event' ? new Date(parseInt(end)) : null,
      locationDescription: type == 'event' ? locationDescription : null,
      place_id: type == 'event' ? place_id : null,
      lat: type == 'event' ? lat : null,
      lng: type == 'event' ? lng : null,
    };

    const graphql = {
      query: createPostMutation,
      variables: {
        postInput: postInput,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const updatePost = data => {
  const {updateData, origin} = data;
  const {
    token,
    id,
    groupId,
    image,
    content,
    originContent,
    priority,
    priorityExpiration,
    allowComment,
    type,
    visibility,
    confirmButton,
    denyButton,
    taskExpiration,
    start,
    end,
    locationDescription,
    place_id,
    lat,
    lng,
  } = updateData;

  return async function(dispatch) {
    let newImage = image;

    if (image != null) {
      const imageData = new FormData();
      imageData.append('fileType', image.type);
      imageData.append('fileData', image.data);
      imageData.append('fileCategory', 'postImgs');

      const imagePost = await fetch(http_upload, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: imageData,
      });
      if (imagePost.status == 500) {
        alert('Uploading image failed.  Try again later');
        return 1;
      }
      const imageUri = await imagePost.json();
      if (imageUri.errors) {
        return imageUri;
      }
      newImage = {
        uri: imageUri.url,
        width: image.width,
        height: image.height,
        name: imageUri.name,
      };
    }

    const postInput = {
      groupId: groupId,
      postId: id,
      image: newImage,
      content,
      priority,
      allowComment,
      visibility,
      denyButton,
      confirmButton,
      priorityExpiration: new Date(parseInt(priorityExpiration)),
      taskExpiration:
        type == 'task' ? new Date(parseInt(taskExpiration)) : null,
      start: type == 'event' ? new Date(parseInt(start)) : null,
      end: type == 'event' ? new Date(parseInt(end)) : null,
      locationDescription: type == 'event' ? locationDescription : null,
      place_id: type == 'event' ? place_id : null,
      lat: type == 'event' ? lat : null,
      lng: type == 'event' ? lng : null,
    };

    console.log(postInput);

    const graphql = {
      query: updatePostMutation,
      variables: {
        postInput: postInput,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const deletePost = data => {
  const {postId, token} = data;

  return async function(dispatch) {
    const graphql = {
      query: deletePostMutation,
      variables: {
        postId: postId,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(DeletePost(postId));

    return 0;
  };
};

const DeletePost = data => {
  return {
    type: 'deletePost',
    postId: data,
  };
};

export const respondPost = data => {
  const {postId, token, type} = data;

  return async function(dispatch) {
    const input = {
      postId,
      type,
    };
    const graphql = {
      query: respondPostMutation,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const changePostNotification = data => {
  const {token, postId} = data;

  return async function(dispatch) {
    const graphql = {
      query: changePostNotificationMutation,
      variables: {
        postId: postId,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const reportPost = data => {
  const {token, postId, content} = data;

  return async function(dispatch) {
    const postReportInput = {
      postId: postId,
      content: content,
    };
    const graphql = {
      query: reportPostMutation,
      variables: {
        postReportInput: postReportInput,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const getNominationPost = request => {
  const {token, groupId, time, nomineeId, nominationId, count} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      nomineeId: nomineeId,
      nominationId: nominationId,
      endAt: time.next_sunday,
      beginAt: time.last_sunday,
      count: count,
    };

    const graphql = {
      query: getNominationPostQuery,
      variables: {
        nominationPostInput: input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return result.data.getNominationPost;
  };
};

export const getGroupPostForCheckIn = request => {
  const {token, groupId, count} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      count: count,
    };

    const graphql = {
      query: getGroupPostForCheckInQuery,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.getGroupPostForCheckIn;
  };
};

export const getPostTaskResponse = request => {
  const {token, postId, count, type} = request;

  return async function(dispatch) {
    const input = {
      postId,
      count,
      type,
    };

    const graphql = {
      query: getPostTaskResponseQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return result.data.getPostTaskResponse;
  };
};

export const createUpdateTaskVerify = request => {
  const {token, postId, content, image} = request;

  return async function(dispatch) {
    let imageData = null;
    if (image != null) {
      if (image.data) {
        imageData = await httpUpload(token, image, 'taskVerification');
        if (imageData.errors) {
          alert('Upload image failed, please try again later');
          return;
        }
      }
    }

    const input = {
      postId,
      content: content.trim(),
      image: imageData,
    };

    const graphql = {
      query: createUpdateTaskVerifyMutation,
      variables: {input},
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const getUserTaskVerification = request => {
  const {token, postId, respondentId} = request;

  return async function(dispatch) {
    const input = {
      postId,
      respondentId,
    };

    const graphql = {
      query: getUserTaskVerificationQuery,
      variables: {input},
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return result.data.getUserTaskVerification;
  };
};

export const manageUserTaskResponse = request => {
  const {token, respondentId, postId, type} = request;

  return async function(dispatch) {
    const input = {
      respondentId,
      postId,
      type,
    };

    const graphql = {
      query: manageUserTaskResponseMutation,
      variables: {input},
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }
    return 0;
  };
};
