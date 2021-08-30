export const getFeedFunc = async data => {
  const {token, getFeed, navigation, userLogout, count, lat, lng} = data;
  const request = {
    token,
    count,
    lat,
    lng
  }
  const feedData = await getFeed(request);
  if (feedData.errors) {
    alert(feedData.errors[0].message);
    if (feedData.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return;
  }
};

export const getGroupPostsFunc = async data => {
  const {
    token,
    getGroupPosts,
    navigation,
    userLogout,
    groupId,
    count,
  } = data;

  const inputData = {
    groupId: groupId,
    token: token,
    count: count,
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
