const INITIAL_STATE = {
  comments: {
    comments: [],
    count: 0,
  },
  postId: null,
};

export default (commentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'loadComments':
      return {
        ...state,
        comments: {
          comments:
            action.comments.count > 10 &&
            action.comments.count == state.comments.count
              ? state.comments.comments
              : action.comments.count == 10
              ? action.comments.comments
              : state.comments.comments.concat(action.comments.comments),
          count: action.comments.count,
        },
        postId: action.comments.postId,
      };

    case 'createComment':
      return {
        ...state,
        comments: {
          ...state.comments,
          ...action.comments,
        },
      };

    case 'deleteComment':
      //delte comment or reply inside a comment
      return {
        ...state,
        comments: {
          ...state.comments,
          comments:
            action.i.replyId == null
              ? state.comments.comments.filter(
                  comment => comment.id != action.i.id,
                )
              : state.comments.comments.map(c => {
                  if (c.id == action.i.replyId) {
                    return {
                      ...c,
                      num_of_replies: action.i.num_of_replies,
                      reply: {
                        ...c.reply,
                        replies: c.reply.replies.filter(
                          r => r.id != action.i.id,
                        ),
                      },
                    };
                  }
                  return c;
                }),
        },
      };

    case 'replyComment':
      // increase num_of_replies for replied comment
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: state.comments.comments.map(c => {
            if (c.id == action.i.commentId) {
              return {
                ...c,
                num_of_replies: action.i.num_of_replies,
              };
            }
            return c;
          }),
        },
      };

    case 'getReplies':
      // add replies to comment
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: state.comments.comments.map(c => {
            if (c.id == action.i.commentId) {
              return {
                ...c,
                num_of_replies: action.i.reply.num_of_replies,
                reply: {
                  count: action.i.reply.count,
                  replies: c.reply
                    ? c.reply.replies.concat(action.i.reply.replies)
                    : action.i.reply.replies,
                },
              };
            }
            return c;
          }),
        },
      };

    case 'cleanComment':
      return {
        ...INITIAL_STATE,
      };

    case 'logout':
      return {
        ...INITIAL_STATE,
      };

    default:
      return state;
  }
});
