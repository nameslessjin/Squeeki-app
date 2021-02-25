import {split, HttpLink} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {ApolloClient, InMemoryCache} from '@apollo/client';


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

  // console.log('apollo here')
  // console.log(splitLink)

  const client = new ApolloClient({
    // uri: 'http://192.168.86.24:8080/graphql',
    link: splitLink,
    cache: new InMemoryCache(),
    
  });

  return client;
};

// export const http = 'http://squeeki.appspot.com/graphql';

export const http_upload = 'http://squeeki.appspot.com/uploadImage'

export const http = 'http://192.168.86.24:8080/graphql'
