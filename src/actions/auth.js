import {
  signinQuery,
  signupQuery,
  updateProfileMutation,
  changePasswordMutation,
  requireVerificationCodeMutation,
  checkVerificationCodeQuery,
  resetPasswordMutation,
} from '../actions/query/authQuery';
import {http, http_upload} from '../../server_config';
// import AsyncStorage from '@react-native-community/async-storage';

export const signup = data => {
  const {email, password, username, icon, refer_code} = data;
  return async function(dispatch) {
    let uploadIcon = null;
    const userInput = {
      email: email,
      password: password,
      username: username,
      icon: uploadIcon,
      refer_code: refer_code,
    };

    const graphQL = {
      query: signupQuery,
      variables: {
        userInput: userInput,
      },
    };

    const user = await fetch(http, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQL),
    });

    const userData = await user.json();
    if (userData.errors) {
      return userData;
    }
    dispatch(userSignIn(userData.data.signup));
    // AsyncStorage.setItem('token', userData.data.signup.token);
    return 0;
  };
};

export const signin = data => {
  const {email, password, token} = data;
  return async function(dispatch) {
    const graphQL = {
      query: signinQuery,
      variables: {
        email: email,
        password: password,
        token: token,
      },
    };

    const user = await fetch(http, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQL),
    });

    const userData = await user.json();

    if (userData.errors) {
      return userData;
    }
    dispatch(userSignIn(userData.data.login));

    // AsyncStorage.setItem('token', userData.data.login.token).catch(err =>
    //   console.log(err),
    // );

    return 0;
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

    if (icon != null) {
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

      newIcon = {
        uri: iconUri.url,
        name: iconUri.name,
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
      email: newEmail,
      username: newUsername,
      icon: newIcon,
      displayName: newDisplayName,
    };

    const graphQl = {
      query: updateProfileMutation,
      variables: {
        userInput: userInput,
      },
    };

    const user = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });

    const userData = await user.json();
    if (userData.errors) {
      return userData;
    }

    dispatch(userSignIn(userData.data.updateProfile));
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

    const graphQl = {
      query: changePasswordMutation,
      variables: {
        userInput: userInput,
      },
    };

    const user = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQl),
    });

    const userData = await user.json();

    if (userData.errors) {
      return userData;
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
        email: email,
      },
    };

    const verificationFetch = await fetch(http, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const verification = await verificationFetch.json();
    if (verification.errors) {
      return verification;
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

    const verificationFetch = await fetch(http, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const verification = await verificationFetch.json();
    if (verification.errors) {
      return verification;
    }

    return verification.data.checkVerificationCode;
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

    const resetFetch = await fetch(http, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphql),
    });

    const reset = await resetFetch.json();
    if (reset.errors) {
      return reset;
    }

    return 0;
  };
};
