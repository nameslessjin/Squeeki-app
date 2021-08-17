import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {
  getGroupNominationMostRecentResults,
  getGroupNominationResults,
} from '../actions/nomination';
import {userLogout} from '../actions/auth';
import {getSundays} from '../utils/time';
import {invalidAuthentication} from '../functions/auth';
import NominationResultList from '../components/nominationResults/nominationResultList';
import {GroupNominationResultsFormatting} from '../functions/nomination';
import {getNominationPost} from '../actions/post';

class NominationResult extends React.Component {
  state = {
    mostRecentNominationResults: {},
    nominationResults: {},
    refreshing: false,
    loading: false,
  };

  componentDidMount() {
    const {navigation, group, auth} = this.props;
    navigation.setOptions({
      headerTitle: 'Nomination Results',
      headerBackTitleVisible: false,
    });

    this.loadNominationResult(true);
  }

  componentWillUnmount() {
    const {group, navigation} = this.props;
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'NominationResult',
      });
    }
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadNominationResult(true);
    this.setState({refreshing: false});
  };

  onEndReached = () => {
    this.setState({loading: true});
    this.loadNominationResult(false);
    this.setState({loading: false});
  };

  loadNominationResult = async init => {
    const {
      navigation,
      group,
      auth,
      getGroupNominationMostRecentResults,
      getGroupNominationResults,
      userLogout,
    } = this.props;
    const {nominationResults} = this.state;

    const {last_sunday, next_sunday} = getSundays();

    let data = {
      groupId: group.group.id,
      token: auth.token,
      endAt: next_sunday,
      count: init ? 0 : nominationResults.count || 0,
    };

    if (init) {
      const mostRecentNominationResult = await getGroupNominationMostRecentResults(
        data,
      );
      invalidAuthentication({
        queryResult: mostRecentNominationResult,
        userLogout: userLogout,
        navigation: navigation,
      });
      this.setState({
        mostRecentNominationResults:
          mostRecentNominationResult.data.getGroupNominationMostRecentResults,
      });
    }

    const nominationResult = await getGroupNominationResults(data);
    invalidAuthentication({
      queryResult: nominationResult,
      userLogout: userLogout,
      navigation: navigation,
    });

    const new_nomination_result =
      nominationResult.data.getGroupNominationResults;

    if (init) {
      this.setState({nominationResults: new_nomination_result});
    } else {
      // if currently, there is no nomination results or the newly retrieved one is empty
      if (
        nominationResults.oldResultList &&
        new_nomination_result.oldResultList.length != 0
      ) {
        const new_nominationResults = GroupNominationResultsFormatting({
          nominationResults: nominationResults,
          new_nomination_result: new_nomination_result,
        });
        this.setState({nominationResults: new_nominationResults});
      }
    }
  };

  onNomineePress = async props => {
    let {nomineeId, time, nominationId} = props;
    const {navigation} = this.props;

    navigation.navigate('NominationPost', {
      nomineeId: nomineeId,
      time: time,
      nominationId: nominationId,
    });
  };

  render() {
    const {
      mostRecentNominationResults,
      nominationResults,
      refreshing,
      loading,
    } = this.state;

    return (
      <View style={styles.container}>
        <NominationResultList
          mostRecentNominationResults={mostRecentNominationResults}
          nominationResults={nominationResults}
          onRefresh={this.onRefresh}
          refreshing={refreshing}
          onEndReached={this.onEndReached}
          onNomineePress={this.onNomineePress}
        />
        {loading ? <ActivityIndicator animating={true} color={'grey'} /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupNominationMostRecentResults: data =>
      dispatch(getGroupNominationMostRecentResults(data)),
    getGroupNominationResults: data =>
      dispatch(getGroupNominationResults(data)),
    userLogout: () => dispatch(userLogout()),
    getNominationPost: data => dispatch(getNominationPost(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NominationResult);
