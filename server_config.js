import openSocket from 'socket.io-client'


// deployment
export const http = 'http://squeeki.appspot.com/graphql';
export const http_no_graphql = 'http://squeeki.appspot.com'

// mobile phone
// export const http = 'http://172.20.10.4:8080/graphql'
// export const http_no_graphql = 'http://172.20.10.4:8080'


// local
// export const http = 'http://192.168.1.151:8080/graphql'
// export const http_no_graphql = 'http://192.168.1.151:8080'

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