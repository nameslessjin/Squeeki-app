import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {getPost} from '../actions/post';
import {getComments, createComment, cleanComment} from '../actions/comment';
import {userLogout} from '../actions/auth';
import {getCommentsFunc} from '../functions/comment';
import CommentList from '../components/comment/commentList';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class Comment extends React.Component {
  componentDidMount() {
    this.getPostComment();
    this.inputHeight = 35;
    const {navigation} = this.props

    navigation.setOptions({
        headerBackTitleVisible: false
    })
  }

  componentWillUnmount() {
    this.props.cleanComment();
  }

  state = {
    newComment: '',
    post: {
      allowComment: true,
    },
    loading: false,
    comments: [],
    inputHeight: 35,
    sent: false,
  };

  getPostComment = async () => {
    const {getPost, getComments, navigation, userLogout} = this.props;
    const {postId} = this.props.route.params;
    const {token} = this.props.auth;
    const data = {
      token: token,
      postId: postId,
      lastIndexId: null,
    };
    const postData = await getPost(data);
    if (postData.errors) {
      alert(postData.errors[0].message);
      if (postData.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    const post = postData.data.getPost;

    this.setState(prevState => ({
      post: post,
    }));

    Keyboard.dismiss();

    const input = {
      data: data,
      getComments: getComments,
      navigation: navigation,
      userLogout: userLogout,
    };

    getCommentsFunc(input);
  };

  componentDidUpdate(prevProps, prevState) {
    const prevComment = prevProps.comment;
    const {comment} = this.props;
    if (prevComment.comments != comment.comments) {
      this.setState(prevState => ({
        comments: comment.comments.comments,
      }));
    }
  }

  onEndReached = () => {
    this.setState({loading: true});
    const {lastIndexId} = this.props.comment.comments;
    const {token} = this.props.auth;
    const {postId} = this.props.route.params;
    const {getComments, navigation, userLogout} = this.props;
    const data = {
      token: token,
      postId: postId,
      lastIndexId: lastIndexId,
    };

    const input = {
      data: data,
      getComments: getComments,
      navigation: navigation,
      userLogout: userLogout,
    };

    getCommentsFunc(input);
    this.setState({loading: false});
  };

  updateComment = data => {
    this.setState({newComment: data});
  };
  onSend = async () => {
    const {navigation, userLogout} = this.props;
    const {newComment} = this.state;
    const {token} = this.props.auth;
    const {postId} = this.props.route.params;
    const data = {
      comment: newComment,
      token: token,
      postId: postId,
      lastIndexId: null,
    };
    this.setState({sent: true});
    Keyboard.dismiss();
    const comment = await this.props.createComment(data);
    if (comment.errors) {
      alert(comment.errors[0].message);
      if (comment.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({newComment: '', sent: false});
  };

  render() {
    const {container} = styles;
    const {token} = this.props.auth;
    const {comments, post, inputHeight, newComment, sent} = this.state;
    const disabled = newComment.trim().length == 0;
    return (
      <KeyboardAvoidingView
        style={container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'overflow'}
        keyboardVerticalOffset={35}>
        <StatusBar barStyle={'dark-content'} />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{flex: 1}}>
            <CommentList
              post={post}
              comments={comments}
              onEndReached={this.onEndReached}
              sent={sent}
            />
            {post.allowComment ? (
              <View style={styles.textInputContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    {height: Math.max(35, inputHeight + 10)},
                  ]}
                  placeholder={'Add a comment ...'}
                  multiline={true}
                  maxLength={250}
                  onContentSizeChange={e =>
                    this.setState({
                      inputHeight: e.nativeEvent.contentSize.height,
                    })
                  }
                  onChangeText={text => this.setState({newComment: text})}
                  value={newComment}
                />
                {sent ? (
                  <ActivityIndicator animating={true}/>
                ) : (
                  <TouchableOpacity disabled={disabled} onPress={this.onSend}>
                    <MaterialIcons
                      name={
                        disabled
                          ? 'arrow-up-drop-circle-outline'
                          : 'arrow-up-drop-circle'
                      }
                      size={30}
                      color={disabled ? '#718093' : '#273c75'}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  textInputContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Platform.OS == 'ios' ? 55 : 20,
  },
  textInput: {
    lineHeight: 16,
    fontSize: 16,
    marginLeft: 10,
    width: '85%',
    // borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    borderRadius: 10,
    padding: 5,
    paddingTop: 10,
  },
});

const mapStateToProps = state => {
  const {auth, post, comment} = state;
  return {auth, post, comment};
};
const mapDispatchToProps = dispatch => {
  return {
    getPost: data => dispatch(getPost(data)),
    getComments: data => dispatch(getComments(data)),
    createComment: data => dispatch(createComment(data)),
    userLogout: () => dispatch(userLogout()),
    cleanComment: () => dispatch(cleanComment()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Comment);
