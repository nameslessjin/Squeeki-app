export const sendMessageFunc = async data => {
  const {token, chatId, content, sendMessage, navigation, userLogout, media, message_status} = data;

  const request = {
    token,
    chatId,
    content,
    media,
    status: message_status
  };

  const req = await sendMessage(request);

  if (req.errors) {
    console.log(req.errors)
    if (req.errors[0].message == 'You are currently not in the chat'){
      alert('You are removed from the chat.')
      navigation.goBack();
      return
    }
    alert('Cannot send message at this time, please try again later.')
    if (req.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    } else {
      return req;
    }
  }

  return 0;
};

export const getChatMessageFunc = async data => {
  const {token, chatId, getChatMessage, navigation, userLogout, pointer, is_dm} = data;
  const request = {
    token,
    chatId,
    pointer,
    is_dm
  };

  const req = await getChatMessage(request);

  if (req.errors) {
    console.log(req.errors)
    alert('Cannot load chat at this time, please try again later.')
    if (req.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    } else {
      return false;
    }
  }

  return req;
};
