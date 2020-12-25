export const invalidAuthentication = (data) => {
    const {queryResult, userLogout, navigation } = data
    if (queryResult.errors){
        alert(queryResult.errors[0].message);
        if (queryResult.errors[0].message == 'Not Authenticated'){
            userLogout()
            navigation.reset({
              index: 0,
              routes: [{name: 'SignIn'}]
            })
          }
    }
    return
}