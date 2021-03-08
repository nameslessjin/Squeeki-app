import {gql} from '@apollo/client';

export const getChatMessageQuery = `
query getChatMessage($input: MessageQuery!){
    getChatMessage(input: $input){
        messages {
            _id
            text
            createdAt
            user {
                _id
                name
                title
                avatar
            }
        }
        pointer
    }
}
`;

export const getChatMessageQueryApollo = gql`
  query getChatMessage($input: MessageQuery!) {
    getChatMessage(input: $input) {
      messages {
        _id
        text
        createdAt
        user {
          _id
          name
          title
          avatar
        }
      }

    }
  }
`;

export const sendMessageMutation = `
mutation sendMessage($input: MessageMutation!){
    sendMessage(input: $input)
}
`;

export const sendMessageMutationApollo = gql`
  mutation sendMessage($input: MessageMutation!) {
    sendMessage(input: $input)
  }
`;

export const chatMessageSubscriptionApollo = gql`
  subscription newChatMessage($chatId: ID!) {
    newChatMessage(chatId: $chatId) {
      _id
      text
      createdAt
      user {
        _id
        name
        title
        avatar
      }
    }
  }
`;
