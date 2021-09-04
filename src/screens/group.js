import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {getGroupPosts} from '../actions/post';
import PostList from '../components/posts/postList';
import {getGroupPostsFunc} from '../functions/post';
import {loadLeaderBoardFunc} from '../functions/point';
import {getGroupJoinRequestCountFunc} from '../functions/group';
import {userLogout} from '../actions/auth';
import {getGroupJoinRequestCount, getSingleGroupById} from '../actions/group';
import {getUserGroupPoint, getGroupPointLeaderBoard} from '../actions/point';
import {hasLocationPermission} from '../functions/permission';
import Geolocation from 'react-native-geolocation-service';
import {getTheme} from '../utils/theme';

class Group extends React.Component {
  state = {
    loading: false,
    refreshing: false,
    theme: getTheme(this.props.auth.user.theme),
    position: null,
    selectedPostCategory: 'all',
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
    });

    Keyboard.dismiss();
    this.getLocation();

    // set this just in case of redirect from an old group to a new group but group is not yet load
    setTimeout(() => {
      const {group} = this.props.group;
      if (group.id) {
        this.loadGroupPosts(true);
      }
    }, 100);
  }

  componentDidUpdate(prevProps) {
    const {group} = this.props;
    if (!prevProps.group.group.auth && group.group.auth) {
      // load group post
      this.loadGroupPosts(true);
    }
  }

  getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        this.setState({position});
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        distanceFilter: 0,
      },
    );
  };

  getUserGroupPoint = async () => {
    const {auth, group, getUserGroupPoint} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      alert(req.errors[0].message);
      return;
    }
  };

  getGroupJoinRequestCount = () => {
    const {
      getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    } = this.props;
    const data = {
      func: getGroupJoinRequestCount,
      auth,
      group,
      navigation,
      userLogout,
    };
    getGroupJoinRequestCountFunc(data);
  };

  loadLeaderBoard = () => {
    const {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
    } = this.props;
    const data = {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
      count: 0,
      limit: 3,
      period: 'month',
    };

    loadLeaderBoardFunc(data);
  };

  getGroup = async groupId => {
    const {auth, getSingleGroupById, group} = this.props;
    const request = {
      id: group.group.id,
      token: auth.token,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot load group at this time, please try again later');
      return;
    }
  };

  onAddPost = create_post_allowed => {
    const {navigation} = this.props;
    const {id, rank_setting} = this.props.group.group;

    if (create_post_allowed) {
      navigation.navigate('PostSetting', {
        groupId: id,
        create: true,
        prevRoute: 'Group',
      });
    } else {
      const {rankName} = this.props.group;
      let requiredRank = rankName.rank1Name;
      switch (rank_setting.post_rank_required) {
        case 1:
          requiredRank = rankName.rank1Name;
          break;
        case 2:
          requiredRank = rankName.rank2Name;
          break;
        case 3:
          requiredRank = rankName.rank3Name;
          break;
        case 4:
          requiredRank = rankName.rank4Name;
          break;
        case 5:
          requiredRank = rankName.rank5Name;
          break;
        case 6:
          requiredRank = rankName.rank6Name;
          break;
        case 7:
          requiredRank = rankName.rank7Name;
          break;
      }

      alert(
        `Your rank is blow required rank ${requiredRank} to create a post in this group`,
      );
    }
  };

  onSelectPostCategory = category => {
    this.setState({selectedPostCategory: category});
    setTimeout(() => {
      this.loadGroupPosts(true);
    }, 50);
  };

  onEndReached = () => {
    const {visibility, auth} = this.props.group.group;
    if (visibility || auth != null) {
      this.loadGroupPosts(false);
    }
  };

  onRefresh = async () => {
    this.setState({refreshing: true});
    const {visibility, auth} = this.props.group.group;
    this.getLocation();
    await this.getGroup();
    if (visibility || auth != null) {
      this.loadLeaderBoard();
      this.loadGroupPosts(true);
      this.getUserGroupPoint();
      this.getGroupJoinRequestCount();
    }
    this.setState({refreshing: false});
  };

  loadGroupPosts = async init => {
    const {
      navigation,
      getGroupPosts,
      userLogout,
      auth,
      group,
      post,
    } = this.props;
    const data = {
      token: auth.token,
      groupId: group.group.id,
      getGroupPosts,
      navigation,
      userLogout,
      count: init ? 0 : post.groupPosts.count,
      init,
      type: this.state.selectedPostCategory,
    };

    this.setState({loading: true});
    // if it is not init load and count is 0, not loading, else load
    if (!(!init && post.groupPosts.count == 0)) {
      await getGroupPostsFunc(data);
    }
    this.setState({loading: false});
  };

  render() {
    const {group, post, navigation, point} = this.props;
    const {refreshing, theme, position, selectedPostCategory} = this.state;

    return (
      <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
        {group.group.id ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <PostList
              posts={post.groupPosts}
              group={group.group}
              point={point}
              navigation={navigation}
              onEndReached={this.onEndReached}
              onRefresh={this.onRefresh}
              refreshing={refreshing}
              onAddPost={this.onAddPost}
              theme={theme}
              prevRoute={'Group'}
              position={position}
              selectedPostCategory={selectedPostCategory}
              onSelectPostCategory={this.onSelectPostCategory}
            />
          </TouchableWithoutFeedback>
        ) : null}
      </KeyboardAvoidingView>
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
    // marginBottom: 200,
    color: 'grey',
    fontStyle: 'italic',
  },
});

const mapStateToProps = state => {
  const {group, auth, post, point} = state;
  return {group, auth, post, point};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupPosts: data => dispatch(getGroupPosts(data)),
    userLogout: () => dispatch(userLogout()),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
    getGroupPointLeaderBoard: data => dispatch(getGroupPointLeaderBoard(data)),
    getGroupJoinRequestCount: data => dispatch(getGroupJoinRequestCount(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Group);
