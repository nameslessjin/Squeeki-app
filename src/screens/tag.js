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

class EditTag extends React.Component {
  state = {
    searchTerm: '',
    warning: '',
    create: false,
    tags: [],
    prev_route: 'GroupSetting',
    addedTags: []
  };

  componentDidMount() {
    const {navigation, route} = this.props;
    const {prev_route} = route.params;
    this.setState({prev_route: prev_route});

    navigation.setOptions({
      headerBackTitleVisible: false,
    });
  }

  onTagCreate = async () => {
    const {searchTerm} = this.state;
    const {auth, group, createTag, userLogout} = this.props;
    const tag_name = searchTerm.substring(1).trim();

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
        this.setState({tags: [], warning: '', create: false});
        return;
      }
      this.setState({create: false});
      const {searchTag, group, userLogout, navigation} = this.props;
      const current_tags_id = group.group.tags.map(t => t.id);
      const req = await searchTag({
        term: term,
        current_tags_id: current_tags_id,
      });
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
      this.setState({tags: req.tags, search_count: req.search_count});
    }
  };

  onloadMoreTags = async () => {
    const {searchTerm, tags, search_count} = this.state;
    const {searchTag, group, userLogout, navigation} = this.props;
    const current_tags_id = group.group.tags.map(t => t.id);
    const req = await searchTag({
      term: searchTerm,
      count: search_count,
      current_tags_id: current_tags_id,
    });
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
        tags: tags.concat(req.tags),
        search_count: req.search_count,
      };
    });
  };

  addTagToGroup = async tag => {
    const {addTagToGroup, auth, group, userLogout, navigation} = this.props;

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
  };

  removeTagFromGroup = async tag => {
    const {
      removeTagFromGroup,
      auth,
      group,
      userLogout,
      navigation,
    } = this.props;
    const request = {
      groupId: group.group.id,
      tag: tag,
      token: auth.token,
    };

    const req = await removeTagFromGroup(request);
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
  };

  render() {
    const {searchTerm, warning, create, tags, prev_route, addedTags} = this.state;
    let tagList = []
    const {group} = this.props;
    if (prev_route == 'GroupSetting'){
      tagList = group.group.tags
    } else {
      tagList = addedTags
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {warning.length > 0 ? (
            <Text style={{marginTop: 5, color: 'red'}}>{warning}</Text>
          ) : null}
          <View style={styles.optionArea}>
            <TagSearchBar onChange={this.onSearchChange} value={searchTerm} />
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
