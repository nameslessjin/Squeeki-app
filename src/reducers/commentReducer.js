const INITIAL_STATE = {
    comments: {
        comments: [],
        count: 0,
        lastIndexId: null,
    }
}

export default commentReducer = (state = INITIAL_STATE, action) => {
    let comments = state.comments

    switch (action.type){
        case 'getComments':
            return {
                ...state,
                comments: {
                    ...action.comments
                }
            }
        case 'loadMoreComments':
  
            comments = state.comments.comments.concat(action.comments.comments)
            return {
                ...state,
                comments:{
                    comments: comments,
                    count: state.comments.count,
                    lastIndexId: action.comments.lastIndexId
                }
            }
        case 'createComment':
            return {
                ...state,
                comments:{
                    ...action.comments
                }
            }

        case 'cleanComment':
            return {
                ...INITIAL_STATE
            }

        case 'logout':
            return {
                ...INITIAL_STATE
            }

        default:
            return state
    }
}