import React from 'react';
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  View,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import GroupsSearchBar from '../components/groupsSearch/searchBar';
import CreateGroupButton from '../components/groupsSearch/createGroupButton';
import {searchGroup} from '../actions/group';
import GroupList from '../components/groups/groupList';
import {userLogout} from '../actions/auth';
import {searchGroupFunc} from '../functions/group';

class GroupsSearch extends React.Component {
  state = {
    searchTerm: '',
    groupsData: [],
    count: 0,
    prevRoute: 'groups',
    ...this.props.route.params,
  };

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerBackTitleVisible: false,
    });
  }

  onSearchChange = async text => {
    const term = text.trim();
    this.setState({searchTerm: text});

    if (term.length < 3) {
      this.setState({groupsData: [], count: 0});
      return;
    }

    const {searchGroup, auth, navigation, userLogout} = this.props;

    const data = {
      searchGroup: searchGroup,
      auth: auth,
      navigation: navigation,
      userLogout: userLogout,
      count: 0,
      searchTerm: text,
    };

    const searchResult = await searchGroupFunc(data);

    if (searchResult != 0) {
      const {groups, count} = searchResult;
      this.setState({
        groupsData: groups,
        count: count,
      });
    }

    return;
  };

  onEndReached = async () => {
    const {searchTerm, count, groupsData} = this.state;
    const {searchGroup, auth, navigation, userLogout} = this.props;

    if (searchTerm.length < 3) {
      this.setState({groupsData: [], count: 0});
      return;
    }

    const data = {
      searchGroup: searchGroup,
      auth: auth,
      navigation: navigation,
      userLogout: userLogout,
      count: count,
      searchTerm: searchTerm,
    };

    const searchResult = await searchGroupFunc(data);

    if (searchResult != 0) {
      const {groups, count} = searchResult;
      const newGroups = groupsData.concat(groups);
      this.setState({
        groupsData: newGroups,
        count: newGroups.length,
        count: count,
      });
    }
  };

  onCreateGroupButtonPress = () => {
    const {navigation} = this.props;
    navigation.navigate('GroupCreation');
  };

  render() {
    const {searchTerm, groupsData, prevRoute} = this.state;
    console.log(this.state);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <View style={styles.optionArea}>
            <GroupsSearchBar
              onChange={this.onSearchChange}
              value={searchTerm}
            />
            {prevRoute == 'groups' ? (
              <CreateGroupButton onPress={this.onCreateGroupButtonPress} />
            ) : null}
          </View>

          <GroupList
            groupsData={groupsData || []}
            navigation={this.props.navigation}
            onEndReached={this.onEndReached}
            route={'search'}
            prevRoute={prevRoute}
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
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  optionArea: {
    width: '90%',
    height: '5%',
    marginTop: '3%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    width: '10%',
    height: '80%',
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    searchGroup: data => dispatch(searchGroup(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsSearch);
