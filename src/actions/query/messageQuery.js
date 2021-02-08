export const getChatMessageQuery = `
query getChatMessage($input: MessageQuery!){
    getChatMessage(input: $input){
        message {
            id
            content
            createdAt
            user {
                id
                username
                title
                icon {
                    uri
                }
            }
        }
        count
    }
}
`

export const sendMessageMutation = `
mutation sendMessage($input: MessageMutation!){
    sendMessage(input: $input)
}
`