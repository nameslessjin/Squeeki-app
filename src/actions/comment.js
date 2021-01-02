import {getCommentQuery, createCommentMutation, deleteCommentMutation, likeCommentMutation, reportCommentMutation} from './query/commentQuery';

export const getComments = data => {
  const {postId, token, count} = data;
  return async function(dispatch) {
    const graphql = {
      query: getCommentQuery,
      variables: {
        postId: postId,
        count: count || 0
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

    dispatch(loadComments(comments.data.getPostComments));

    return 0
  };
};

const loadComments = data => {
  return {
    type: 'loadComments',
    comments: data
  }
}

export const createComment = data => {
  const {token, postId, comment, count} = data;

  return async function(dispatch) {
      const commentInput = {
          postId: postId,
          content: comment,
          count: count
      }
      const graphQl = {
          query: createCommentMutation,
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

      return 0
  };
};

const createCommentToReducer = data => {
    return {
        type: 'createComment',
        comments: data
    }
}

export const likeComment = request => {
  const {commentId, token} = request

  return async function(dispatch){
    const graphql = {
      query: likeCommentMutation,
      variables: {
        commentId: commentId
      }
    }

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

    return 0

  }
}


export const deleteComment = request => {
  const {commentId, token} = request

  return async function(dispatch){
    const graphql = {
      query: deleteCommentMutation,
      variables: {
        commentId: commentId
      }
    }

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

    dispatch(deleteCommentReducer(commentId))

    return 0
  }

}

const deleteCommentReducer = data => {
  return {
    type: 'deleteComment',
    commentId: data
  }
}

export const reportComment = request => {
  const { token, commentId, content } = request

  return async function(dispatch){
    const input = {
      commentId: commentId,
      content: content
    }

    const graphql = {
      query: reportCommentMutation,
      variables: {
        commentReportInput: input
      }
    }

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

    return 0

  }
}


export const cleanComment = () => {
  return {
    type: 'cleanComment'
  }
}