export const getGroupPostsQuery = `
query getGroupPosts($input: GetPostInput!){
    getGroupPosts(input: $input){
        posts{
            id
            image{
                uri
            }
            content
            originContent
            taskResponse
            createdAt
            updatedAt
            user {
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            groupAuth {
                rank
                title
            }
            priority
            visibility
            checked
            priority_expiration_date
            allowComment
            type
            confirmButton
            denyButton
            commentCount
            auth
            groupId
            likeCount
            liked
            notification
            nomination{
                postNominationId
                nominationId
                nomineeId
                endAt
                nominee_name
                username
                nomination_name
                points
                voted
            }
        }
        count
    }
}

`;

export const getFeedQuery = `
query getFeed($count: Int!){
    getFeed(count: $count){
        posts{
            id
            image{
                uri
            }
            content
            originContent
            taskResponse
            createdAt
            updatedAt
            user {
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            priority
            visibility
            checked
            priority_expiration_date
            allowComment
            confirmButton
            denyButton
            type
            commentCount
            auth
            groupId
            likeCount
            liked
            notification
            nomination{
                postNominationId
                nominationId
                nomineeId
                endAt
                nominee_name
                username
                nomination_name
                points
                voted
            }
        }
        count
    }
}
`;

export const getPostQuery = `
query getPost($postId: ID!){
    getPost(postId: $postId){
            id
            image{
                uri
            }
            content
            createdAt
            taskResponse
            updatedAt
            user {
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            groupAuth {
                rank
                title
            }
            priority
            visibility
            confirmButton
            denyButton
            priority_expiration_date
            allowComment
            type
            commentCount
            auth
            groupId
            likeCount
            liked
            notification
    }
}
`;

export const createPostMutation = `
mutation createPost($postInput: PostInput!){
    createPost(input: $postInput)
}
`;

export const updatePostMutation = `
mutation updatePost($postInput: PostInput!){
    updatePost(input: $postInput)
}
`;

export const deletePostMutation = `
mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
}
`;
export const respondPostMutation = `
mutation respondPost($input: RespondPostInput!){
    respondPost(input: $input)
}
`;

export const changePostNotificationMutation = `
mutation changePostNotification($postId: ID!){
    changePostNotification(postId: $postId)
}
`;

export const reportPostMutation = `
mutation reportPost($postReportInput: PostReportInput!){
    reportPost(input: $postReportInput)
}
`;

export const getNominationPostQuery = `
query getNominationPost($nominationPostInput: NominationPostInput!){
    getNominationPost(input: $nominationPostInput){
        posts{
            id
            image{
                uri
            }
            content
            createdAt
            updatedAt
            user {
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            groupAuth {
                rank
                title
            }
            priority
            visibility
            priority_expiration_date
            allowComment
            type
            commentCount
            auth
            groupId
            likeCount
            liked
            notification
            nomination{
                postNominationId
                nominationId
                nomineeId
                endAt
                nominee_name
                username
                nomination_name
                points
                voted
            }
        }
        count
    }
}

`;

export const getGroupPostForCheckInQuery = `
query getGroupPostForCheckIn($input: GetPostInput!){
    getGroupPostForCheckIn(input: $input){
        posts{
            id
            image{
                uri
            }
            content
            createdAt
            updatedAt
            user {
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            groupAuth {
                rank
                title
            }
            checked
            priority
            visibility
            priority_expiration_date
            allowComment
            type
            commentCount
            auth
            groupId
            likeCount
            liked
            notification
            nomination{
                postNominationId
                nominationId
                nomineeId
                endAt
                nominee_name
                username
                nomination_name
                points
                voted
            }
        }
        count
    }
}
`;

export const getPostTaskResponseQuery = `
query getPostTaskResponse($input: RespondPostInput!){
    getPostTaskResponse(input: $input){
        response{
            userId
            postId
            taskResponse
            displayName
            iconUrl
            taskReplyId
        }
        count
    }
}
`;
