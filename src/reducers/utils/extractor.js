export const groupsExtractorWOBackground = raw => {
  const groups = raw.groups.map(group => {
    const data = {
      ...group,
    };
    return data;
  });

  const groupsData = {
    groups: groups,
    count: raw.count,
  };

  return groupsData;
};

export const groupExtractor = raw => {
  const group = {
    ...raw,
  };

  return group;
};

export const usersExtractor = raw => {
  const users = raw.users.map(user => user);
};

export const reconstructPostsInReducer = posts => {
  return posts
};
