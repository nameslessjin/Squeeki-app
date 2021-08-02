export const loadLeaderBoardFunc = async data => {
  const {
    userLogout,
    auth,
    getGroupPointLeaderBoard,
    navigation,
    group,
    count,
    limit,
    period,
    init
  } = data;
  const request = {
    token: auth.token,
    groupId: group.group.id,
    count,
    limit,
    period,
    init
  };

  const req = await getGroupPointLeaderBoard(request);
  if (req.errors) {
    // alert(req.errors[0].message);
    alert('Cannot leaderboard, please try again later')
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
