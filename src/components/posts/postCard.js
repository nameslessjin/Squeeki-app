import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {dateConversion} from '../../utils/time';
import PostFooter from './postFooter';
import PostHeader from './postHeader';
import {connect} from 'react-redux';
import {
  deletePost,
  likePost,
  changePostNotification,
  reportPost,
} from '../../actions/post';
import {voteNominee} from '../../actions/nomination';
import {userLogout} from '../../actions/auth';
import PostMedia from './postMedia';
import PostNomination from './postNomination';

class PostCard extends React.Component {
  state = {
    ...this.props.item,
    modalToggled: false,
    loading: false,
    is_report_toggled: false,
    report: '',
    onReport: false,
    voting: false,
    selected: false,
  };

  onPostDelete = () => {
    // this.setState({modalToggled: false})
    Alert.alert('Delete post', 'Do you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => this.onBackDropPress(),
      },
      {
        text: 'DELETE',
        onPress: () => this.deletePost(),
        style: 'destructive',
      },
    ]);
  };

  onPostReport = () => {
    this.setState({is_report_toggled: true});
  };

  onReportInput = content => {
    this.setState({report: content});
  };

  onSubmitReport = async () => {
    this.setState({onReport: true});
    const {report, id} = this.state;
    const {auth, userLogout, reportPost} = this.props;
    const data = {
      token: auth.token,
      postId: id,
      content: report,
    };
    const reportResult = await reportPost(data);
    this.setState({onReport: false});
    if (reportResult.errors) {
      // alert(reportResult.errors[0].message);
      alert('Cannot report post at this time, please try again later')
      if (reportResult.errors[0].message == 'Not Authenticated') {
        userLogout;
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }
    this.onBackDropPress();
  };

  onPostNotification = async () => {
    const {auth, changePostNotification, userLogout, navigation} = this.props;
    const {id, notificationId} = this.state;
    const data = {
      token: auth.token,
      postId: id,
    };

    const notificationResult = await changePostNotification(data);

    if (notificationResult.errors) {
      // alert(notificationResult.errors[0].message);
      alert('Cannot change notification at this time, please try again later')
      if (notificationResult.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    if (notificationId == null) {
      this.setState({notificationId: 1});
    } else {
      this.setState({notificationId: null});
    }

    this.onBackDropPress();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.item != this.props.item) {
      this.setState(prevState => {
        return {
          ...prevState,
          ...this.props.item,
        };
      });
    }
  }

  deletePost = async () => {
    const {item, navigation} = this.props;
    const {id, auth, groupAuth} = item;
    const data = {
      postId: id,
      token: this.props.auth.token,
    };

    // exam this logic
    const currentUserAuth = this.props.group.group.auth;
    let currentUserAuthQualified = false;
    if (currentUserAuth && groupAuth) {
      if (currentUserAuth.rank < groupAuth.rank && currentUserAuth.rank <= 2) {
        currentUserAuthQualified = true;
      }
    }

    if (auth || currentUserAuthQualified) {
      const post = await this.props.deletePost(data);
      if (post.errors) {
        // alert(post.errors[0].message);
        alert('Cannot delete post at this time, please try again later')
        if (post.errors[0].message == 'Not Authenticated') {
          userLogout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
        }
      }
    } else {
      alert('Not authorized');
    }
  };

  onPostUpdate = () => {
    const {auth, groupAuth} = this.props.item;
    const {navigation, prev_route} = this.props;
    const currentUserAuth = this.props.group.group.auth;

    let currentUserAuthQualified = false;
    if (currentUserAuth && groupAuth) {
      // group owner can set post change restriction
      if (currentUserAuth.rank < groupAuth.rank && currentUserAuth.rank <= 2) {
        currentUserAuthQualified = true;
      }
    }

    if (auth || currentUserAuthQualified) {
      const postData = {
        ...this.props.item,
      };
      navigation.navigate('PostSetting', {
        postData: postData,
        create: false,
        prev_route: prev_route
      });
      this.onBackDropPress();
    } else {
      alert('Not Authorized');
    }
  };

  onLikePress = async () => {
    const {auth, likePost, navigation} = this.props;
    const {id, liked, likeCount} = this.state;
    const data = {
      postId: id,
      token: auth.token,
    };

    this.setState({loading: true});
    const like = await likePost(data);
    this.setState({loading: false});
    if (like.errors) {
      // alert(like.errors[0].message);
      alert('Cannot like post at this time, please try again later')
      if (like.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    this.setState(prevState => {
      return {
        ...prevState,
        liked: !prevState.liked,
        likeCount: prevState.liked ? prevState.likeCount - 1 : prevState.likeCount + 1
      }
    })

  };

  toggleModal = () => {
    this.setState({modalToggled: true});
  };

  onBackDropPress = () => {
    this.setState({modalToggled: false, is_report_toggled: false, report: ''});
  };

  onVotePress = async () => {
    const {nomination} = this.state;
    const {auth, voteNominee, navigation, item} = this.props;
    const data = {
      token: auth.token,
      nomination: nomination,
      groupId: item.groupId,
    };

    this.setState({voting: true});
    const vote = await voteNominee(data);
    this.setState({voting: false});

    if (vote.errors) {
      // alert(vote.errors[0].message);
      alert('Cannot vote nominee at this time, please try again later')
      if (vote.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    if (nomination.voted == false) {
      this.setState(prevState => {
        return {
          ...prevState,
          nomination: {
            ...prevState.nomination,
            voted: true,
          },
        };
      });
    }
  };

  render() {
    const {
      id,
      image,
      content,
      createdAt,
      user,
      commentCount,
      auth,
      likeCount,
      liked,
      modalToggled,
      type,
      priority,
      groupAuth,
      notificationId,
      is_report_toggled,
      report,
      onReport,
      loading,
      nomination,
      voting,
      selected,
      checked,
    } = this.state;
    const {option, commentTouchable, selectionMode, onPostSelect, group, navigation} = this.props;
    const {username, icon, displayName, group_username} = user;
    const date = dateConversion(createdAt);

    let backgroundColor = 'white';
    if (priority == 3) {
      backgroundColor = '#fab1a0';
    } else if (priority == 2) {
      backgroundColor = '#c7ecee';
    } else if (priority == 1) {
      backgroundColor = '#b8e999';
    }

    return (
      <TouchableWithoutFeedback
        onPress={() =>
          selectionMode && !checked ? onPostSelect({...this.props.item}) : null
        }>
        <View style={[styles.container, {backgroundColor: backgroundColor}]}>
          <PostHeader
            icon={icon}
            username={username}
            displayName={displayName}
            group_username={group_username}
            date={date}
            auth={auth}
            groupAuth={groupAuth}
            postId={id}
            onPostUpdate={this.onPostUpdate}
            onPostDelete={this.onPostDelete}
            onPostNotification={this.onPostNotification}
            modalToggled={modalToggled}
            toggleModal={this.toggleModal}
            onBackDropPress={this.onBackDropPress}
            type={type}
            priority={priority}
            notificationId={notificationId}
            onPostReport={this.onPostReport}
            is_report_toggled={is_report_toggled}
            currentUserAuth={group.group.auth}
            report={report}
            onReportInput={this.onReportInput}
            onSubmitReport={this.onSubmitReport}
            onReport={onReport}
            selectionMode={selectionMode}
            rank_required={group.group.rank_setting ? group.group.rank_setting.manage_post_rank_required : null}
          />

          <PostMedia image={image} content={content} navigation={navigation}/>

          {selectionMode ? (
            checked ? (
              <View style={styles.footer}>
                <Text style={{color: 'red', marginVertical: 5}}>Checked</Text>
              </View>
            ) : null
          ) : (
            <PostFooter
              commentCount={commentCount}
              likeCount={0}
              navigation={this.props.navigation}
              postId={id}
              commentTouchable={commentTouchable}
              onLikePress={this.onLikePress}
              likeCount={likeCount}
              liked={liked}
              loading={loading}
            />
          )}
          {nomination == null || selectionMode ? null : (
            <PostNomination
              nomination={nomination}
              onPress={this.onVotePress}
              voting={voting}
              voted={nomination.voted}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 1100,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#576889',
  },
  footer: {
    marginBottom: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    deletePost: data => dispatch(deletePost(data)),
    userLogout: () => dispatch(userLogout()),
    likePost: data => dispatch(likePost(data)),
    changePostNotification: data => dispatch(changePostNotification(data)),
    reportPost: data => dispatch(reportPost(data)),
    voteNominee: data => dispatch(voteNominee(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCard);
