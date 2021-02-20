export const getUserGroupPointQuery = `
query getUserGroupPoint($input: ID!){
    getUserGroupPoint(groupId: $input){
        total_point
        base_point_semester
    }
}
`

export const getGroupPointLeaderBoardQuery = `
query getGroupPointLeaderBoard($input: getUserGroupPointInput!){
    getGroupPointLeaderBoard(input: $input){
        users {
            user {
                id
                username
                displayName
                group_username
                icon {
                    uri
                }
            }
            base_point
        }
        count

    }
}
`