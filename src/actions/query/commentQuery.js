export const getCommentQuery = `
query getPostComments($postId: ID!, $count: Int!){
    getPostComments(postId: $postId, count: $count){
        comments{
            id
            content
            createdAt
            updatedAt
            user{
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            likeCount
            liked
            num_of_replies
            reply{
                replies{
                    id
                    content
                    createdAt
                    user {
                        id
                        username
                        displayName
                        group_username
                        icon{
                            uri
                        }
                    }
                    likeCount
                    liked
                }
                count
            }
        }
        count
    }
}
`;

export const getRepliesQuery = `
query getReplies($input: ReplyQueryInput!){
    getReplies(input: $input){
        replies{
            id
            content
            createdAt
            user {
                id
                username
                displayName
                group_username
                icon{
                    uri
                }
            }
            likeCount
            liked
        }
        count
        num_of_replies
    }
}
`

export const createCommentMutation = `
mutation createComment($commentInput: CommentInput!){
    createComment(input: $commentInput){
        comments{
            id
            content
            createdAt
            updatedAt
            user{
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            likeCount
            liked
        }
        count
    }
}
`;
export const deleteCommentMutation = `
mutation deleteComment($commentId: ID!){
    deleteComment(commentId: $commentId){
        id
        replyId
        num_of_replies
    }
}
`;

export const likeCommentMutation = `
mutation likeComment($commentId: ID!) {
    likeComment(commentId: $commentId)
}
`;

export const reportCommentMutation = `
mutation reportComment($commentReportInput: CommentReportInput!){
    reportComment(input: $commentReportInput)
}
`;

export const replyCommentMutation = `
mutation replyComment($input: CommentInput!){
    replyComment(input: $input)
}
`;
