export const getGroupMembersFunc = async data => {
  const {
    token,
    getGroupMembers,
    navigation,
    userLogout,
    count,
    groupId,
    userIdList,
  } = data;

  const input = {
    token: token,
    count: count,
    groupId: groupId,
    userIdList: userIdList,
  };

  const members = await getGroupMembers(input);

  if (members.errors) {
    alert(members.errors[0].message);
    if (members.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }
    return;
  }
};

export const extractMembersWithRank = (members, groupAuth, rankName) => {
  const rank0 = members.filter(member => member.auth.rank == 0);
  const rank1 = members.filter(member => member.auth.rank == 1);
  const rank2 = members.filter(member => member.auth.rank == 2);
  const rank3 = members.filter(member => member.auth.rank == 3);
  const rank4 = members.filter(member => member.auth.rank == 4);
  const rank5 = members.filter(member => member.auth.rank == 5);
  const rank6 = members.filter(member => member.auth.rank == 6);
  const rank7 = members.filter(member => member.auth.rank == 7);

  const MembersWithRank = [
    {
      title: 'search',
      id: 'search',
      data: ['search']
    },
    {
      title: 'Root',
      id: 'rank0',
      data: groupAuth == 0 ? [rank0] : [[]],
    },
    {
      title: rankName.rank1Name,
      id: 'rank1',
      data: [rank1],
    },
    {
      title: rankName.rank2Name,
      id: 'rank2',
      data: [rank2],
    },
    {
      title: rankName.rank3Name,
      id: 'rank3',
      data: [rank3],
    },
    {
      title: rankName.rank4Name,
      id: 'rank4',
      data: [rank4],
    },
    {
      title: rankName.rank5Name,
      id: 'rank5',
      data: [rank5],
    },
    {
      title: rankName.rank6Name,
      id: 'rank6',
      data: [rank6],
    },
    {
      title: rankName.rank7Name,
      id: 'rank7',
      data: [rank7],
    },
  ];

  return MembersWithRank.filter(mr => mr.data[0].length != 0);
};

export const searchUserFunc = async data => {
  const {
    searchUser,
    auth,
    navigation,
    userLogout,
    count,
    searchTerm,
    groupId,
    userIdList,
    inGroup,
    checkin_id,
    chatId
  } = data;

  // if (searchTerm.length >= 3) {
    const input = {
      searchTerm: searchTerm,
      token: auth.token,
      groupId: groupId,
      count: count,
      userIdList: userIdList,
      inGroup: inGroup,
      checkin_id: checkin_id,
      chatId
    };

    const searchResult = await searchUser(input);
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
  // }
  // return 0;
};
