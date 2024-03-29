export const createCheckInMutation = `
mutation createCheckIn($checkInInput: CheckInInput!){
    createCheckIn(input: $checkInInput)
}
`

export const getGroupCheckInQuery = `
query getGroupCheckIn($groupCheckInInput: GroupCheckInInput!){
    getGroupCheckIn(input: $groupCheckInInput){
        checkin {
            id
            groupId
            postId
            point
            name
            hasPassword
            userId
            content
            endAt
            count
            checked
            isLocal
            locationDescription
            priority
            place_id
            geohash
        }
        count
    }
}
`

export const createUserCheckInMutation = `
mutation createUserCheckIn($input: UserCheckInInput!){
    createUserCheckIn(input: $input)
}
`

export const deleteCheckInMutation = `
mutation deleteCheckIn($input: ID!){
    deleteCheckIn(checkin_id: $input)
}
`

export const getGroupCheckInResultQuery = `
query getGroupCheckInResult($input: CheckInResultInput!){
    getGroupCheckInResult(input: $input){
        members {
            id
            username
            displayName
            group_username
            icon{
                uri
            }
        }
        count
    }
}
`

export const createUserCheckInBatchMutation = `
mutation createUserCheckInBatch($input: UserCheckInBatchInput!){
    createUserCheckInBatch(input: $input)
}
`