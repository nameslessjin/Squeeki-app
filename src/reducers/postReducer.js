import {reconstructPostsInReducer} from './utils/extractor'

const INITIAL_STATE = {
    groupPosts: {
        posts: [],
        count: 0,
        lastIndexId: null
    },
    feed: {
        posts: [],
        count: 0,
        lastIndexId: null
    }
}

export default postReducer = (state = INITIAL_STATE, action) => {
    let feed = state.feed
    let groupPosts = state.groupPosts
    let posts = []
    let reconstructed_posts = []
    switch (action.type){
        case 'getGroupPosts':

            reconstructed_posts = {
                ... action.posts,
                posts: reconstructPostsInReducer(action.posts.posts)
            }
            return {
                ...state,
                groupPosts: {
                    ...reconstructed_posts
                }
            }

        case 'loadMoreGroupPosts':
            reconstructed_posts = reconstructPostsInReducer(action.moreGroupPosts.posts)
            posts = groupPosts.posts.concat(reconstructed_posts)
            return {
                ...state,
                groupPosts:{
                    posts: posts,
                    count: posts.length,
                    lastIndexId: action.moreGroupPosts.lastIndexId
                }
            }

        case 'getFeed':

            reconstructed_posts = {
                ... action.feed,
                posts: reconstructPostsInReducer(action.feed.posts)
            }

            return {
                ...state,
                feed: {
                    ...reconstructed_posts
                }

            }
        case 'loadMoreFeed':

            reconstructed_posts =reconstructPostsInReducer(action.moreFeed.posts)

            posts = feed.posts.concat(reconstructed_posts)
            return {
                ...state,
                feed: {
                    posts:posts,
                    count: posts.length,
                    lastIndexId: action.moreFeed.lastIndexId
                }
            }

        case 'updatePost':


            feedPost = feed.posts.map(post => {
                if (post.id == action.post.id){
                    return  reconstructPostsInReducer([action.post])[0]
                }
                return post
            })

            groupPostsPost = groupPosts.posts.map(post => {
                if (post.id == action.post.id){
                    return reconstructPostsInReducer([action.post])[0]
                }
                return post
            })

            return {
                ...state,
                groupPosts: {
                    posts: groupPostsPost,
                    count: groupPostsPost.length
                },
                feed: {
                    posts: feedPost,
                    count: feedPost.length
                }
            }


            
        case 'deletePost':
            feedPost = feed.posts.filter(post => post.id !== action.postId)
            groupPostsPost = groupPosts.posts.filter(post => post.id !== action.postId)
            return {
                ...state,
                groupPosts: {
                    posts: groupPostsPost,
                    count: groupPostsPost.length
                },
                feed: {
                    posts: feedPost,
                    count: feedPost.length
                }
            }
        case 'logout':
            return {
                ...INITIAL_STATE
            }
        default:
            return state
    }
}