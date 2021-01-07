export const getUserGroupPointQuery = `
query getUserGroupPoint($input: ID!){
    getUserGroupPoint(groupId: $input){
        total_point_semester
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
                icon {
                    uri
                    width
                    height
                }
            }
            base_point
        }
        count

    }
}
`