export const getFeedFunc = async data => {
  const {token, getFeed, navigation, userLogout, count, lat, lng} = data;
  const request = {
    token,
    count,
    lat,
    lng,
  };

  if (token) {
    const feedData = await getFeed(request);
    if (feedData.errors) {
      console.log(feedData.errors[0].message);
      alert('Cannot get feed at this time, please try again later');
      if (feedData.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  }
  return;
};

export const getGroupPostsFunc = async data => {
  const {token, getGroupPosts, navigation, userLogout, groupId, count, type} = data;

  const inputData = {
    groupId: groupId,
    token: token,
    count: count,
    type
  };

  const groupPosts = await getGroupPosts(inputData);
  if (groupPosts.errors) {
    alert(groupPosts.errors[0].message);
    if (groupPosts.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return;
  }
};
