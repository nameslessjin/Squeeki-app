const INITIAL_STATE = {
  groupPosts: {
    posts: [],
    count: 0,
  },
  feed: {
    posts: [],
    count: 0,
  },
};

export default (postReducer = (state = INITIAL_STATE, action) => {
  let feed = state.feed;
  let groupPosts = state.groupPosts;
  switch (action.type) {
    case 'getGroupPosts':
      return {
        ...state,
        groupPosts: {
          count: action.data.count,
          posts:
            action.data.count > 10 &&
            action.data.count == state.groupPosts.count
              ? state.groupPosts.posts
              : action.data.count == 10
              ? action.data.posts
              : groupPosts.posts.concat(
                  action.data.posts.filter(p => {
                    // filter duplicates
                    const index = groupPosts.posts.findIndex(g => g.id == p.id);
                    if (index == -1) {
                      return true;
                    }
                    return false;
                  }),
                ),
        },
      };

    case 'getFeed':
      return {
        ...state,
        feed: {
          count: action.data.count,
          posts:
            action.data.count > 10 && action.data.count == state.feed.count
              ? state.feed.posts
              : action.data.count == 10
              ? action.data.posts
              : feed.posts.concat(
                  action.data.posts.filter(p => {
                    // filter duplicates
                    const index = feed.posts.findIndex(f => f.id == p.id);
                    if (index == -1) {
                      return true;
                    }
                    return false;
                  }),
                ),
        },
      };

    case 'updatePost':
      feedPost = feed.posts.map(post => {
        if (post.id == action.post.id) {
          return action.post;
        }
        return post;
      });

      groupPostsPost = groupPosts.posts.map(post => {
        if (post.id == action.post.id) {
          return action.post;
        }
        return post;
      });

      return {
        ...state,
        groupPosts: {
          ...groupPosts,
          posts: groupPostsPost,
        },
        feed: {
          ...feed,
          posts: feedPost,
        },
      };

    case 'deletePost':
      feedPost = feed.posts.filter(post => post.id !== action.postId);
      groupPostsPost = groupPosts.posts.filter(
        post => post.id !== action.postId,
      );
      return {
        ...state,
        groupPosts: {
          ...groupPosts,
          posts: groupPostsPost,
        },
        feed: {
          ...feed,
          posts: feedPost,
        },
      };
    case 'cleanGroup':
      return {
        ...state,
        groupPosts: {
          ...INITIAL_STATE.groupPosts,
        },
      };
    case 'logout':
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
});
