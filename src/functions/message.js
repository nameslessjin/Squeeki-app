export const sendMessageFunc = async data => {
  const {token, chatId, content, sendMessage, navigation, userLogout} = data;

  const request = {
    token,
    chatId,
    content,
  };

  const req = await sendMessage(request);

  if (req.errors) {
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
  const {token, chatId, getChatMessage, navigation, userLogout, count} = data;
  const request = {
    token,
    chatId,
    count
  };

  const req = await getChatMessage(request);

  if (req.errors) {
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

  return req;
};
