import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import TagSearchBar from '../components/tags/searchBar';
import CreateTagButton from '../components/tags/createTagButton';
import {
  createTag,
  searchTag,
  addTagToGroup,
  removeTagFromGroup,
} from '../actions/tag';
import {userLogout} from '../actions/auth';
import TagList from '../components/tags/tagList';
import { getTheme } from '../utils/theme'

class EditTag extends React.Component {
  state = {
    searchTerm: '',
    warning: '',
    create: false,
    tags: [],
    search_count: 0,
    prev_route: 'GroupSetting',
    addedTags: [],
    theme: getTheme(this.props.auth.user.theme)
  };

  componentDidMount() {
    const {navigation, route} = this.props;
    const {prev_route} = route.params;
    this.setState({prev_route: prev_route});
    const {theme} = this.state
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: theme.backgroundColor,
      headerTintColor: theme.textColor.color,
    });
    this.onloadMoreTags(true)
  }

  componentWillUnmount() {
    const {navigation} = this.props
    const {prev_route, addedTags} = this.state

    if (prev_route == 'GroupCreation'){
      navigation.navigate('GroupCreation', {
        tags: addedTags
      })
    }

  }

  onTagCreate = async () => {
    const {searchTerm} = this.state;
    const {auth, group, createTag, userLogout} = this.props;
    let tag_name = searchTerm.substring(1).trim();
    // format text
    tag_name = tag_name.replace(/(^\w{1})|(\s+\w{1})/g, letter =>
      letter.toUpperCase(),
    );
    // validation
    if (group.group.tags.length >= 5) {
      this.setState({warning: 'Every group can have max 5 tags'});
      return;
    }

    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

    // had to add another else if for regex or it will just skip if there are two special characters
    if (tag_name.length < 3 || tag_name.length > 20 || regex.test(tag_name)) {
      this.setState({
        warning:
          'Tag name must be length from 3 to 20 characters and does not contain special characters',
      });
      return;
    } else if (regex.test(tag_name)) {
      this.setState({
        warning:
          'Tag name must be length from 3 to 20 characters and does not contain special characters',
      });
      return;
    } else {
      this.setState({warning: ''});
    }

    const request = {
      tag_name: tag_name,
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await createTag(request);
    if (req.errors) {
      alert('create tags failed, please try again later');
      // alert(req.errors[0].message);
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

  onSearchChange = async text => {
    let term = text.trim();

    this.setState({searchTerm: text});
    // create new tag start with #
    // more than one space is not allowed
    // more than 20 characters are not allowed
    if (term[0] == '#') {
      term = text.replace(/ +/g, ' ');

      //make sure that the name is right next to #
      const tag_name = term.substring(1).trim();
      if (tag_name.length == 0) {
        term = term.trim();
      }
      this.setState({searchTerm: term, tags: [], create: true, warning: ''});

      if (tag_name.length > 20) {
        this.setState({
          warning:
            'Tag name must be length from 3 to 20 characters and does not contain special characters',
        });
        return;
      } else {
        this.setState({warning: ''});
      }
    } else {
      if (term.length < 3) {
        this.setState({tags: [], warning: '', create: false, search_count: 0});
        
        // when search term is empty, load most popular tags
        if (term.length == 0){
          this.onloadMoreTags(true)
        }
        return;
      }
      this.setState({create: false});
      const {searchTag, group, userLogout, navigation} = this.props;

      const request = {
        term: term,
      };

      const req = await searchTag(request);
      if (req.errors) {
        // alert(req.errors[0].message);
        alert('Search tags failed, please try again later');
        if (req.errors[0].message == 'Not Authenticated') {
          userLogout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
        }
        return;
      }
      this.setState({tags: req.tags, search_count: req.search_count});
    }
  };

  onloadMoreTags = async (init) => {
    const {searchTerm, tags, search_count, } = this.state;
    const {searchTag, userLogout, navigation} = this.props;

    const req = await searchTag({
      term: searchTerm,
      count: init ? 0 : search_count,
    });
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Load tags failed, please try again later');
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
        tags: init ? req.tags : prevState.tags.concat(req.tags),
        search_count: req.search_count,
      };
    });
  };

  onEndReach = () => {
    this.onloadMoreTags(false)
  }

  addTagToGroup = async tag => {
    const {addTagToGroup, auth, group, userLogout, navigation} = this.props;
    const {prev_route, addedTags} = this.state;

    if (prev_route == 'GroupSetting') {
      if (group.group.tags.length >= 5) {
        this.setState({warning: 'Every group can have max 5 tags'});
        return;
      }

      const request = {
        groupId: group.group.id,
        tag: tag,
        token: auth.token,
      };

      const req = await addTagToGroup(request);
      if (req.errors) {
        // alert(req.errors[0].message);
        alert('Cannot add tag at this time, please try again later')
        if (req.errors[0].message == 'Not Authenticated') {
          userLogout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
        }
        return;
      }
    } else if (prev_route == 'GroupCreation') {

      if (addedTags.length >= 5) {
        this.setState({warning: 'Every group can have max 5 tags'});
        return;
      }


      this.setState(prevState => {
        return {
          ...prevState,
          addedTags: prevState.addedTags.concat([tag]),
        };
      });
    }
  };

  removeTagFromGroup = async tag => {
    const {
      removeTagFromGroup,
      auth,
      group,
      userLogout,
      navigation,
    } = this.props;
    const {prev_route} = this.state;

    if (prev_route == 'GroupSetting') {
      const request = {
        groupId: group.group.id,
        tag: tag,
        token: auth.token,
      };

      const req = await removeTagFromGroup(request);
      if (req.errors) {
        // alert(req.errors[0].message);
        alert('Cannot remove tag at this time, please try again later')
        if (req.errors[0].message == 'Not Authenticated') {
          userLogout();
          navigation.reset({
            index: 0,
            routes: [{name: 'SignIn'}],
          });
        }
        return;
      }
    } else if (prev_route == 'GroupCreation'){
      this.setState(prevState => {
        return {
          ...prevState,
          addedTags: prevState.addedTags.filter(t => t.id != tag.id),
        };
      });
    }
  };

  render() {
    const {searchTerm, warning, create, tags, addedTags, theme} = this.state;
    let tagList = [];
    const {group, route} = this.props;
    const {prev_route} = route.params;
    if (prev_route == 'GroupSetting') {
      tagList = group.group.tags;
    } else {
      tagList = addedTags;
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
          <StatusBar barStyle={'dark-content'} />
          {warning.length > 0 ? (
            <Text style={{marginTop: 5, color: 'red'}}>{warning}</Text>
          ) : null}
          <View style={styles.optionArea}>
            <TagSearchBar
              onChange={this.onSearchChange}
              value={searchTerm}
              PrevRoute={prev_route}
              theme={theme}
            />
            {prev_route == 'GroupSetting' ? (
              <CreateTagButton onPress={this.onTagCreate} create={create} />
            ) : null}
          </View>

          {tagList.length != 0 ? (
            <View style={{height: 45, width: '95%', justifyContent: 'center'}}>
              <TagList
                groupTags={tagList || []}
                isSearch={false}
                isGroupHeader={false}
                onPress={this.removeTagFromGroup}
              />
            </View>
          ) : null}

          {create ? (
            <Text>
              Create tag <Text style={{color: 'red'}}>{searchTerm} </Text>
            </Text>
          ) : (
            <TagList
              tags={tags}
              onEndReached={this.onloadMoreTags}
              isSearch={true}
              isGroupHeader={false}
              groupTags={tagList}
              onPress={this.addTagToGroup}
            />
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
    backgroundColor: 'white'
  },
  optionArea: {
    width: '90%',
    height: '5%',
    marginTop: '3%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS == 'ios' ? 10 : 20,
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    width: '10%',
    height: '80%',
  },
  chosenList: {
    height: 30,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 3,
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    createTag: request => dispatch(createTag(request)),
    userLogout: () => dispatch(userLogout()),
    searchTag: request => dispatch(searchTag(request)),
    addTagToGroup: request => dispatch(addTagToGroup(request)),
    removeTagFromGroup: request => dispatch(removeTagFromGroup(request)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditTag);
