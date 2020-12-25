import {getCommentQuery, createCommentQuery} from './query/commentQuery';

export const getComments = data => {
  const {postId, token, lastIndexId} = data;
  return async function(dispatch) {
    const graphql = {
      query: getCommentQuery,
      variables: {
        postId: postId,
        lastIndexId: lastIndexId
      },
    };


    const commentData = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const comments = await commentData.json();

    if (comments.errors) {
      return comments;
    }

    if (lastIndexId == null){

      dispatch(getCommentsToReducer(comments.data.getPostComments));
    } else {
      dispatch(loadMoreComments(comments.data.getPostComments));
    }
    return 0
  };
};

const getCommentsToReducer = data => {
  return {
    type: 'getComments',
    comments: data,
  };
};

const loadMoreComments = data => {
  return {
    type: 'loadMoreComments',
    comments: data
  }
}

export const createComment = data => {
  const {token, postId, comment, lastIndexId} = data;

  return async function(dispatch) {
      const commentInput = {
          postId: postId,
          content: comment,
          lastIndexId: lastIndexId
      }
      const graphQl = {
          query: createCommentQuery,
          variables: {
              commentInput: commentInput
          }
      }

      const commentPost = await fetch('http://192.168.86.24:8080/graphql', {
          method: 'POST',
          headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphQl)
      })

      const commentData = await commentPost.json()
      if (commentData.errors){
          return commentData
      }

      dispatch(createCommentToReducer(commentData.data.createComment));

      // dispatch(createCommentToReducer(commentData.data.createComment))
      return 0
  };
};

const createCommentToReducer = data => {
    return {
        type: 'createComment',
        comments: data
    }
}

export const cleanComment = () => {
  return {
    type: 'cleanComment'
  }
}