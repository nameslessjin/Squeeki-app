export const createUpdateGroupRewardMutation = `
mutation createUpdateGroupReward($input: RewardInput!){
    createUpdateGroupReward(input: $input)
}
`;

export const getGroupRewardListQuery = `
query getGroupRewardList($input: RewardInput!){
    getGroupRewardList(input: $input){
        id
        type
        listName
        chance1
        chance2
        chance3
        chance4
        chance5
        pointCost
        rewardEntryList {
            title
            chance
            data {
                id
                expiration
                name
                createdAt
                count
            }
        }
        redeemRewardEntryList {
            id
            name
            expiration
            pointCost
            createdAt
            count
        }
    }
}
`;

export const updateGroupRewardSettingMutation = `
mutation updateGroupRewardSetting($input: GroupRewardSettingInput){
    updateGroupRewardSetting(input: $input)
}
`;

export const getRewardEntryQuery = `
query getRewardEntry($input: RewardInput!){
    getRewardEntry(input: $input){
        id
        name
        chance
        listId
        createdAt
        from
        fromId
        to
        toId
        description
        image
        count
        pointCost
        chanceDisplay
        expiration
    }
}
`;

export const updateRewardEntryStatusMutation = `
mutation updateRewardEntryStatus($input: RewardInput!){
    updateRewardEntryStatus(input: $input)
}
`;

export const lootRedeemRewardMutation = `
mutation lootRedeemReward($input: LootRedeemRewardInput!){
    lootRedeemReward(input: $input){
        name
        image
        description
        pointCost
        chanceDisplay
        errorMessage
    }
}
`

export const getGroupRewardHistoryQuery = `
query getGroupRewardHistory($input: RewardInput!){
    getGroupRewardHistory(input: $input){
        reward {
            id
            name
            entryId
            groupDisplayName
            chance
            pointCost
            createdAt
            winner {
                displayName
                icon
                userId
            }
        }
        count
    }
}
`

// legacy

export const getMonthlyGiftCardCountQuery = `
query getMonthlyGiftCardCount($groupId: ID!){
    getMonthlyGiftCardCount(groupId: $groupId)
}
`;