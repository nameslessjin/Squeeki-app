import {split, HttpLink} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import openSocket from 'socket.io-client'

// initialize apollo client
export const apolloClient = (token) => {

  const httpLink = new HttpLink({
    uri: 'http://192.168.86.24:8080/graphql',
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });


  const wsLink = new WebSocketLink({
    uri: `ws://192.168.86.24:8080/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: token
      }
    },
  });


  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    // uri: 'http://192.168.86.24:8080/graphql',
    link: splitLink,
    cache: new InMemoryCache(),
    
  });

  return client;
};

// deployment
// export const http = 'http://squeeki.appspot.com/graphql';
// export const http_no_graphql = 'http://squeeki.appspot.com'

// mobile phone
// export const http = 'http://172.20.10.4:8080/graphql'
// export const http_no_graphql = 'http://172.20.10.4:8080'


// local
export const http = 'http://192.168.1.151:8080/graphql'
export const http_no_graphql = 'http://192.168.1.151:8080'

export const http_upload = 'http://squeeki.appspot.com/uploadImage'



let io;
export const socket = {
  init: () => {
    io = openSocket.io(http_no_graphql)
  },
  getIO: () => {
    if (!io){
      throw new Error('Socket Connection Not initialized!')
    }
    return io
  }
}