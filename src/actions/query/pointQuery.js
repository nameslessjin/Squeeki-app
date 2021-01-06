export const getUserGroupPointQuery = `
query getUserGroupPoint($input: ID!){
    getUserGroupPoint(groupId: $input){
        total_point_semester
        bonus_point_semester
    }
}
`