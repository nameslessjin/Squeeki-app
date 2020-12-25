export const getCommentsFunc = async(input) => {
    const {data, userLogout, navigation, getComments} = input 
    const comments = await getComments(data)
    if (comments.errors) {
      alert(comments.errors[0].message)
      if (comments.errors[0].message == "Not Authenticated"){
        userLogout()
            navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    })
      }
      return;
    }


}