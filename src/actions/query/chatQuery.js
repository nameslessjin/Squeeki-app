export const getChatQuery = `
query getChat($input: ChatQuery!){
    getChat(input: $input){
        chat {
            id
            name
            rank_req
            allow_modify
            allow_invite
            available
            is_dm
            is_pinned
            icon {
                uri
            }
            unread_message_count
            last_message{
                username
                content
                createdAt
            }
        }
        count
    }
}
`;

export const createChatMutation = `
mutation createChat($input: ChatMutation!){
    createChat(input: $input){
        id
        name
        rank_req
        allow_modify
        allow_invite
        available
        is_dm
        icon {
            uri
        }
    }
}
`;

export const deleteLeaveChatMutation = `
mutation  deleteLeaveChat($chatId: ID!){
    deleteLeaveChat(chatId: $chatId)
}
`;

export const updateChatMutation = `
mutation updateChat($input: ChatMutation!){
    updateChat(input: $input){
        id
        name
        rank_req
        allow_modify
        allow_invite
        available
        is_dm
        icon {
            uri
        }
    }
}
`;

export const createUserChatMutation = `
mutation createUserChat($input: UserChatMutation!){
    createUserChat(input: $input)
}
`;

export const deleteUserChatMutation = `
mutation deleteUserChat($input: UserChatMutation!){
    deleteUserChat(input: $input)
}
`;

export const switchOwnershipMutation = `
mutation switchOwnership($input: UserChatMutation!){
    switchOwnership(input: $input)
}
`;

export const getUserChatQuery = `
query getUserChat($input: UserChatQuery!){
    getUserChat(input: $input){
        notification
        is_owner
        rank
        timeout
    }
}
`

export const getAllChatIdQuery = `
query getAllChatId($input: ChatQuery!){
    getAllChatId(input: $input){
        id
    }
}
`

export const getSingleChatQuery = `
query getSingleChat($input: ChatQuery!){
    getSingleChat(input: $input){
        id
        name
        rank_req
        allow_modify
        allow_invite
        available
        is_dm
        icon {
            uri
        }
    }
}
`
export const getAllUserChatQuery = `
query getAllUserChat($input: UserChatQuery!){
    getAllUserChat(input: $input){
        users {
            userId
            notification
            is_owner
            rank
            timeout
            lastActiveAt
            displayName
            username
            icon
        }
        count
    }
}
`

export const timeoutUserMutation = `
mutation timeoutUser($input: UserChatMutation!){
    timeoutUser(input: $input)
}

`

export const changeUserChatNotificationMutation = `
mutation changeUserChatNotification($input: UserChatMutation!){
    changeUserChatNotification(input: $input)
}
`

export const searchUserChatQuery = `
query searchUserChat($input: UserChatQuery!){
    searchUserChat(input: $input){
        users {
            userId
            notification
            is_owner
            rank
            timeout
            lastActiveAt
            displayName
            username
            icon
        }
        count
    }
}
`

export const updatePinChatMutation = `
mutation updatePinChat($input: UserChatMutation!){
    updatePinChat(input: $input)
}
`