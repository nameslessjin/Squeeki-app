import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import InputContent from '../components/postSetting/inputContent';
import InputPriority from '../components/postSetting/inputPriority';
import InputPicker from '../components/postSetting/inputPicker';
import InputImage from '../components/postSetting/inputImage';
import AddOrModifyPost from '../components/postSetting/addOrModifyPost';
import {createPost, getFeed, getGroupPosts, updatePost} from '../actions/post';
import {getFeedFunc, getGroupPostsFunc} from '../functions/post';
import {userLogout} from '../actions/auth';
import NominationButton from '../components/postSetting/nominationButton';
import {getSundays} from '../utils/time';
import PostSettingModal from '../components/postSetting/postSettingModal';
import {getUserGroupPoint} from '../actions/point';
import {getSingleGroupById} from '../actions/group'

class PostSetting extends React.Component {
  state = {
    postData: {
      postId: null,
      image: null,
      content: '',
      priority: 0,
      priorityDuration: 0,
      allowComment: 1,
      type: 'post',
      groupId: null,
      visibility: 'public',
    },
    onToggle: false,
    toggleTyple: 'priority',
    contentKeyboard: false,
    create: this.props.route.params.create,
    loading: false,
    searchUserList: [],
    chosenUser: {},
    nomination: {},
    modalVisible: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    let headerTitle = 'Create Post';
    if (!this.props.route.params.create) {
      const {
        id,
        image,
        content,
        createdAt,
        priority,
        priorityDuration,
        allowComment,
        type,
        groupId,
        nomination,
        visibility,
      } = this.props.route.params.postData;
      this.setState({
        postData: {
          postId: id,
          image: image,
          content: content,
          priority: priority,
          priorityDuration: priorityDuration,
          allowComment: allowComment,
          type: type,
          groupId: groupId,
          nomination: nomination,
          visibility: visibility,
        },
      });

      if (nomination != null) {
        const {
          nominationId,
          nomineeId,
          nomination_name,
          nominee_name,
        } = nomination;
        this.setState({
          chosenUser: {
            id: nomineeId,
            displayName: nominee_name,
          },
          nomination: {
            id: nominationId,
            name: nomination_name,
          },
        });
      }

      headerTitle = 'Modify Post';
    } else {
      this.setState({
        postData: {
          ...this.state.postData,
          groupId: this.props.route.params.groupId,
        },
      });
    }

    navigation.setOptions({
      headerTitle: headerTitle,
      headerRight: () => (
        <AddOrModifyPost
          update={false}
          onPress={this.createUpdatePostPress}
          loading={this.state.loading}
        />
      ),
      headerBackTitleVisible: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.route.params != prevProps.route.params) {
      const {chosenUser, nomination} = this.props.route.params;
      this.setState({chosenUser: chosenUser, nomination: nomination});
    }
    if (prevState != this.state) {
      let update = false;
      update = this.extractData().update;
      const {navigation} = this.props;
      navigation.setOptions({
        headerRight: () => (
          <AddOrModifyPost
            update={update}
            onPress={this.createUpdatePostPress}
            loading={this.state.loading}
          />
        ),
      });
    }
  }

  componentWillUnmount() {
    if (this.state.create) {
      const {group} = this.props.group;
      if (group.id != null) {
        this.getUserGroupPoint();
      }
    }
  }

  getGroup = async () => {
    const {group, auth, getSingleGroupById, navigation, userLogout} = this.props
    const request = {
      token: auth.token,
      id: group.group.id
    }

    const req = await getSingleGroupById(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load group at this time, please try again later')
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

  }

  getUserGroupPoint = async () => {
    const {group, auth, getUserGroupPoint, navigation, userLogout} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load points at this time, please try again later')
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  extractData = () => {
    const {postData, create, chosenUser} = this.state;
    let {nomination} = this.state
    const {token} = this.props.auth;
    const {last_sunday, next_sunday} = getSundays();
    let origin = null;
    let {
      postId,
      image,
      content,
      priority,
      priorityDuration,
      allowComment,
      type,
      groupId,
      visibility,
    } = postData;
    content = content.trim();

    if (!create) {
      origin = {
        ...this.props.route.params.postData,
      };
      if (image == origin.image) {
        image = null;
      }
      if (content == origin.content) {
        content = null;
      }
      if (priority == origin.priority) {
        priority = null;
      }
      if (priorityDuration == origin.priorityDuration) {
        priorityDuration = null;
      }
      if (allowComment == origin.allowComment) {
        allowComment = null;
      }
      if (type == origin.type) {
        type = null;
      }
      if (visibility == origin.visibility) {
        visibility = null;
      }
    }

    if (
      image != null ||
      content != null ||
      priority != null ||
      priorityDuration != null ||
      allowComment != null ||
      type != null ||
      visibility != null 
    ) {
      const updateData = {
        id: create ? null : postId,
        groupId: groupId,
        image: image,
        content: content,
        priority: priority,
        priorityDuration: priorityDuration,
        allowComment: allowComment,
        type: type,
        visibility: visibility,
        token: token,
        nomination: {
          nominationId: nomination.id || null,
          nomineeId: chosenUser.id || null,
          beginAt: last_sunday,
          endAt: next_sunday,
        },
      };
      return {
        updateData: updateData,
        update: this.validation(),
        origin: origin,
      };
    } else {
      return {update: false};
    }
  };

  validation = () => {
    const {content, priority, priorityDuration} = this.state.postData;
    if (content.trim().length == 0) {
      return false;
    }
    if (priorityDuration > 9999) {
      return false;
    }

    if (priority == 0 && !priorityDuration == 0) {
      return false;
    }

    if (priority > 0 && priorityDuration == 0) {
      return false;
    }

    return true;
  };

  createUpdatePostPress = async () => {
    this.setState({loading: true});
    const {
      createPost,
      getFeed,
      getGroupPosts,
      navigation,
      userLogout,
    } = this.props;
    const {token} = this.props.auth;

    const {updateData, origin} = this.extractData();
    if (this.state.create) {
      const post = await createPost(updateData);
      if (post.errors) {
        console.log(post.errors[0].message);
        alert('Cannot create post at this time, please try again later')
        if (post.errors[0].message == 'Not authenticated') {
          userLogout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
        }
        return;
      }
    } else {
      const data = {
        updateData: updateData,
        origin: origin,
      };

      const updatePost = await this.props.updatePost(data);
      if (updatePost.errors) {
        // alert(updatePost.errors[0].message);
        alert('Cannot update post at this time, please try again later')
        if (updatePost.errors[0].message == 'Not authenticated') {
          userLogout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
        }
        return;
      }
    }
    this.setState({loading: false});

    if (this.props.route.params.groupId == null) {
      const data = {
        token: token,
        getFeed: getFeed,
        navigation: navigation,
        userLogout: userLogout,
        count: 0,
      };
      getFeedFunc(data);
    } else {
      const data = {
        token: token,
        groupId: this.props.route.params.groupId,
        getGroupPosts: getGroupPosts,
        navigation: navigation,
        userLogout: userLogout,
        count: 0,
      };

      getGroupPostsFunc(data);
    }
    this.props.navigation.goBack();
  };

  atUser = value => {
    let str = value;
    let lastChar = str.charAt(str.length - 1);

    if (lastChar == '@') {
    }
  };

  modifyInput = (value, type) => {
    if (type == 'content') {
      this.atUser(value);
      this.setState({
        contentKeyboard: true,
        postData: {
          ...this.state.postData,
          content: value,
        },
      });
    } else if (type == 'priority') {
      this.setState({
        postData: {
          ...this.state.postData,
          priority: value,
        },
      });
    } else if (type == 'priorityDuration') {
      this.setState({
        postData: {
          ...this.state.postData,
          priorityDuration: parseInt(value, 10) || 0,
        },
      });
    } else if (type == 'type') {
      this.setState({
        postData: {
          ...this.state.postData,
          type: value,
        },
      });
    } else if (type == 'comment') {
      this.setState({
        postData: {
          ...this.state.postData,
          allowComment: value == 'true' ? 1 : 0,
        },
      });
    } else if (type == 'image') {
      this.setState({
        contentKeyboard: false,
        modalVisible: false,
        postData: {
          ...this.state.postData,
          image: {
            ...value,
          },
        },
      });
    } else if (type == 'visibility') {
      this.setState({
        postData: {
          ...this.state.postData,
          visibility: value,
        },
      });
    }
  };

  onInputFocus = type => {
    Keyboard.dismiss();
    this.setState({onToggle: true, toggleTyple: type, contentKeyboard: true});
  };

  onKeyboardInputFocus = () => {
    this.setState({contentKeyboard: true});
  };

  onBackdropPress = () => {
    this.setState({
      onToggle: false,
      contentKeyboard: false,
      modalVisible: false,
    });
    Keyboard.dismiss();
  };

  onBackgroundPress = () => {
    this.setState({
      contentKeyboard: false,
      modalVisible: false,
    });
    Keyboard.dismiss();
  };

  onNominateePress = () => {
    const {navigation, group} = this.props;
    navigation.navigate('SearchUser', {
      group: group.group,
      prev_route: 'PostSetting',
    });
  };

  onAddMeidaPress = () => {
    this.setState({modalVisible: true});
  };

  render() {
    const {
      priority,
      content,
      priorityDuration,
      type,
      allowComment,
      image,
      groupId,
      visibility,
    } = this.state.postData;
    const {
      onToggle,
      toggleTyple,
      contentKeyboard,
      loading,
      chosenUser,
      nomination,
      create,
      modalVisible,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this.onBackgroundPress}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <InputImage
            modifyInput={this.modifyInput}
            image={image}
            contentKeyboard={contentKeyboard}
            onPress={this.onAddMeidaPress}
            create={create}
          />
          <InputContent
            content={content}
            modifyInput={this.modifyInput}
            onKeyboardInputFocus={this.onKeyboardInputFocus}
          />

          {this.props.group.group.id == null ? null : (
            <InputPriority
              priority={priority}
              onInputFocus={this.onInputFocus}
              priorityDuration={priorityDuration}
              modifyInput={this.modifyInput}
              onBackdropPress={this.onBackdropPress}
              onToggle={onToggle}
              toggleTyple={toggleTyple}
              onKeyboardInputFocus={this.onKeyboardInputFocus}
              currentUserAuth={this.props.group.group.auth}
            />
          )}

          <View style={styles.lineContainer}>
            <InputPicker
              value={type}
              onInputFocus={this.onInputFocus}
              modifyInput={this.modifyInput}
              onBackdropPress={this.onBackdropPress}
              onToggle={onToggle}
              type={'type'}
              toggleTyple={toggleTyple}
            />
            <InputPicker
              value={allowComment}
              onInputFocus={this.onInputFocus}
              modifyInput={this.modifyInput}
              onBackdropPress={this.onBackdropPress}
              onToggle={onToggle}
              type={'comment'}
              toggleTyple={toggleTyple}
            />
          </View>

          <View style={styles.lineContainer}>
            <InputPicker
              value={visibility}
              onInputFocus={this.onInputFocus}
              modifyInput={this.modifyInput}
              onBackdropPress={this.onBackdropPress}
              onToggle={onToggle}
              type={'visibility'}
              toggleTyple={toggleTyple}
            />
          </View>

          {this.props.group.group.id == null ? null : (
            <NominationButton
              onPress={this.onNominateePress}
              chosenUser={chosenUser}
              nomination={nomination}
              disabled={!create}
            />
          )}
          <ActivityIndicator animating={loading} />

          <PostSettingModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onChangeMedia={this.modifyInput}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
  },
  lineContainer: {
    width: '90%',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    createPost: data => dispatch(createPost(data)),
    getFeed: data => dispatch(getFeed(data)),
    getGroupPosts: data => dispatch(getGroupPosts(data)),
    updatePost: data => dispatch(updatePost(data)),
    userLogout: () => dispatch(userLogout()),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostSetting);
