export const getGroupPostsQuery = `
query getGroupPosts($input: GetPostInput!){
    getGroupPosts(input: $input){
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
                group_username
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
            checked
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
                group_username
                icon {
                    uri
                    width
                    height
                }
            }
            priority
            visibility
            checked
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
                group_username
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
            group_username
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
`;

export const getNominationPostQuery = `
query getNominationPost($nominationPostInput: NominationPostInput!){
    getNominationPost(input: $nominationPostInput){
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
                group_username
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
                group_username
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
            notificationId
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
