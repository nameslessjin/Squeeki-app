import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import SearchBar from '../components/groupsSearch/searchBar';

class RewardManagement extends React.Component {
  state = {
    searchTerm: '',
  };

  onInputChange = () => {};

  render() {
    const {searchTerm} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={styles.optionArea}>
            <SearchBar onChange={this.onInputChange} value={searchTerm} />
          </View>
        </TouchableWithoutFeedback>
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
  optionArea: {
    width: '90%',
    height: '5%',
    marginTop: '3%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS == 'ios' ? 10 : 20,
    // backgroundColor: 'white'
  },
});

const mapStateToProps = state => {
  const {group, auth, reward} = state;
  return {group, auth, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupRewardHistory: data => dispatch(getGroupRewardHistory(data)),
    userLogout: () => dispatch(userLogout()),
    getReward: data => dispatch(getReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardManagement);
