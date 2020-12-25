export const getCommentQuery = `
query getPostComments($postId: ID!, $lastIndexId: String){
    getPostComments(postId: $postId, lastIndexId: $lastIndexId){
        comments{
            id
            content
            createdAt
            updatedAt
            user{
                id
                username
                displayName
                icon {
                    uri
                    width
                    height
                }
            }
        }
        count
        lastIndexId
    }
}
`

export const createCommentQuery = `
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
                icon {
                    uri
                    width
                    height
                }
            }
        }
        count
        lastIndexId
    }
}
`