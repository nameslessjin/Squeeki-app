import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import InputContent from '../components/postSetting/inputContent';
import InputImage from '../components/postSetting/inputImage';
import AddOrModifyPost from '../components/postSetting/addOrModifyPost';
import {createPost, getFeed, getGroupPosts, updatePost} from '../actions/post';
import {getFeedFunc, getGroupPostsFunc} from '../functions/post';
import {userLogout} from '../actions/auth';
import {searchAtUser} from '../actions/user';
import NominationButton from '../components/postSetting/nominationButton';
import {getSundays} from '../utils/time';
import PostSettingModal from '../components/postSetting/postSettingModal';
import {getUserGroupPoint} from '../actions/point';
import {getSingleGroupById} from '../actions/group';
import {detectAtPeopleNGroup} from '../utils/detect';
import AtUserList from '../components/postSetting/atUserList';
import InputOption from '../components/postSetting/inputOption';

class PostSetting extends React.Component {
  state = {
    postData: {
      postId: null,
      image: null,
      content: '',
      priority: 0,
      priorityExpiration: Date.now(),
      allowComment: 1,
      type: 'general',
      groupId: null,
      visibility: 'public',
      auth: true,
      originContent: '',
      confirmButton: 'Yes',
      denyButton: 'No',
      taskExpiration: Date.now(),
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
    searchTerm: '',
    searchIndex: -1,
    atSearchResult: [],
    modalType: 'image',
    initTime: Date.now(),
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
        priorityExpiration,
        allowComment,
        type,
        groupId,
        nomination,
        visibility,
        originContent,
        confirmButton,
        denyButton,
        taskExpiration,
        auth,
      } = this.props.route.params.postData;
      this.setState({
        postData: {
          postId: id,
          image,
          content: originContent,
          priority,
          priorityExpiration,
          allowComment,
          type,
          groupId,
          nomination,
          visibility,
          originContent,
          confirmButton,
          denyButton,
          taskExpiration,
          auth,
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

    // general checking
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

    // check for search term
    if (
      prevState.searchTerm != this.state.searchTerm &&
      this.state.searchTerm.length >= 2
    ) {
      this.onAtSearch();
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
    const {
      group,
      auth,
      getSingleGroupById,
      navigation,
      userLogout,
    } = this.props;
    const request = {
      token: auth.token,
      id: group.group.id,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load group at this time, please try again later');
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

  getUserGroupPoint = async () => {
    const {group, auth, getUserGroupPoint, navigation, userLogout} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await getUserGroupPoint(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load points at this time, please try again later');
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
    let {nomination} = this.state;
    const {token} = this.props.auth;
    const {last_sunday, next_sunday} = getSundays();
    let origin = null;
    let {
      postId,
      image,
      content,
      priority,
      priorityExpiration,
      allowComment,
      type,
      groupId,
      visibility,
      confirmButton,
      denyButton,
      taskExpiration,
    } = postData;
    content = content.trim();

    if (content.length > 255) {
      return {update: false};
    }

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
      if (priorityExpiration == origin.priorityExpiration) {
        priorityExpiration = null;
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
      if (confirmButton == origin.confirmButton) {
        confirmButton = null;
      }
      if (denyButton == origin.denyButton) {
        denyButton = null;
      }
      if (taskExpiration == origin.taskExpiration) {
        taskExpiration = null;
      }
    }

    if (
      image != null ||
      content != null ||
      priority != null ||
      priorityExpiration != null ||
      allowComment != null ||
      type != null ||
      visibility != null ||
      confirmButton != null ||
      denyButton != null ||
      taskExpiration != null
    ) {
      const updateData = {
        id: create ? null : postId,
        groupId,
        image,
        content,
        priority,
        priorityExpiration,
        allowComment,
        type,
        visibility,
        confirmButton,
        denyButton,
        taskExpiration,
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
    const {
      content,
      priority,
      priorityExpiration,
      confirmButton,
      denyButton,
      initTime,
      taskExpiration,
    } = this.state.postData;
    if (content.trim().length == 0) {
      return false;
    }

    if (priority > 0 && priorityExpiration <= Date.now()) {
      return false;
    }

    if (priority == 0 && priorityExpiration > initTime) {
      return false;
    }

    if (confirmButton.length > 10) {
      return false;
    }

    if (denyButton.length > 10) {
      return false;
    }

    if (taskExpiration) {
      if (taskExpiration <= Date.now()) {
        return false;
      }
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
      group,
    } = this.props;
    const {token} = this.props.auth;

    const {updateData, origin} = this.extractData();
    if (this.state.create) {
      const post = await createPost(updateData);
      if (post.errors) {
        console.log(post.errors[0].message);
        alert('Cannot create post at this time, please try again later');
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
        console.log(updatePost.errors[0].message);
        alert('Cannot update post at this time, please try again later');
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

    if (group.group.id) {
      const data = {
        token: token,
        groupId: group.group.id,
        getGroupPosts: getGroupPosts,
        navigation: navigation,
        userLogout: userLogout,
        count: 0,
      };

      getGroupPostsFunc(data);
    } else {
      const data = {
        token: token,
        getFeed: getFeed,
        navigation: navigation,
        userLogout: userLogout,
        count: 0,
      };
      getFeedFunc(data);
    }

    if (this.props.route.params.prev_route == 'comment') {
      navigation.navigate(group.group.id ? 'GroupNavigator' : 'Home');
      return;
    }

    navigation.goBack();
  };

  onAtSearch = async () => {
    const {searchTerm} = this.state;
    const {group, searchAtUser, auth} = this.props;

    const request = {
      groupId: group.group.id,
      searchTerm: searchTerm.trim().substr(1, searchTerm.length),
      token: auth.token,
    };

    const result = await searchAtUser(request);
    if (result.errors) {
      console.log(result.errors);
      return;
    }

    this.setState({atSearchResult: result});
  };

  modifyInput = (value, type) => {
    if (type == 'content') {
      const {searchTerm, searchIndex} = detectAtPeopleNGroup({
        prevText: this.state.postData.content,
        currentText: value,
      });

      // @user
      if (searchTerm[0] == '@') {
        this.setState({searchTerm, searchIndex});
      } else {
        this.setState({searchTerm: '', searchIndex: -1, atSearchResult: []});
      }

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
          priorityExpiration:
            value == 0 ? Date.now() : this.state.postData.priorityExpiration,
        },
      });
    } else if (type == 'priorityExpiration') {
      this.setState({
        postData: {
          ...this.state.postData,
          priorityExpiration: value.getTime(),
        },
      });
    } else if (type == 'type') {
      this.setState({
        postData: {
          ...this.state.postData,
          type: value,
          taskExpiration: Date.now(),
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
    } else if (type == 'confirm') {
      this.setState({
        postData: {
          ...this.state.postData,
          confirmButton: value.substr(0, 10),
        },
      });
    } else if (type == 'deny') {
      this.setState({
        postData: {
          ...this.state.postData,
          denyButton: value.substr(0, 10),
        },
      });
    } else if (type == 'taskExpiration') {
      this.setState({
        postData: {
          ...this.state.postData,
          taskExpiration: value.getTime(),
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

  onAtPress = user => {
    const {username, id} = user;
    const {searchIndex, postData} = this.state;

    let updatedContent = postData.content.split(' ');
    updatedContent[searchIndex] = `@${username}`;
    updatedContent = updatedContent.join(' ') + ' ';
    this.setState({
      atSearchResult: [],
      postData: {...postData, content: updatedContent.substr(0, 255)},
    });
  };

  onNominateePress = () => {
    const {navigation, group} = this.props;
    navigation.navigate('SearchUser', {
      group: group.group,
      prev_route: 'PostSetting',
    });
  };

  onModalTrigger = type => {
    this.setState({modalVisible: true, modalType: type});
  };

  render() {
    const {
      priority,
      content,
      priorityExpiration,
      type,
      allowComment,
      image,
      groupId,
      visibility,
      postId,
      confirmButton,
      denyButton,
      taskExpiration,
      auth,
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
      atSearchResult,
      modalType,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this.onBackgroundPress}>
        <ScrollView style={styles.scroll} bounces={false}>
          <KeyboardAvoidingView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <InputImage
              image={image}
              contentKeyboard={contentKeyboard}
              onPress={() => this.onModalTrigger('image')}
              disabled={!create}
            />
            <InputContent
              content={content}
              modifyInput={this.modifyInput}
              onKeyboardInputFocus={this.onKeyboardInputFocus}
              type={'post'}
              disabled={!auth}
            />

            {atSearchResult.length == 0 ? null : (
              <AtUserList
                atSearchResult={atSearchResult}
                isPicSet={image != null}
                onAtPress={this.onAtPress}
              />
            )}

            {atSearchResult.length != 0 ||
            this.props.group.group.id == null ? null : (
              <View style={styles.lineContainer}>
                <InputOption
                  value={priority}
                  onInputFocus={this.onInputFocus}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'priority'}
                  disabled={false}
                  toggleTyple={toggleTyple}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                />

                <InputOption
                  type={'priorityExpiration'}
                  value={priorityExpiration}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  toggleTyple={toggleTyple}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  onInputFocus={() => this.onModalTrigger('priorityExpiration')}
                  priority={priority}
                />
              </View>
            )}

            {atSearchResult.length != 0 ? null : (
              <View style={styles.lineContainer}>
                <InputOption
                  value={type}
                  onInputFocus={this.onInputFocus}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'type'}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  disabled={!create}
                  toggleTyple={toggleTyple}
                />
                <InputOption
                  value={allowComment}
                  onInputFocus={this.onInputFocus}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'comment'}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  disabled={false}
                  toggleTyple={toggleTyple}
                />
              </View>
            )}

            {atSearchResult.length != 0 ? null : (
              <View style={styles.lineContainer}>
                <InputOption
                  value={visibility}
                  onInputFocus={this.onInputFocus}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'visibility'}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  disabled={false}
                  toggleTyple={toggleTyple}
                />
              </View>
            )}

            {type != 'general' ||
            atSearchResult.length != 0 ||
            this.props.group.group.id == null ? null : (
              <NominationButton
                onPress={this.onNominateePress}
                chosenUser={chosenUser}
                nomination={nomination}
                disabled={!create}
                group={this.props.group.group}
                postId={postId}
              />
            )}

            {type == 'task' ? (
              <View style={styles.lineContainer}>
                <InputOption
                  value={confirmButton}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'confirm'}
                  disabled={false}
                  toggleTyple={toggleTyple}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  onFocus={this.onKeyboardInputFocus}
                />
                <InputOption
                  value={denyButton}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'deny'}
                  disabled={false}
                  toggleTyple={toggleTyple}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  onFocus={this.onKeyboardInputFocus}
                />
              </View>
            ) : null}

            {type == 'task' ? (
              <View style={styles.lineContainer}>
                <InputOption
                  value={taskExpiration}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'taskExpiration'}
                  disabled={false}
                  toggleTyple={toggleTyple}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  onInputFocus={() => this.onModalTrigger('taskExpiration')}
                />
              </View>
            ) : null}

            <ActivityIndicator animating={loading} color={'grey'} />

            <View style={styles.emptySpace} />

            {modalVisible ? (
              <PostSettingModal
                modalVisible={modalVisible}
                onBackdropPress={this.onBackdropPress}
                onChangeMedia={this.modifyInput}
                type={modalType}
                priority={priority}
                priorityExpiration={priorityExpiration}
                modifyInput={this.modifyInput}
                taskExpiration={taskExpiration}
              />
            ) : null}
          </KeyboardAvoidingView>
        </ScrollView>
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
  scroll: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  lineContainer: {
    width: '90%',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptySpace: {
    width: '100%',
    height: 350,
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
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
    searchAtUser: data => dispatch(searchAtUser(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostSetting);
