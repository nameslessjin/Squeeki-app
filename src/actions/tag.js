import {
  createTagMutation,
  searchTagQuery,
  addTagToGroupMutation,
  removeTagFromGroupMutation,
} from './query/tagQuery';

export const searchTag = request => {
  const {term, count, current_tags_id} = request;

  return async function(dispatch) {
    const input = {
      searchTerm: term,
      count: count || 0,
      current_tags_id: current_tags_id,
    };

    const graphql = {
      query: searchTagQuery,
      variables: {
        SearchTagInput: input,
      },
    };

    const req = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return result.data.searchTag;
  };
};

export const createTag = request => {
  const {tag_name, token, groupId} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      tag_name: tag_name,
    };

    const graphql = {
      query: createTagMutation,
      variables: {
        CreateTagInput: input,
      },
    };

    const req = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const addTagToGroup = request => {
  const {token, groupId, tag} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      tagId: tag.id,
    };

    const graphql = {
      query: addTagToGroupMutation,
      variables: {
        GroupTagInput: input,
      },
    };

    const req = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    const new_tag = {
      ...tag,
      use_count: tag.use_count + 1,
    };
    dispatch(addTagToGroupReducer(new_tag));

    return 0;
  };
};

const addTagToGroupReducer = data => {
  return {
    type: 'addTagToGroup',
    tag: data,
  };
};

export const removeTagFromGroup = request => {
  const {token, groupId, tag} = request;

  return async function(dispatch) {
    const input = {
      groupId: groupId,
      tagId: tag.id,
    };

    const graphql = {
      query: removeTagFromGroupMutation,
      variables: {
        GroupTagInput: input,
      },
    };

    const req = await fetch('http://192.168.86.24:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const result = await req.json();

    if (result.errors) {
      return result;
    }

    const new_tag = {
      ...tag,
      use_count: tag.use_count + 1,
    };
    dispatch(removeTagFromGroupReducer(new_tag));

    return 0;
  };
};

const removeTagFromGroupReducer = data => {
  return {
    type: 'removeTagFromGroup',
    tag: data,
  };
};
