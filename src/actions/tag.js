import {
  createTagMutation,
  searchTagQuery,
  addTagToGroupMutation,
  removeTagFromGroupMutation,
} from './query/tagQuery';
import {httpCall} from './utils/httpCall'

export const searchTag = request => {
  const {term, count} = request;

  return async function(dispatch) {
    const input = {
      searchTerm: term,
      count: count || 0,
    };

    const graphql = {
      query: searchTagQuery,
      variables: {
        SearchTagInput: input,
      },
    };

    const result = await httpCall(null, graphql)

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

    const result = await httpCall(token, graphql)

    if (result.errors) {
      return result;
    }

    const tag = {
      ...result.data.createTag,
      use_count: 1,
    };
    dispatch(addTagToGroupReducer(tag));
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

    const result = await httpCall(token, graphql)

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

    const result = await httpCall(token, graphql)

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
