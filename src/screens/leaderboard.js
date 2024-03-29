import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {loadLeaderBoardFunc} from '../functions/point';
import {getGroupPointLeaderBoard} from '../actions/point';
import LeaderboardList from '../components/leaderboard/leaderboardList';
import {getTheme} from '../utils/theme'

class Leaderboard extends React.Component {
  state = {
    loading: false,
    theme: getTheme(this.props.auth.user.theme)
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentWillUnmount() {
    const {navigation, group} = this.props;
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'Leaderboard',
      });
    }
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
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
      count: init ? 0 : count,
      limit: limit || 20,
      period,
      init,
    };

    loadLeaderBoardFunc(data);
  };

  onEndReached = period => {
    this.loadLeaderBoard(false, period);
  };

  render() {
    const {users} = this.props.point.leaderboard;
    const {theme} = this.state
    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
          <View style={styles.leaderboard}>
            <LeaderboardList
              users={users}
              onEndReached={this.onEndReached}
              loadLeaderBoard={this.loadLeaderBoard}
              theme={theme}
            />
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
  leaderboard: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
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
