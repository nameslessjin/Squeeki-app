import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StatusBar,
  Text
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {loadLeaderBoardFunc} from '../functions/point';
import {getGroupPointLeaderBoard} from '../actions/point';
import LeaderboardList from '../components/leaderboard/leaderboardList';

class Leaderboard extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
    });

    this.loadLeaderBoard(true, 'month');
  }

  componentWillUnmount() {
    this.loadLeaderBoard(true, 'month', 3);
  }

  loadLeaderBoard = (init, period, limit) => {
    const {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
      point,
    } = this.props;
    const {count} = point.leaderboard;
    const data = {
      userLogout: userLogout,
      auth: auth,
      getGroupPointLeaderBoard: getGroupPointLeaderBoard,
      navigation: navigation,
      group: group,
      count: init ? 0 : count,
      limit: limit || 20,
      period: period,
    };

    loadLeaderBoardFunc(data);
  };

  onEndReached = () => {
    this.setState({loading: true});
    this.loadLeaderBoard(false, 'month');
    this.setState({loading: false});
  };

  render() {
    const {users} = this.props.point.leaderboard;

    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <View style={styles.leaderboard}>
            <LeaderboardList users={users} onEndReached={this.onEndReached} />
          </View>
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
  leaderboard:{
      width: '100%',
      height: '100%',
      padding: 10
  }
});

const mapStateToProps = state => {
  const {group, auth, point} = state;
  return {group, auth, point};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getGroupPointLeaderBoard: data => dispatch(getGroupPointLeaderBoard(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Leaderboard);
