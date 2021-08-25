import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {getTheme} from '../../utils/theme';
import AdminSearchList from '../../components/admin/adminHome/AdminSearchList';
import AdminSearchBar from '../../components/admin/adminHome/AdminSearchBar';
import SearchTypeSwtich from '../../components/admin/adminHome/searchTypeSwitch';
import {searchASAdmin} from '../../actions/security';

class AdminHome extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
    searchTerm: '',
    type: 'group',
    modalVisible: false,
    modalType: 'search',
    searchResult: [],
    count: 0,
  };

  onInputChange = (type, value) => {
    if (type == 'type') {
      this.switchType(value);
      this.setState({searchResult: [], count: 0, searchTerm: ''});
    } else if (type == 'searchTerm') {
      this.onSearchChange(value);
    }

    if (type != 'searchTerm') {
      Keyboard.dismiss();
    }
  };

  switchType = value => {
    const {
      searchUserClearance,
      searchGroupClearance,
      searchPostClearance,
      searchCommentClearance,
    } = this.props.metadata.securityClearance;
    switch (value) {
      case 'user':
        if (searchPostClearance) {
          this.setState({type: 'post'});
          break;
        } else if (searchCommentClearance) {
          this.setState({type: 'comment'});
          break;
        } else if (searchGroupClearance) {
          this.setState({type: 'group'});
          break;
        }
        break;
      case 'group':
        if (searchUserClearance) {
          this.setState({type: 'user'});
          break;
        } else if (searchPostClearance) {
          this.setState({type: 'post'});
          break;
        } else if (searchCommentClearance) {
          this.setState({type: 'comment'});
          break;
        }
        break;
      case 'post':
        if (searchCommentClearance) {
          this.setState({type: 'comment'});
          break;
        } else if (searchUserClearance) {
          this.setState({type: 'user'});
          break;
        } else if (searchGroupClearance) {
          this.setState({type: 'group'});
          break;
        }
        break;
      case 'comment':
        if (searchGroupClearance) {
          this.setState({type: 'group'});
          break;
        } else if (searchUserClearance) {
          this.setState({type: 'user'});
          break;
        } else if (searchPostClearance) {
          this.setState({type: 'post'});
          break;
        }
        break;
      default:
        break;
    }
  };

  onSearchChange = async text => {
    const term = text.trim();
    const {searchTerm, count} = this.state;
    this.setState({searchTerm: text});
    if (term.length < 3) {
      this.setState({searchResult: [], count: 0});
      return;
    }

    const {searchASAdmin, auth} = this.props;
    const {type} = this.state;
    const request = {
      type,
      token: auth.token,
      searchTerm: text,
      count: text == searchTerm ? count : 0,
    };

    const req = await searchASAdmin(request);

    if (req.errors) {
      console.log(req.errors);
      alert('Search as admin error');
      return;
    }

    const {data} = req;
    this.setState(prevState => ({
      searchResult:
        text == searchTerm ? prevState.searchResult.concat(data) : data,
      count: req.count,
    }));
  };

  onEndReached = () => {
    this.onSearchChange(this.state.searchTerm)
  }

  render() {
    const {theme, type, searchTerm, searchResult} = this.state;
    const {navigation} = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.greyArea]}>
          <View style={styles.searchBarArea}>
            <AdminSearchBar
              onInputChange={this.onInputChange}
              value={searchTerm}
              theme={theme}
              type={type}
            />
            <SearchTypeSwtich type={type} onInputChange={this.onInputChange} />
          </View>
          <AdminSearchList
            data={searchResult || []}
            navigation={navigation}
            type={type}
            onEndReached={this.onEndReached}
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
  searchBarArea: {
    width: '100%',
    height: 70,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const {auth, metadata} = state;
  return {auth, metadata};
};

const mapDispatchToProps = dispatch => {
  return {
    searchASAdmin: data => dispatch(searchASAdmin(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminHome);
