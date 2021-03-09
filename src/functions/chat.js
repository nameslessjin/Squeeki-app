export const getChatFunc = async data => {
  const {groupId, token, getChat, navigation, userLogout, count} = data;
  const request = {
    groupId,
    count,
    token,
  };

  const req = await getChat(request);
  if (req.errors) {
    console.log(req.errors)
    alert('Cannot load chat in at this time, please try again later');
    if (req.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return {chat: [], count: 0};
  }

  return req;
};

export const createUpdateChatFunc = async data => {
  const {
    groupId,
    name,
    rank_req,
    icon,
    token,
    navigation,
    userLogout,
    createChat,
    updateChat,
    chatId,
  } = data;
  const request = {
    groupId,
    name,
    rank_req,
    icon: icon,
    token,
    chatId,
  };

  let req = 0;
  req = chatId ? await updateChat(request) : await createChat(request);

  if (req.errors) {
    console.log(req.errors[0].message);
    alert('Cannot create chat in at this time, please try again later');
    if (req.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return;
  }

  return req;
};

export const deleteLeaveChatFunc = async data => {
  const {chatId, auth, userLogout, navigation, deleteLeaveChat} = data;

  const request = {
    chatId,
    token: auth.token,
  };

  const req = await deleteLeaveChat(request);

  if (req.errors) {
    console.log(req.errors);
    alert(
      'Cannot leave or delete chat in at this time, please try again later',
    );
    if (req.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return 0;
  }

  navigation.navigate('Chats');

  return 0;
};
