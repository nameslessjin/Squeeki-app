import {reconstructPostsInReducer} from './utils/extractor';

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
  let reconstructed_posts = [];
  switch (action.type) {
    case 'getGroupPosts':
      reconstructed_posts = reconstructPostsInReducer(action.data.posts)
      return {
        ...state,
        groupPosts: {
          count: action.data.count,
          posts: action.data.count == 10? reconstructed_posts: groupPosts.posts.concat(reconstructed_posts)
        }
      }

    case 'getFeed':
      reconstructed_posts = reconstructPostsInReducer(action.data.posts)
      return {
        ...state,
        feed: {
          count: action.data.count,
          posts: action.data.count == 10 ? reconstructed_posts : feed.posts.concat(reconstructed_posts)
        }
      }

    case 'updatePost':
      feedPost = feed.posts.map(post => {
        if (post.id == action.post.id) {
          return reconstructPostsInReducer([action.post])[0];
        }
        return post;
      });

      groupPostsPost = groupPosts.posts.map(post => {
        if (post.id == action.post.id) {
          return reconstructPostsInReducer([action.post])[0];
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
            ...INITIAL_STATE.groupPosts
        }
      };
    case 'logout':
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
});
