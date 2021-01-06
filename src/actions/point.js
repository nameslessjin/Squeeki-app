import {getUserGroupPointQuery} from './query/pointQuery';

export const getUserGroupPoint = request => {
  const {token, groupId} = request;

  return async function(dispatch) {
    const graphql = {
      query: getUserGroupPointQuery,
      variables: {
        input: groupId,
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

    console.log(result.data.getUserGroupPoint)
    dispatch(getUserGroupPointReducer(result.data.getUserGroupPoint))

    return 0;
  };
};

const getUserGroupPointReducer = data => {
    return {
        type: 'getUserGroupPoint',
        point: data
    }
}