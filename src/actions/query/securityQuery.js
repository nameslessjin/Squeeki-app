export const getLastVersionQuery = `
query getLastVersion {
    getLastVersion {
        serverVersion
        IOSVersion
        AndroidVersion
    }
}
`;

export const getUserStatusQuery = `
query getUserStatus {
    getUserStatus {
        status
    }
}
`;

export const getSecurityClearanceQuery = `
query getSecurityClearance{
    getSecurityClearance {
        searchUserClearance
        suspendUserClearance
        deleteUserClearance
        searchGroupClearance
        suspendGroupClearance
        deleteGroupClearance
        searchPostClearance
        suspendPostClearance
        deletePostClearance
        searchCommentClearance
        suspendCommentClearance
        deleteCommentClearance
        securityClearanceLvl
        status
    }
}
`;

export const searchASAdminQuery = `
query searchASAdmin($input: SearchInput!){
    searchASAdmin(input: $input){
        data {
            id
            username
            displayName
            icon
            status
            securityClearance {
                status
                searchUserClearance
                suspendUserClearance
                deleteUserClearance
                searchGroupClearance
                suspendGroupClearance
                deleteGroupClearance
                searchPostClearance
                suspendPostClearance
                deletePostClearance
                searchCommentClearance
                suspendCommentClearance
                deleteCommentClearance
                securityClearanceLvl
            }
            groupname
            shortDescription
            image
            content
            createdAt
            user {
                id
                username
                displayName
                icon
                status
                securityClearance {
                    securityClearanceLvl
                }
            }
            type
            postId
            replyId
        }
        count
    }
}

`;

export const adminActionMutation = `
mutation adminAction($input: ActionInput!){
    adminAction(input: $input)
}
`
export const updateSecurityClearanceMutation = `
mutation updateSecurityClearance($input: SecurityClearanceInput!){
    updateSecurityClearance(input: $input)
}

`