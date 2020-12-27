import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StatusBar,
  Keyboard,
  Text,
} from 'react-native';
import {getNominationPost} from '../actions/post';
import {connect} from 'react-redux';
import PostList from '../components/posts/postList';
import {userLogout} from '../actions/auth';
import {getSundays} from '../utils/time';

class NominationPost extends React.Component {
  state = {
    posts: [],
    count: 0,
    nomineeId: '',
    time: '',
    nominationId: ''
  };

  componentDidMount() {
    const {navigation, route} = this.props;
    navigation.setOptions({
      headerTitle: 'Nomination Posts',
      headerBackTitleVisible: false,
    });

    this.setState({
        nomineeId: route.params.nomineeId,
        nominationId: route.params.nominationId,
        time: route.params.time
    })

    this.loadNominationPost({...route.params, count: 0});
  }

  loadNominationPost = async props => {
    console.log(props);

    let {nomineeId, time, nominationId, count} = props;
    const {navigation, group, auth, getNominationPost} = this.props;
    time = getSundays(time * 1000000);
    const request = {
      token: auth.token,
      groupId: group.group.id,
      time: time,
      nomineeId: nomineeId,
      nominationId: nominationId,
      count: count,
    };

    const req = await getNominationPost(request);
    if (req.errors) {
      alert(req.errors[0].message);
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState(prevState => {
      return {
        ...prevState,
        count: req.count,
        posts: prevState.posts.concat(req.posts),
      };
    });
  };

  onEndReached = () => {
    this.loadNominationPost({...this.state})
  }

  render() {
    const {posts, count} = this.state;
    const {group, navigation} = this.props;
    console.log(posts);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {count != 0 ? (
            <PostList
              posts={{posts: posts, count: count}}
              navigation={navigation}
              onEndReached={this.onEndReached}
              onRefresh={null}
              refreshing={null}
            />
          ) : (
            <Text style={styles.noPostStyle}>
              Posts for this nomination were deleted
            </Text>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  noPostStyle: {
    color: 'grey',
    fontStyle: 'italic',
    marginTop: 300,
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getNominationPost: data => dispatch(getNominationPost(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NominationPost);
