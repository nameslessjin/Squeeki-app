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
  Dimensions,
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
import {getSingleGroupById, searchAtGroup} from '../actions/group';
import {detectAtPeopleNGroup} from '../utils/detect';
import AtUserNGroupList from '../components/postSetting/atUserNGroupList';
import InputOption from '../components/postSetting/inputOption';
import {getTheme} from '../utils/theme';

const {width} = Dimensions.get('screen');

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
      visibility: 1,
      auth: true,
      originContent: '',
      confirmButton: 'Accept',
      denyButton: 'Skip',
      taskExpiration: Date.now(),
      start: Date.now(),
      end: Date.now(),
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
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
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
        start,
        end
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
          start,
          end
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
          theme={theme}
        />
      ),
      headerBackTitleVisible: false,
      headerStyle: theme.backgroundColor,
      headerTintColor: theme.textColor.color,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.route.params != prevProps.route.params) {
      const {chosenUser, nomination} = this.props.route.params;
      this.setState({chosenUser: chosenUser, nomination: nomination});
    }
    const {theme} = this.state;
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
            theme={theme}
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
      originContent,
      start,
      end,
    } = postData;
    content = content.trim();

    if (content.length > 1000) {
      return {update: false};
    }

    if (!create) {
      origin = {
        ...this.props.route.params.postData,
      };
      if (image == origin.image) {
        image = null;
      }
      if (content == originContent) {
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
      if (start == origin.start) {
        start = null;
      }
      if (end == origin.end) {
        end = null;
      }
    }

    if (
      image != null ||
      content != null ||
      priority != null ||
      priorityExpiration != null ||
      allowComment != null ||
      // type != null ||
      visibility != null ||
      confirmButton != null ||
      denyButton != null ||
      taskExpiration != null ||
      start != null ||
      end != null
    ) {
      const updateData = {
        id: create ? null : postId,
        groupId,
        image,
        content,
        originContent,
        priority,
        priorityExpiration,
        allowComment,
        type,
        visibility,
        confirmButton: type == 'task' ? confirmButton : null,
        denyButton: type == 'task' ? denyButton : null,
        taskExpiration: type == 'task' ? taskExpiration : null,
        start: type == 'event' ? start : null,
        end: type == 'event' ? end : null,
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
    const {create, postData} = this.state;
    const {
      content,
      priority,
      priorityExpiration,
      confirmButton,
      denyButton,
      taskExpiration,
      type,
      image,
      allowComment,
      visibility,
      originContent,
      start,
      end,
    } = postData;
    origin = {
      ...this.props.route.params.postData,
    };

    if (content.trim().length == 0) {
      return false;
    }

    if (priority > 0 && priorityExpiration <= Date.now()) {
      return false;
    }

    if (priority == 0 && priorityExpiration > Date.now()) {
      return false;
    }

    if (type == 'task') {
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
    }

    if (type == 'event') {
      if (start) {
        if (start <= Date.now()) {
          return false;
        }
      }

      if (end) {
        if (end <= Date.now()) {
          return false;
        }
      }

      if (start && end) {
        if (start == end) {
          return false;
        }
      }
    }

    if (!create) {
      if (
        image == origin.image &&
        content == origin.originContent &&
        priority == origin.priority &&
        priorityExpiration == origin.priorityExpiration &&
        allowComment == origin.allowComment &&
        type == origin.type &&
        visibility == origin.visibility &&
        confirmButton == origin.confirmButton &&
        denyButton == origin.denyButton &&
        taskExpiration == origin.taskExpiration &&
        start == origin.start &&
        end == origin.end
      ) {
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

    navigation.navigate(group.group.id ? 'GroupNavigator' : 'Home', {
      refresh: true,
      prevRoute: 'PostSetting',
    });
  };

  onAtSearch = async () => {
    const {searchTerm} = this.state;
    const {group, searchAtUser, auth, searchAtGroup} = this.props;

    const request = {
      groupId: group.group.id,
      searchTerm:
        searchTerm[0] == '@'
          ? searchTerm.substr(1, searchTerm.length)
          : searchTerm.substr(2, searchTerm.length),
      token: auth.token,
    };

    const result =
      searchTerm[0] == '@'
        ? await searchAtUser(request)
        : await searchAtGroup(request);
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
      } else if (
        (searchTerm[0] == 'g' || searchTerm[0] == 'G') &&
        searchTerm[1] == '@'
      ) {
        // g@groupname
        this.setState({searchTerm, searchIndex});
      } else {
        this.setState({searchTerm: '', searchIndex: -1, atSearchResult: []});
      }

      // make sure the numer of lines and length of content is limited
      const lineCount = value.split(/\r\n|\r|\n/).length;
      const valueSplit = value.substr(0, 1000).split('\n');
      if (lineCount >= 25) {
        this.setState({
          contentKeyboard: true,
          postData: {
            ...this.state.postData,
            content: valueSplit.slice(0, 25).join('\n'),
          },
        });
        return;
      }

      this.setState({
        contentKeyboard: true,
        postData: {
          ...this.state.postData,
          content: value.substr(0, 1000),
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
          start: Date.now(),
          end: Date.now(),
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
    } else if (type == 'eventStart') {
      this.setState({
        postData: {
          ...this.state.postData,
          start: value.getTime(),
          end:
            value.getTime() >= this.state.postData.end
              ? value.getTime()
              : this.state.postData.end,
        },
      });
    } else if (type == 'eventEnd') {
      this.setState({
        postData: {
          ...this.state.postData,
          begin:
            value.getTime() <= this.state.postData.begin
              ? value.getTime()
              : this.state.postData.begin,
          end: value.getTime(),
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

  onAtPress = item => {
    const {username, id, groupname} = item;
    const {searchIndex, postData} = this.state;

    let updatedContent = postData.content.split(' ');
    updatedContent[searchIndex] = username ? `@${username}` : `g@${groupname}`;
    updatedContent = updatedContent.join(' ') + ' ';
    this.setState({
      atSearchResult: [],
      postData: {...postData, content: updatedContent.substr(0, 1000)},
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
      theme,
      postData,
    } = this.state;
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
      start,
      end,
    } = postData;

    return (
      <TouchableWithoutFeedback onPress={this.onBackgroundPress}>
        <ScrollView
          style={[styles.scroll, theme.backgroundColor]}
          bounces={false}>
          <KeyboardAvoidingView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <InputImage
              image={image}
              contentKeyboard={contentKeyboard}
              onPress={() => this.onModalTrigger('image')}
              disabled={!create}
              theme={theme}
            />
            <InputContent
              content={content}
              modifyInput={this.modifyInput}
              onKeyboardInputFocus={this.onKeyboardInputFocus}
              type={'post'}
              disabled={!auth}
              theme={theme}
            />

            {atSearchResult.length == 0 ? null : (
              <AtUserNGroupList
                atSearchResult={atSearchResult || []}
                isPicSet={image != null}
                onAtPress={this.onAtPress}
                theme={theme}
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
                  theme={theme}
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
                  theme={theme}
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
                  theme={theme}
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
                  theme={theme}
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
                  theme={theme}
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
                theme={theme}
                rankName={this.props.group.rankName}
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
                  theme={theme}
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
                  theme={theme}
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
                  theme={theme}
                />
              </View>
            ) : null}

            {type == 'event' ? (
              <View style={styles.lineContainer}>
                <InputOption
                  value={start}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'eventStart'}
                  disabled={false}
                  toggleTyple={toggleTyple}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  onInputFocus={() => this.onModalTrigger('eventStart')}
                  theme={theme}
                />
                <InputOption
                  value={end}
                  modifyInput={this.modifyInput}
                  onBackdropPress={this.onBackdropPress}
                  onToggle={onToggle}
                  type={'eventEnd'}
                  disabled={false}
                  toggleTyple={toggleTyple}
                  currentUserAuth={this.props.group.group.auth}
                  rank_setting={this.props.group.group.rank_setting}
                  onInputFocus={() => this.onModalTrigger('eventEnd')}
                  theme={theme}
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
                theme={theme}
                eventStart={start}
                eventEnd={end}
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
    searchAtGroup: data => dispatch(searchAtGroup(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostSetting);
