import {
  getCommentQuery,
  createCommentMutation,
  deleteCommentMutation,
  likeCommentMutation,
  reportCommentMutation,
  replyCommentMutation,
  getRepliesQuery
} from './query/commentQuery';
import {http} from '../../apollo';

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

    const commentData = await fetch(http, {
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

    dispatch(loadComments({...comments.data.getPostComments, postId}));

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
    const graphQl = {
      query: createCommentMutation,
      variables: {
        commentInput: commentInput,
      },
    };

    const commentPost = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });

    const commentData = await commentPost.json();
    if (commentData.errors) {
      return commentData;
    }

    dispatch(createCommentToReducer(commentData.data.createComment));

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

export const deleteComment = request => {
  const {commentId, token, replyId} = request;

  return async function(dispatch) {
    const graphql = {
      query: deleteCommentMutation,
      variables: {
        commentId: commentId,
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
