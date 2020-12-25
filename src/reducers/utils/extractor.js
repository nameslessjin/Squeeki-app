export const groupsExtractorWOBackground = (raw) => {
    const groups = raw.groups.map(group => {
        const data = {
            ...group,
        }
        return data
    })

    const groupsData = {
        groups: groups,
        count: raw.count,
        lastIndexId: raw.lastIndexId
    }

    return groupsData
}

export const groupExtractor = (raw) => {

    const group = {
        ...raw,
    }

    return group
}

export const usersExtractor = (raw) => {
    const users = raw.users.map(user => user)
}

export const reconstructPostsInReducer = posts => {
    return posts.map(p => {
      const expiration_date = new Date(parseInt(p.priority_expiration_date));
      const diff = expiration_date - Date.now();
      let duration = 0;
      if (diff > 0) {
        duration = Math.ceil(diff / (1000 * 60 * 60 * 24));
      }
      return {
        ...p,
        priorityDuration: duration,
      };
    });
  };