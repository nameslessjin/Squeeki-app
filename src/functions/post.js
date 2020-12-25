export const getFeedFunc = async data => {
  const {token, getFeed, navigation, userLogout, lastIndexId} = data;
  const feedData = await getFeed({token: token, lastIndexId: lastIndexId});
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
    lastIndexId,
  } = data;

  const inputData = {
    groupId: groupId,
    token: token,
    lastIndexId: lastIndexId,
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

