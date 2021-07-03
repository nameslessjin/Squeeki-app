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
  const {token, count} = data;
  return async function(dispatch) {
    const graphql = {
      query: getFeedQuery,
      variables: {
        count: count,
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
    const expiration_date = new Date(parseInt(post.priority_expiration_date));
    const diff = expiration_date - Date.now();
    let duration = 0;
    if (diff > 0) {
      duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    return {...post, priorityDuration: duration};
  };
};

export const createPost = data => {
  const {
    image,
    content,
    priority,
    priorityDuration,
    allowComment,
    type,
    groupId,
    token,
    nomination,
    visibility,
    confirmButton,
    denyButton,
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

    const priority_expiration_date = new Date(
      Date.now() + priorityDuration * 24 * 60 * 60 * 1000,
    );

    const postInput = {
      content: content,
      priority: priority,
      allowComment: allowComment,
      type: type,
      groupId: groupId,
      image: uploadImage,
      visibility: visibility,
      nomination: nomination,
      priority_expiration_date: priority_expiration_date,
      confirmButton: confirmButton,
      denyButton: denyButton,
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
    priority,
    priorityDuration,
    allowComment,
    type,
    visibility,
    confirmButton,
    denyButton,
  } = updateData;

  return async function(dispatch) {
    let newImage = image;
    let newContent = content;
    let newPriority = priority;
    let newPriorityDuration = priorityDuration;
    let newAllowComment = allowComment;
    let newType = type;
    let newVisibility = visibility;
    let newConfirmButton = confirmButton;
    let newDenyButton = denyButton;

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

    if (content == null) {
      newContent = origin.content;
    }

    if (priority == null) {
      newPriority = origin.priority;
    }

    if (priorityDuration == null) {
      newPriorityDuration = origin.priorityDuration;
    }

    if (allowComment == null) {
      newAllowComment = origin.allowComment;
    }

    if (type == null) {
      newType = origin.type;
    }

    if (visibility == null) {
      newVisibility = origin.visibility;
    }

    if (confirmButton == null) {
      newConfirmButton = origin.confirmButton;
    }

    if (denyButton == null) {
      newDenyButton = origin.denyButton;
    }

    const priority_expiration_date = new Date(
      Date.now() + newPriorityDuration * 24 * 60 * 60 * 1000,
    );

    const postInput = {
      groupId: groupId,
      postId: id,
      image: newImage,
      content: newContent,
      priority: newPriority,
      allowComment: newAllowComment,
      type: newType,
      visibility: newVisibility,
      denyButton: newDenyButton,
      confirmButton: newConfirmButton,
      priority_expiration_date: priority_expiration_date,
    };

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
  const {token, postId, count} = request;

  return async function(dispatch) {
    const input = {
      postId,
      count,
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
          alert('Upload failed, please try again later');
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
