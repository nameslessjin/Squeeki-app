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
import {getTheme} from '../utils/theme';

class NominationPost extends React.Component {
  state = {
    posts: [],
    count: 0,
    nomineeId: '',
    time: '',
    nominationId: '',
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation, route} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerTitle: 'Nomination Posts',
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });

    this.setState({
      nomineeId: route.params.nomineeId,
      nominationId: route.params.nominationId,
      time: route.params.time,
    });

    this.loadNominationPost({...route.params, count: 0});
  }

  loadNominationPost = async props => {
    let {nomineeId, time, nominationId, count} = props;
    const {navigation, group, auth, getNominationPost} = this.props;

    // - 1 second.  For example, 5/23/2021 EST 8:59pm
    time = getSundays(time * 1000000 - 1000);
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
      // alert(req.errors[0].message);
      alert(
        'Cannot load nomination posts at this time, please try again later',
      );
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
        posts: prevState.posts.concat(
          req.posts.filter(p => {
            // filter duplicates
            const index = prevState.posts.findIndex(prev => prev.id == p.id);
            if (index == -1) {
              return true;
            }
            return false;
          }),
        ),
      };
    });
  };

  onEndReached = () => {
    this.loadNominationPost({...this.state});
  };

  render() {
    const {posts, count, theme} = this.state;
    const {group, navigation} = this.props;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.greyArea]}>
          <StatusBar barStyle={'dark-content'} />
          {count != 0 ? (
            <PostList
              posts={{posts: posts, count: count}}
              navigation={navigation}
              onEndReached={this.onEndReached}
              onRefresh={null}
              refreshing={null}
              prevRoute={'NominationPost'}
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
