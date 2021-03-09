export const getChatQuery = `
query getChat($input: ChatQuery!){
    getChat(input: $input){
        chat {
            id
            name
            rank_req
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
        icon {
            uri
        }
    }
}
`;

export const createUserChatMutation = `
mutation createUserChat($input: ChatMutation!){
    createUserChat(input: $input)
}
`;

export const deleteUserChatMutation = `
mutation deleteUserChat($input: ChatMutation!){
    deleteUserChat(input: $input)
}
`;

export const switchOwnershipMutation = `
mutation switchOwnership($input: ChatMutation!){
    switchOwnership(input: $input)
}
`;

export const getUserChatQuery = `
query getUserChat($input: UserChatQuery!){
    getUserChat(input: $input){
        notification
        is_owner
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