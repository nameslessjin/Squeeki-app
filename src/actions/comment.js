import {
  getCommentQuery,
  createCommentMutation,
  deleteCommentMutation,
  likeCommentMutation,
  reportCommentMutation,
  replyCommentMutation,
  getRepliesQuery
} from './query/commentQuery';
import {httpCall} from './utils/httpCall'

export const getComments = data => {
  const {postId, token, count} = data;
  return async function(dispatch) {
    const graphql = {
      query: getCommentQuery,
      variables: {
        postId: postId,
        count: count || 0,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(loadComments({...result.data.getPostComments, postId}));

    return 0;
  };
};

const loadComments = data => {
  return {
    type: 'loadComments',
    comments: data,
  };
};

export const createComment = data => {
  const {token, postId, content} = data;

  return async function(dispatch) {
    const commentInput = {
      postId,
      content,
    };
    const graphql = {
      query: createCommentMutation,
      variables: {
        commentInput: commentInput,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    console.log(result.data.createComment)

    dispatch(createCommentToReducer(result.data.createComment));

    return 0;
  };
};

const createCommentToReducer = data => {
  return {
    type: 'createComment',
    comments: data,
  };
};

export const likeComment = request => {
  const {commentId, token} = request;

  return async function(dispatch) {
    const graphql = {
      query: likeCommentMutation,
      variables: {
        commentId: commentId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const deleteComment = request => {
  const {commentId, token, replyId} = request;

  return async function(dispatch) {
    const graphql = {
      query: deleteCommentMutation,
      variables: {
        commentId: commentId,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    dispatch(deleteCommentReducer(result.data.deleteComment));

    return 0;
  };
};

const deleteCommentReducer = data => {
  return {
    type: 'deleteComment',
    i: data,
  };
};

export const reportComment = request => {
  const {token, commentId, content} = request;

  return async function(dispatch) {
    const input = {
      commentId: commentId,
      content: content,
    };

    const graphql = {
      query: reportCommentMutation,
      variables: {
        commentReportInput: input,
      },
    };

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const replyComment = request => {
  const {token, postId, content, replyId} = request;

  return async function(dispatch) {
    const input = {
      postId,
      replyId,
      content,
    };

    const graphql = {
      query: replyCommentMutation,
      variables: {
        input: input,
      },
    };

   const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    const data = {
      num_of_replies: result.data.replyComment,
      commentId: replyId
    }

    dispatch(replyCommentReducer(data))

    return 0;
  };
};

const replyCommentReducer = data => {
  return {
    type: 'replyComment',
    i: data
  }
}



export const getReplies = request => {
  const {token, replyId, postId, count } = request
  
  return async function(dispatch){
    const input = {
      replyId,
      postId,
      count
    }

    const graphql = {
      query: getRepliesQuery,
      variables: {
        input: input
      }
    }

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    const data = {
      commentId: replyId,
      reply: result.data.getReplies
    }

    dispatch(getRepliesReducer(data))

    return result.data.getReplies

  }

}

const getRepliesReducer = data => {
  return {
    type: 'getReplies',
    i: data
  }
}

export const cleanComment = () => {
  return {
    type: 'cleanComment',
  };
};
