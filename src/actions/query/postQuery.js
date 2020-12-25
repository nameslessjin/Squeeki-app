export const getGroupPostsQuery = `
query getGroupPosts($groupId: ID!, $lastIndexId: String){
    getGroupPosts(groupId: $groupId, lastIndexId: $lastIndexId){
        posts{
            id
            image{
                uri
                width
                height
            }
            content
            createdAt
            updatedAt
            user {
                id
                username
                displayName
                icon {
                    uri
                    width
                    height
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
            notificationId
            nomination{
                postNominationId
                nominationId
                nomineeId
                endAt
                nominee_name
                nomination_name
                points
                voted
            }
        }
        count
        lastIndexId
    }
}

`;

export const getFeedQuery = `
query getFeed($lastIndexId: String){
    getFeed(lastIndexId: $lastIndexId){
        posts{
            id
            image{
                uri
                width
                height
            }
            content
            createdAt
            updatedAt
            user {
                id
                username
                displayName
                icon {
                    uri
                    width
                    height
                }
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
            notificationId
            nomination{
                postNominationId
                nominationId
                nomineeId
                endAt
                nominee_name
                nomination_name
                points
                voted
            }
        }
        count
        lastIndexId
    }
}
`;

export const getPostQuery = `
query getPost($postId: ID!){
    getPost(postId: $postId){
            id
            image{
                uri
                width
                height
            }
            content
            createdAt
            updatedAt
            user {
                id
                username
                displayName
                icon {
                    uri
                    width
                    height
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
            notificationId
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
    updatePost(input: $postInput){
        id
        image{
            uri
            width
            height
        }
        content
        createdAt
        updatedAt
        user {
            id
            username
            displayName
            icon {
                uri
                width
                height
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
    }
}
`;

export const deletePostMutation = `
mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
}
`;
export const likePostMutation = `
mutation likePost($postId: ID!){
    likePost(postId: $postId)
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
`