export const getGroupMembersQuery = `
query getGroupMembers($input: GetGroupMembersInput!){
    getGroupMembers(input: $input){
        members{
            id
            username
            displayName
            group_username
            auth {
                rank
                title
            }
            icon{
                uri
            }
            createdAt
            lastActiveAt
        }
        count
    }
}
`;

export const searchGroupMembersQuery = `
query searchGroupMembers($input: SearchMemberInput!){
    searchGroupMembers(input: $input){
        members{
            id
            username
            displayName
            group_username
            auth {
                rank
                title
            }
            icon{
                uri
            }
            createdAt
            lastActiveAt
        }
        count
    }
}
`;

export const getStatusInGroupQuery = `
query getStatusInGroup($groupId: ID!){
    getStatusInGroup(groupId: $groupId){
        id
        username
        displayName
        group_username
        auth {
            rank
            title
        }
        icon{
            uri
        }
        createdAt
        lastActiveAt
    }
}
`;

export const updateMemberMutation = `
mutation updateMember($memberInput: MemberInput!){
    updateMember(input: $memberInput)
}
`;

export const changeGroupNotificationMutation = `
mutation changeGroupNotification($input: GroupNotificationInput!){
    changeGroupNotification(input: $input){
        id
        groupname
        shortDescription
        icon {
            uri
        }
        backgroundImg {
            uri
        }
        auth {
            rank
            title
            notification
            notificationPriority
        }
        memberCount
        createdAt
    }
}
`;

export const registerDeviceForNotificationMutation = `
mutation registerDeviceForNotification($input: NotificationInput!){
    registerDeviceForNotification(input: $input)
}

`;

export const searchUserQuery = `
query searchUser($searchUserInput: SearchUserInput!){
    searchUser(input: $searchUserInput){
        users{
            id
            username
            displayName
            group_username
            icon{
                uri
            }
            in_group
            checked
            in_chat
        }
        count
    }
}
`;

export const addMembersMutation = `
mutation addMembers($input: AddMembersInput!){
    addMembers(input: $input)
}
`;

export const deleteMemberMutation = `
mutation deleteMember($memberId: String!, $groupId: String!){
    deleteMember(memberId: $memberId, groupId: $groupId)
}
`;

export const makeOwnerMutation = `
mutation makeMemberOwner($memberId: String!, $groupId: String!){
    makeMemberOwner(memberId: $memberId, groupId: $groupId)
}
`;

export const getUserRelationQuery = `
query getUserRelation($input: UserRelationInput!){
    getUserRelation(input: $input){
        to {
            is_dm_blocked
        }
        from {
            is_dm_blocked
        }
    }
}
`

export const updateUserRelationMutation = `
mutation updateUserRelation($input: UserRelationInput!){
    updateUserRelation(input: $input){
        is_dm_blocked
    }
}
`

export const searchAtUserQuery = `
query searchAtUser($input: SearchUserInput!){
    searchAtUser(input: $input){
        id
        username
        displayName
        iconUrl
    }
}
`