import {httpCall} from './utils/httpCall';
import {searchLocationQuery, getLocationQuery} from './query/locationQuery';

export const searchLocation = data => {
  const {lat, lng, searchTerm, token} = data;

  return async function(dispatch) {
    const input = {
      searchTerm,
      lat,
      lng,
    };

    const graphql = {
      query: searchLocationQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.searchLocation;
  };
};

export const getLocation = data => {
  const {place_id} = data;

  return async function(dispatch) {
    const input = {
      place_id,
    };

    const graphql = {
      query: getLocationQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(null, graphql);
    if (result.errors) {
      return result;
    }

    return result.data.getLocation;
  };
};
