import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import React, {useState, useEffect, useReducer} from 'react';
import {
  useQuery,
  useMutation,
  NetworkStatus,
  useLazyQuery,
  useSubscription
} from '@apollo/client';
import {
  getChatMessageQueryApollo,
  sendMessageMutationApollo,
  chatMessageSubscriptionApollo
} from '../../actions/query/messageQuery';
import {TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Chat = props => {
  const [content, setContent] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [messages, setMessages] = useState([]);
  const [count, setCount] = useState(0);
  const chatId = props.chatId;
  const [sendMessage] = useMutation(sendMessageMutationApollo);

  const [getChatMessage, {data, error, previousData}] = useLazyQuery(
    getChatMessageQueryApollo,
    {
      variables: {
        input: {
          chatId,
          count: 0,
        },
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    },
  );


  const chatMessageSubscription = useSubscription(chatMessageSubscriptionApollo, {variables: chatId})

  if (error) {

  }


  if (data) {
    const {getChatMessage} = data;
    if (messages)
      if (messages.length == 0 && getChatMessage.messages.length != 0) {
        setMessages(
          getChatMessage.messages.map(m => {
            return {
              ...m,
              createdAt: new Date(parseInt(m.createdAt)),
            };
          }),
        );
      }
  }

  useEffect(() => {
    getChatMessage();
    // return () => {
    //   setMessages([])
    // }
  }, []);

  const user = {
    _id: '1',
  };

  const onSend = () => {
    const input = {
      content: content.trim(),
      chatId,
      media: null,
    };

    sendMessage({variables: {input: input}});
    setContent('');
  };

  const renderSend = p => {
    const text = content.trim();

    return (
      <TouchableOpacity
        onPress={p.onSend}
        style={{marginBottom: 10, marginRight: 10}}
        disabled={text.length == 0 || text.length > 200}>
        <MaterialIcons
          size={30}
          name={'arrow-up-drop-circle'}
          color={text.length == 0 || text.length > 200 ? 'grey' : '#EA2027'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      text={content}
      user={user}
      onInputTextChanged={setContent}
      onSend={onSend}
      primaryStyle={{backgroundColor: 'white'}}
      keyboardShouldPersistTaps={'never'}
      alwaysShowSend={true}
      bottomOffset={35}
      renderSend={renderSend}
    />
  );
};

const styles = StyleSheet.create({});

export default Chat;

const initialState = {count: 0, messages: []};

function reducer(state, action) {
  switch (action.i.type) {
    case 'load':
      return {...state, messages: action.i.messages};
    default:
      return state;
  }
}
