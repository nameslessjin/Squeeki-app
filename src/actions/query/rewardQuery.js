export const createGroupRewardMutation = `
mutation createGroupReward($input: CreateGroupRewardInput!){
    createGroupReward(input: $input)
}
`

export const getGroupRewardQuery = `
query getGroupReward($input: GroupRewardInput!){
    getGroupReward(input: $input){
        rewards{
            id
            from
            type
            content
            name
            chance
            hide
            createdAt
            user {
                id
                username
                displayName
                icon{
                    uri
                    width
                    height
                }
            }
        }
        count

    }
}
`

export const deleteGroupRewardMutation = `
mutation deleteGroupReward($rewardId: ID!){
    deleteGroupReward(rewardId: $rewardId)
}
`

export const getUserGroupRewardHistoryQuery = `
query getUserGroupRewardHistory($input: GroupRewardInput!){
    getUserGroupRewardHistory(input: $input){
        rewards{
            id
            from
            type
            content
            name
            chance
            hide
            createdAt
        }
        count

    }
}
`