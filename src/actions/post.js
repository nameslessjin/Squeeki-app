import {
  getGroupPostsQuery,
  getFeedQuery,
  getPostQuery,
  createPostMutation,
  updatePostMutation,
  deletePostMutation,
  likePostMutation,
  changePostNotificationMutation,
  reportPostMutation,
  getNominationPostQuery,
  getGroupPostForCheckInQuery
} from './query/postQuery';

export const getGroupPosts = data => {
  const {groupId, token, lastIndexId} = data;
  return async function(dispatch) {
    const graphql = {
      query: getGroupPostsQuery,
      variables: {
        groupId: groupId,
        lastIndexId: lastIndexId,
      },
    };

    const groupPosts = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });
    const postsData = await groupPosts.json();
    if (postsData.errors) {
      return postsData;
    }

    if (lastIndexId == null){
      dispatch(getGroupPostsData(postsData.data.getGroupPosts));
    } else {

      dispatch(loadMoreGroupPosts(postsData.data.getGroupPosts))
    }

    return 0;
  };
};

const getGroupPostsData = data => {
  return {
    type: 'getGroupPosts',
    posts: data,
  };
};


const loadMoreGroupPosts = data => {
  return {
    type: 'loadMoreGroupPosts',
    moreGroupPosts: data
  }
}

export const getFeed = data => {
  const {token, lastIndexId} = data;
  return async function(dispatch) {
    const graphql = {
      query: getFeedQuery,
      variables: {
        lastIndexId: lastIndexId
      }
    };

    const feed = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const feedData = await feed.json();
    if (feedData.errors) {
      return feedData;
    }

    if (lastIndexId == null){
      dispatch(getFeedData(feedData.data.getFeed));
    } else {

      dispatch(loadMoreFeedData(feedData.data.getFeed))
    }

    return 0;
  };
};

const loadMoreFeedData = data => {
  return {
    type: 'loadMoreFeed',
    moreFeed: data
  }
}

const getFeedData = data => {
  return {
    type: 'getFeed',
    feed: data,
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

    const post = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });
    const postData = await post.json();
    if (postData.errors) {
      return postData;
    }
    return postData;
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
    visibility
  } = data;

  return async function(dispatch) {
    let uploadImage = null;
    if (image != null) {
      const imageData = new FormData();
      imageData.append('fileType', image.type);
      imageData.append('fileData', image.data);
      imageData.append('fileCategory', 'postImgs');

      const imagePost = await fetch('http://192.168.86.24:8080/uploadImage', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: imageData,
      });
      if (imagePost.status == 500) {
        alert('Cannot upload image');
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
        name: imageUri.name
      };
    }

    const priority_expiration_date = new Date(Date.now() + priorityDuration * 24 * 60 * 60 * 1000)

    const postInput = {
      content: content,
      priority: priority,
      allowComment: allowComment,
      type: type,
      groupId: groupId,
      image: uploadImage,
      visibility: visibility,
      nomination: nomination,
      priority_expiration_date: priority_expiration_date
    };


    const graphQl = {
      query: createPostMutation,
      variables: {
        postInput: postInput,
      },
    };

    const post = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });

    const postData = await post.json();
    if (postData.errors) {
      return postData;
    }

    return 0;
  };
};

export const updatePost = data => {

  const {updateData, origin} = data;
  const {token, id, groupId, image, content, priority, priorityDuration, allowComment, type, visibility} = updateData

  return async function(dispatch) {

    let newImage = image
    let newContent = content
    let newPriority = priority
    let newPriorityDuration = priorityDuration
    let newAllowComment = allowComment
    let newType = type
    let newVisibility = visibility

    if (image != null){
      const imageData = new FormData()
      imageData.append('fileType', image.type);
      imageData.append('fileData', image.data);
      imageData.append('fileCategory', 'postImgs');

      const imagePost = await fetch('http://192.168.86.24:8080/uploadImage', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data',
        },
        body: imageData,
      });
      if (imagePost.status == 500) {
        alert('Uploading image failed');
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
        name: imageUri.name
      };

    }

    if (content == null){
      newContent = origin.content;
    }

    if (priority == null){
      newPriority = origin.priority
    }

    if (priorityDuration == null){
      newPriorityDuration = origin.priorityDuration
    }

    if (allowComment == null){
      newAllowComment = origin.allowComment
    }

    if (type == null){
      newType = origin.type
    }

    if (visibility == null){
      newVisibility = origin.visibility
    }

    const priority_expiration_date = new Date(Date.now() + newPriorityDuration * 24 * 60 * 60 * 1000)

    const postInput = {
      groupId: groupId,
      postId: id,
      image: newImage,
      content: newContent,
      priority: newPriority,
      allowComment: newAllowComment,
      type: newType,
      visibility: newVisibility,
      priority_expiration_date: priority_expiration_date
    }


    const graphQl = {
      query: updatePostMutation,
      variables: {
        postInput: postInput
      }
    }


    const post = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });

    const postData = await post.json();
    if (postData.errors) {
      return postData;
    }
    dispatch(updatePostReducer(postData.data.updatePost))
    return 0
  };
};

const updatePostReducer = data => {
  return {
    type: 'updatePost',
    post: data
  }
}

export const deletePost = data => {
  const {postId, token} = data

  return async function(dispatch){

    const graphQl = {
      query: deletePostMutation,
      variables: {
        postId: postId
      }
    }

    const post = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphQl)
    })

    const postData = await post.json()

    if (postData.errors){
      return postData
    }

    dispatch(DeletePost(postId))

    return 0
  }
}


const DeletePost = data => {
  return {
    type: 'deletePost',
    postId: data
  }
}

export const likePost = data => {
  const {postId, token} = data

  return async function(dispatch){
    const graphQl = {
      query: likePostMutation,
      variables: {
        postId: postId,
      }
    }

    const post = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphQl)
    })

    const postData = await post.json()

    if (postData.errors){
      return postData
    }
    
    return 0

  }
}

export const changePostNotification = data => {
  const {token, postId} = data

  return async function(dispatch){
    const graphQl = {
      query: changePostNotificationMutation,
      variables: {
        postId: postId
      }
    }

    const notification = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphQl)
    })

    const notificationResult = await notification.json()

    if (notificationResult.errors){
      return notificationResult
    }

    return 0

  }

}

export const reportPost = data => {
  const {token, postId, content} = data

  return async function(dispatch){
    const postReportInput = {
      postId: postId,
      content: content
    }
    const graphql = {
      query: reportPostMutation,
      variables: {
        postReportInput: postReportInput
      }
    }

    const report = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphql)
    })

    const reportResult = await report.json()
    if (reportResult.errors){
      return reportResult
    }
    return 0

  }
}

export const getNominationPost = request => {
  const {token, groupId, time, nomineeId, nominationId, count} = request

  return async function(dispatch){
    const input = {
      groupId: groupId,
      nomineeId: nomineeId,
      nominationId: nominationId,
      endAt: time.next_sunday,
      beginAt: time.last_sunday,
      count: count
    }

    const graphql = {
      query: getNominationPostQuery,
      variables: {
        nominationPostInput: input
      }
    }

    const req = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphql)
    })

    const result = await req.json()
    if (result.errors){
      return result
    }
    return result.data.getNominationPost



  }
}

export const getGroupPostForCheckIn = request => {

  const {token, groupId, count} = request
  console.log(request)
  return async function(dispatch){
    const input = {
      groupId: groupId,
      count: count
    }

    const graphql = {
      query: getGroupPostForCheckInQuery,
      variables: {
        input: input
      }
    }
    console.log(graphql)
    const req = await fetch('http://192.168.86.24:8080/graphql', {
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

    return result.data.getGroupPostForCheckIn;

  }

}