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
                groupDisplayName
                fromId
                from
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
        groupDisplayName
        giftedGroupDisplayName
        giftedGroupName
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
`;

export const getGroupRewardHistoryQuery = `
query getGroupRewardHistory($input: RewardInput!){
    getGroupRewardHistory(input: $input){
        reward {
            id
            name
            groupDisplayName
            chance
            pointCost
            createdAt
            fromId
            from
            winner {
                displayName
                icon
                userId
            }
        }
        count
    }
}
`;

export const getUserRewardHistoryQuery = `
query getUserRewardHistory($input: RewardInput!){
    getUserRewardHistory(input: $input){
        reward {
            id
            name
            groupDisplayName
            chance
            pointCost
            createdAt
            fromId
            from
            status
        }
        count
    }
}

`;

export const getRewardQuery = `
query getReward($input: RewardInput!){
    getReward(input: $input){
        id
        pointCost
        chance
        chanceDisplay
        name
        description
        fromId
        from
        image
        groupDisplayName
        content
        status
        updatedAt
        redeemer {
            username
            displayName
        }
        winner {
            username
            displayName
        }
    }
}
`;
export const searchRewardQuery = `
query searchReward($input: RewardInput!){
    searchReward(input: $input){
        reward{
            id
            pointCost
            chance
            status
            name
            createdAt
            fromId
            winner {
                userId
                icon
                displayName
            }
        }
        count
    }
}

`;

export const redeemUserRewardMutation = `
mutation redeemUserReward($input: RewardInput!){
    redeemUserReward(input: $input)
}
`;

export const getSystemRewardListSettingQuery = `
query getSystemRewardListSetting {
    getSystemRewardListSetting {
        list {
            id
            label
            value
        }
        chance {
            id
            label
            value
            listId
        }
    }
}
`;

export const getGroupGiftedRewardFromListQuery = `
query getGroupGiftedRewardFromList($input: RewardInput!){
    getGroupGiftedRewardFromList(input: $input){
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
                giftedGroupDisplayName
                toId
                to
                count
            }
        }
    }
}
`;
