import {logUserEventMutation} from './query/userEventQuery';
import {httpCall} from './utils/httpCall';

export const logUserEvent = data => {
  const {token, log} = data;

  return async function(dispatch) {
    const input = log;

    const graphql = {
      query: logUserEventMutation,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      console.log(result);
    }
  };
};