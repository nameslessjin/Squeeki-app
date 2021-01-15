const INITIAL_STATE = {
  comments: {
    comments: [],
    count: 0,
  },
};

export default (commentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'loadComments':
      return {
        ...state,
        comments: {
          comments: action.comments.count == 10 ? action.comments.comments : state.comments.comments.concat(action.comments.comments),
          count: action.comments.count,
        },
      };

    case 'createComment':
      return {
        ...state,
        comments: {
          ...action.comments,
        },
      };

    case 'deleteComment':
      return {
        ...state,
        comments: {
          ...state.comments,
          comments: state.comments.comments.filter(comment => comment.id != action.commentId)
        }
      }

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
