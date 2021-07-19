export const createUpdateGroupRewardMutation = `
mutation createUpdateGroupReward($input: RewardInput!){
    createUpdateGroupReward(input: $input)
}
`;

export const getGroupRewardListQuery = `
query getGroupRewardList($input: RewardInput!){
    getGroupRewardList(input: $input){
        id
        listName
        chance1
        chance2
        chance3
        chance4
        chance5
        rewardEntryList {
            title
            chance
            data {
                id
                name
                createdAt
                count
            }
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
        chanceDisplay
    }
}
`


export const deleteGroupRewardMutation = `
mutation deleteGroupReward($rewardId: ID!){
    deleteGroupReward(rewardId: $rewardId)
}
`;

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
`;

export const getMonthlyGiftCardCountQuery = `
query getMonthlyGiftCardCount($groupId: ID!){
    getMonthlyGiftCardCount(groupId: $groupId)
}
`;

export const lootRewardMutation = `
mutation lootReward($groupId: ID!){
    lootReward(groupId: $groupId){
        reward {
            id
            from
            type
            content
            name
            chance
            hide
        }
        total_point
    }
}
`;
