export const searchGroupFunc = async data => {
  const {
    searchGroup,
    auth,
    navigation,
    userLogout,
    lastIndexId,
    searchTerm,
  } = data;

  if (searchTerm.length >= 3) {
    const input = {
      name: searchTerm,
      token: auth.token,
      lastIndexId: lastIndexId,
    };

    const searchResult = await searchGroup(input);
    if (searchResult.errors) {
      alert(searchResult.errors[0].message);

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
