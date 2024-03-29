import {
  signinQuery,
  signupQuery,
  updateProfileMutation,
  changePasswordMutation,
  requireVerificationCodeMutation,
  checkVerificationCodeQuery,
  resetPasswordMutation,
  updateNotificationsMutation,
  updateVisibilitiesMutation,
  getDefaultIconQuery,
  updateThemeMutation,
  createEmailAndPasswordMutation,
} from '../actions/query/authQuery';
import {http_upload} from '../../server_config';
import {httpCall} from './utils/httpCall';

export const signup = data => {
  const {email, password, username, icon, refer_code, deviceId} = data;
  return async function(dispatch) {
    const userInput = {
      // email: email,
      // password: password,
      username: username,
      icon: icon,
      deviceId,
    };

    const graphql = {
      query: signupQuery,
      variables: {
        userInput: userInput,
      },
    };

    const result = await httpCall(null, graphql);

    if (result.errors) {
      return result;
    }
    dispatch(userSignIn(result.data.signup));
    // AsyncStorage.setItem('token', userData.data.signup.token);
    return 0;
  };
};

export const signin = data => {
  const {email, password, token} = data;
  return async function(dispatch) {
    const input = {
      email: email ? email.trim().toLowerCase() : null,
      password,
      token,
    };
    const graphql = {
      query: signinQuery,
      variables: {
        input,
      },
    };

    const result = await httpCall(null, graphql);

    if (result.errors) {
      return result;
    }
    dispatch(userSignIn(result.data.login));

    return result.data.login.user;
  };
};

export const updateProfile = data => {
  const {updateData, origin} = data;
  const {email, username, icon, token, displayName} = updateData;

  return async function(dispatch) {
    let newEmail = email;
    let newUsername = username;
    let newIcon = icon;
    let newDisplayName = displayName;
    let newIconName = null;
    let newIconUri = null;
    if (icon != null) {
      if (icon.data) {
        const iconData = new FormData();
        iconData.append('filename', icon.filename);
        iconData.append('fileType', icon.type);
        iconData.append('fileData', icon.data);
        iconData.append('fileCategory', 'userIcons');

        const iconPost = await fetch(http_upload, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',
          },
          body: iconData,
        });
        if (iconPost.status == 500) {
          alert('uploading icon failed');
          return 1;
        }
        const iconUri = await iconPost.json();
        if (iconUri.error) {
          return iconUri;
        }

        newIconName = iconUri.name;
        newIconUri = iconUri.url;
      } else {
        newIconUri = icon.uri;
      }

      newIcon = {
        uri: newIconUri,
        name: newIconName,
      };
    }

    if (username == null) {
      newUsername = origin.username;
    }

    if (email == null) {
      newEmail = origin.email;
    }

    if (displayName == null) {
      newDisplayName = origin.displayName;
    }

    const userInput = {
      email: newEmail ? newEmail.trim().toLowerCase() : null,
      username: newUsername,
      icon: newIcon,
      displayName: newDisplayName,
    };

    const graphql = {
      query: updateProfileMutation,
      variables: {
        userInput: userInput,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(userSignIn(result.data.updateProfile));
    return 0;
  };
};

export const createEmailAndPassword = data => {
  const {token, email, password} = data;

  return async function(dispatch) {
    const input = {
      email: email.trim().toLowerCase(),
      password,
    };

    const graphql = {
      query: createEmailAndPasswordMutation,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    dispatch(userSignIn(result.data.createEmailAndPassword));
    return 0;
  };
};

export const userLogout = () => {
  return {
    type: 'logout',
  };
};

const userSignIn = data => {
  return {
    type: 'signin',
    auth: data,
  };
};

export const changePassword = data => {
  const {currentPassword, newPassword, token} = data;
  return async function(dispatch) {
    const userInput = {
      password: currentPassword,
      newPassword: newPassword,
    };

    const graphql = {
      query: changePasswordMutation,
      variables: {
        userInput: userInput,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const requireVerificationCode = data => {
  const email = data;

  return async function(dispatch) {
    const graphql = {
      query: requireVerificationCodeMutation,
      variables: {
        email: email.trim().toLowerCase(),
      },
    };

    const result = await httpCall(null, graphql);

    if (result.errors) {
      return result;
    }
    return 0;
  };
};

export const checkVerificationCode = data => {
  return async function(dispatch) {
    const verificationInput = data;

    const graphql = {
      query: checkVerificationCodeQuery,
      variables: {
        verificationInput: verificationInput,
      },
    };

    const result = await httpCall(null, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.checkVerificationCode;
  };
};

export const resetPassword = data => {
  const {newPassword, token} = data;
  return async function(dispatch) {
    const graphql = {
      query: resetPasswordMutation,
      variables: {
        newPassword: newPassword,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    return 0;
  };
};

export const updateNotifications = data => {
  const {
    token,
    notification_all,
    notification_group,
    notification_post_like,
    notification_post_comment,
    notification_post_mention,
    notification_comment_like,
    notification_comment_reply,
    notification_comment_mention,
    notification_chat,
    notification_chat_message,
    notification_chat_mention,
  } = data;

  return async function(dispatch) {
    const input = {
      notification_all,
      notification_group,
      notification_post_like,
      notification_post_comment,
      notification_post_mention,
      notification_comment_like,
      notification_comment_reply,
      notification_comment_mention,
      notification_chat,
      notification_chat_message,
      notification_chat_mention,
    };

    const graphql = {
      query: updateNotificationsMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(notificationsUpdate(input));

    return 0;
  };
};

const notificationsUpdate = data => {
  return {
    type: 'updateNotifications',
    i: data,
  };
};

export const updateVisibilities = data => {
  const {
    token,
    visibility_all,
    visibility_chat_search,
    visibility_group_search,
    visibility_post_at,
    visibility_chat_at,
  } = data;

  return async function(dispatch) {
    const input = {
      visibility_all,
      visibility_chat_search,
      visibility_group_search,
      visibility_post_at,
      visibility_chat_at,
    };

    const graphql = {
      query: updateVisibilitiesMutation,
      variables: {
        input: input,
      },
    };

    const result = await httpCall(token, graphql);

    if (result.errors) {
      return result;
    }

    dispatch(visibilitiesUpdate(input));

    return 0;
  };
};

const visibilitiesUpdate = data => {
  return {
    type: 'updateVisibilities',
    i: data,
  };
};

export const getDefaultIcon = data => {
  return async function(dispatch) {
    const graphql = {
      query: getDefaultIconQuery,
    };

    const result = await httpCall(null, graphql);

    if (result.errors) {
      return result;
    }

    return result.data.getDefaultIcon;
  };
};

export const updateTheme = data => {
  const {theme, token} = data;

  return async function(dispatch) {
    const input = {
      theme,
    };
    const graphql = {
      query: updateThemeMutation,
      variables: {
        input,
      },
    };

    const result = await httpCall(token, graphql);
    if (result.errors) {
      return result;
    }

    dispatch(updateThemeReducer(theme));
    return 0;
  };
};

const updateThemeReducer = data => {
  return {
    type: 'updateTheme',
    i: data,
  };
};
