export const loadLeaderBoardFunc = async data => {
  const {
    userLogout,
    auth,
    getGroupPointLeaderBoard,
    navigation,
    group,
    count,
    limit,
    period
  } = data;
  const request = {
    token: auth.token,
    groupId: group.group.id,
    count: count,
    limit: limit,
    period: period
  };

  const req = await getGroupPointLeaderBoard(request);
  if (req.errors) {
    alert(req.errors[0].message);
    if (req.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return;
  }

};
