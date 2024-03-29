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
  respondPost,
  changePostNotification,
  reportPost,
  getUserTaskVerification,
} from '../../actions/post';
import {getSingleGroupById} from '../../actions/group';
import {voteNominee} from '../../actions/nomination';
import {userLogout} from '../../actions/auth';
import PostMedia from './postMedia';
import PostNomination from './postNomination';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {getTheme} from '../../utils/theme';

class PostCard extends React.Component {
  state = {
    liked: false,
    taskResponse: null,
    modalToggled: false,
    loading: false,
    is_report_toggled: false,
    report: '',
    onReport: false,
    voting: false,
    selected: false,
    pressedButton: 'like',
    ...this.props.item,
    theme: getTheme(this.props.auth.user.theme),
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

  onTaskManagementPress = () => {
    this.props.navigation.navigate('TaskManagement', {
      postId: this.state.id,
    });
    this.onBackDropPress();
  };

  getGroup = async id => {
    const {item, getSingleGroupById, auth, navigation, group} = this.props;
    const request = {
      id: id ? id : item.groupId,
      token: auth.token,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      alert('Cannot load group at this time, please try again later');
      return;
    }

    // create user event log
    const log = {
      trigger: 'post',
      triggerId: this.state.id,
      event: id ? 'redirection_post_at_group' : 'redirection_post_from_group',
      effectIdType: 'group',
      effectId: id ? id : item.groupId,
    };

    navigation.push('GroupNavigator', {
      prevRoute: 'PostCard',
      groupId: group.group.id,
      log
    });
  };

  onPostReport = () => {
    this.setState({is_report_toggled: true});
  };

  onReportInput = content => {
    const lineCount = content.split(/\r\n|\r|\n/).length;
    const valueSplit = content.substr(0, 255).split('\n');
    if (lineCount >= 15) {
      this.setState({report: valueSplit.slice(0, 15).join('\n')});
      return;
    }

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
      alert('Cannot report post at this time, please try again later');
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
    const {id, notification} = this.state;
    const data = {
      token: auth.token,
      postId: id,
    };

    const notificationResult = await changePostNotification(data);

    if (notificationResult.errors) {
      // alert(notificationResult.errors[0].message);
      alert('Cannot change notification at this time, please try again later');
      if (notificationResult.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    this.setState(prevState => {
      return {notification: !prevState.notification};
    });
  };

  componentDidMount() {
    this._actionSheetRef = undefined;
  }

  componentDidUpdate(prevProps, prevState) {
    const {auth, navigation, item} = this.props;
    if (prevProps.item != item) {
      this.setState(prevState => {
        return {
          ...prevState,
          ...item,
        };
      });
    }

    if (prevProps.auth.user.theme != auth.user.theme) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
        headerTintColor: theme.textColor.color,
      });
    }
  }

  deletePost = async () => {
    const {item, navigation, group} = this.props;
    const {id, auth, groupAuth} = item;
    const data = {
      postId: id,
      token: this.props.auth.token,
    };

    // rank verification
    const currentUserAuth = group.group.auth;
    let currentUserAuthQualified = false;
    if (currentUserAuth && groupAuth) {
      if (
        currentUserAuth.rank < groupAuth.rank &&
        currentUserAuth.rank <=
          group.group.rank_setting.manage_post_rank_required
      ) {
        currentUserAuthQualified = true;
      }
    }

    if (auth || currentUserAuthQualified) {
      const post = await this.props.deletePost(data);
      if (post.errors) {
        // alert(post.errors[0].message);
        alert('Cannot delete post at this time, please try again later');
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
    const {navigation, prevRoute} = this.props;
    const currentUserAuth = this.props.group.group.auth;
    // console.log(prevRoute)
    let currentUserAuthQualified = false;
    if (currentUserAuth && groupAuth) {
      // group owner can set post change restriction
      if (
        currentUserAuth.rank < groupAuth.rank &&
        currentUserAuth.rank <=
          this.props.group.group.rank_setting.manage_post_rank_required
      ) {
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
        prevRoute,
      });
      this.onBackDropPress();
    } else {
      alert('Not Authorized');
    }
  };

  onRespondPost = async type => {
    const {auth, respondPost, navigation, getUserTaskVerification} = this.props;
    const {id, taskResponse, taskExpiration} = this.state;
    const data = {
      postId: id,
      token: auth.token,
      type,
    };

    if (parseInt(taskExpiration) <= Date.now()) {
      alert('Task expired');
      this.setState(prevState => {
        return prevState;
      });
      return;
    }

    if (type == 'verify') {
      // search database for existing ones
      const request = {token: auth.token, postId: id};
      const req = await getUserTaskVerification(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Cannot fetch verification at this time, please try again later');
        return;
      }

      navigation.navigate('TaskVerify', {
        postId: id,
        ...req,
        respondentId: auth.user.id,
        taskResponse,
        prevRoute: 'PostCard',
      });
      return;
    }

    this.setState({loading: true, pressedButton: type});
    const req = await respondPost(data);
    this.setState({loading: false});
    if (req.errors) {
      console.log(req.errors[0].message);
      alert('Cannot respond to this post at this time, please try again later');
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
        liked: type == 'like' ? !prevState.liked : prevState.liked,
        likeCount:
          type == 'like'
            ? prevState.liked
              ? prevState.likeCount - 1
              : prevState.likeCount + 1
            : prevState.likeCount,
        taskResponse: type != 'like' ? type : prevState.taskResponse,
      };
    });
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
      alert('Cannot vote nominee at this time, please try again later');
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
      createdAt,
      user,
      priority,
      nomination,
      checked,
      theme,
      groupname,
      display_name,
    } = this.state;
    const {
      commentTouchable,
      onPostSelect,
      group,
      navigation,
      prevRoute,
      position,
      from,
    } = this.props;

    // console.log(prevRoute)

    const date = dateConversion(createdAt, 'timeDisplay');
    // console.log(this.state)
    // default
    let backgroundColor = theme.backgroundColor.backgroundColor;

    // darkmode
    // let backgroundColor = '#1d2027';

    if (priority == 3) {
      backgroundColor = '#fab1a0';
    } else if (priority == 2) {
      backgroundColor = '#c7ecee';
    } else if (priority == 1) {
      backgroundColor = '#b8e999';
    }

    return (
      <ActionSheetProvider
        ref={component => (this._actionSheetRef = component)}>
        <TouchableWithoutFeedback
          onPress={() =>
            prevRoute == 'CheckInSetting' && !checked
              ? onPostSelect({...this.props.item})
              : null
          }>
          <View style={[styles.container, {backgroundColor: backgroundColor}]}>
            <PostHeader
              {...user}
              {...this.state}
              date={date}
              postId={id}
              onTaskManagementPress={this.onTaskManagementPress}
              onPostUpdate={this.onPostUpdate}
              onPostDelete={this.onPostDelete}
              onPostNotification={this.onPostNotification}
              toggleModal={this.toggleModal}
              onBackDropPress={this.onBackDropPress}
              onPostReport={this.onPostReport}
              currentUserAuth={group.group.auth}
              onReportInput={this.onReportInput}
              onSubmitReport={this.onSubmitReport}
              rank_required_manage={
                group.group.rank_setting
                  ? group.group.rank_setting.manage_post_rank_required
                  : null
              }
              rank_required_task={
                group.group.rank_setting
                  ? group.group.rank_setting.manage_task_rank_required
                  : null
              }
              theme={theme}
              prevRoute={prevRoute}
            />

            {(prevRoute == 'Home' || from == 'Home' || from == 'Mentioned') &&
            groupname ? (
              <View
                style={{
                  width: '100%',
                  // alignItems: 'center',
                  padding: 7,
                  paddingBottom: 0,
                }}>
                <TouchableOpacity onPress={() => this.getGroup()}>
                  <Text
                    style={[{fontSize: 15}, theme.textColor]}
                    numberOfLines={2}>
                    From {''}
                    <Text style={[{color: '#1e90ff'}]}>
                      g@
                      {`${groupname}${
                        groupname == display_name ? '' : `(${display_name})`
                      }`}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <PostMedia
              {...this.state}
              postId={id}
              navigation={navigation}
              getGroup={this.getGroup}
              _actionSheetRef={
                this.props._actionSheetRef
                  ? this.props._actionSheetRef
                  : this._actionSheetRef
              }
              theme={theme}
              prevRoute={prevRoute}
            />

            {prevRoute == 'CheckInSetting' ? (
              checked ? (
                <View style={styles.footer}>
                  <Text style={{color: 'red', marginVertical: 5}}>Checked</Text>
                </View>
              ) : (
                <View style={styles.footer}>
                  <Text
                    style={[
                      {
                        marginVertical: 5,
                        color: priority ? 'black' : theme.textColor.color,
                      },
                    ]}>
                    {priority == 3 && prevRoute == 'CheckInSetting'
                      ? '100 points available'
                      : 'No point available'}
                  </Text>
                </View>
              )
            ) : null}

            <PostFooter
              navigation={this.props.navigation}
              currentUserAuth={group.group.auth}
              postId={id}
              commentTouchable={commentTouchable}
              onRespondPost={this.onRespondPost}
              onViewButtonPress={this.getGroup}
              prevRoute={prevRoute}
              {...this.state}
              theme={theme}
              backgroundColor={backgroundColor}
              position={position}
              group={group.group}
              from={from}
            />
            {nomination == null || prevRoute == 'CheckInSetting' ? null : (
              <PostNomination
                {...this.state}
                onPress={this.onVotePress}
                theme={theme}
                group={group.group}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </ActionSheetProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 1400,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#576889',
  },
  footer: {
    marginBottom: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    deletePost: data => dispatch(deletePost(data)),
    userLogout: () => dispatch(userLogout()),
    respondPost: data => dispatch(respondPost(data)),
    changePostNotification: data => dispatch(changePostNotification(data)),
    reportPost: data => dispatch(reportPost(data)),
    voteNominee: data => dispatch(voteNominee(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
    getUserTaskVerification: data => dispatch(getUserTaskVerification(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostCard);
