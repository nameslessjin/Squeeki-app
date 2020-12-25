export const getGroupMembersQuery = `
query getGroupMembers($groupId: ID!, $lastIndexId: String){
    getGroupMembers(groupId: $groupId, lastIndexId: $lastIndexId){
        members{
            id
            username
            displayName
            auth {
                rank
                title
            }
            icon{
                uri
                width
                height
            }
            createdAt
            lastLoginAt
        }
        lastIndexId
    }
}
`

export const updateMemberMutation = `
mutation updateMember($memberInput: MemberInput!){
    updateMember(input: $memberInput)
}
`

export const changeGroupNotificationMutation = `
mutation changeGroupNotification($input: GroupNotificationInput!){
    changeGroupNotification(input: $input){
        id
        groupname
        shortDescription
        icon {
            uri
            width
            height
        }
        backgroundImg {
            uri
            width
            height
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
`

export const registerDeviceForNotificationMutation = `
mutation registerDeviceForNotification($input: NotificationInput!){
    registerDeviceForNotification(input: $input)
}

`

export const searchUserQuery = `
query searchUser($searchUserInput: SearchUserInput!){
    searchUser(input: $searchUserInput){
        users{
            id
            username
            displayName
            icon{
                uri
                width
                height
            }
            in_group
        }
        lastIndexId
    }
}
`

export const addMembersMutation = `
mutation addMembers($input: AddMembersInput!){
    addMembers(input: $input)
}
`

export const deleteMemberMutation = `
mutation deleteMember($memberId: String!, $groupId: String!){
    deleteMember(memberId: $memberId, groupId: $groupId)
}
`

export const makeOwnerMutation = `
mutation makeMemberOwner($memberId: String!, $groupId: String!){
    makeMemberOwner(memberId: $memberId, groupId: $groupId)
}
`
