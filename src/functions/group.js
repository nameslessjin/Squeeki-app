export const searchGroupFunc = async data => {
  const {
    searchGroup,
    auth,
    navigation,
    userLogout,
    count,
    searchTerm,
  } = data;

  if (searchTerm.length >= 3) {
    const input = {
      name: searchTerm,
      token: auth.token,
      count: count,
    };

    const searchResult = await searchGroup(input);
    if (searchResult.errors) {
      // alert(searchResult.errors[0].message);
      alert('Cannot search groups, please try again later')
      if (searchResult.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    return searchResult;
  }

  return 0;
};

export const getGroupJoinRequestCountFunc = async data => {
  const {
    func,
    navigation,
    auth,
    group,
    userLogout
  } = data

  const request = {
    token: auth.token,
    groupId: group.group.id
  }

  const req = await func(request);
  if (req.errors) {
    // alert(req.errors[0].message);
    alert('Cannot load join request count, please try again later')
    if (req.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return;
  }

}
