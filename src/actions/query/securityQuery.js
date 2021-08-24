export const getLastVersionQuery = `
query getLastVersion {
    getLastVersion {
        serverVersion
        IOSVersion
        AndroidVersion
    }
}
`

export const getUserStatusQuery = `
query getUserStatus {
    getUserStatus {
        status
    }
}
`

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
        deleteCommentClearance
        securityClearanceLvl
    }
}
`