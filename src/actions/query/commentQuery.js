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
                    width
                    height
                }
            }
            likeCount
            liked
        }
        count
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
                    width
                    height
                }
            }
            likeCount
            liked
        }
        count
    }
}
`
export const deleteCommentMutation = `
mutation deleteComment($commentId: ID!){
    deleteComment(commentId: $commentId)
}
`

export const likeCommentMutation = `
mutation likeComment($commentId: ID!) {
    likeComment(commentId: $commentId)
}
`

export const reportCommentMutation = `
mutation reportComment($commentReportInput: CommentReportInput!){
    reportComment(input: $commentReportInput)
}
`