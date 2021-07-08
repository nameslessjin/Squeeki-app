import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {lootReward} from '../actions/reward';
import {getUserGroupPoint} from '../actions/point';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../components/reward/rewardCard';

class Reward extends React.Component {
  state = {
    point: 0,
    loading: false,
    reward: {},
    rewardList: []
  };

  componentDidMount() {
    const {point} = this.props;
    this.setState({point: point.total_point});
  }

  componentWillUnmount() {
    // get group points
    this.getUserGroupPoint();
  }

  getUserGroupPoint = async () => {
    const {navigation, userLogout, group, auth, getUserGroupPoint} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };
    const req = await getUserGroupPoint(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load points at this time, please try again later')
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

  lootReward = async () => {
    const {lootReward, navigation, userLogout, group, auth} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await lootReward(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot loot reward at this time, please try again later')
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({reward: req.reward, point: req.total_point});
  };

  onLootPress = async () => {
    this.setState({loading: true});
    // function loot measure
    await this.lootReward();
    this.setState({loading: false});
  };

  render() {
    const {point, loading, reward, rewardList} = this.state;
    const {auth, rank_setting} = this.props.group.group
    const disabled = loading || point < 100 || rank_setting.reward_rank_required < auth.rank;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <View style={styles.container}>
          {/* <View style={styles.rewardContainer}>
            {loading ? (
              <ActivityIndicator animating={loading} size={'large'} color={'grey'} />
            ) : reward.id ? (
              <Card item={reward} route={'reward'} />
            ) : (
              <MaterialIcons
                name={'treasure-chest'}
                size={200}
                color={'gold'}
                style={styles.treasure}
              />
            )}
          </View> */}
          {/* <View style={styles.pointButtonContainer}>
            <Text style={styles.point}>Points: {point}</Text>
            <TouchableOpacity disabled={disabled} onPress={this.onLootPress}>
              <View
                style={[
                  styles.buttonContainer,
                  {backgroundColor: disabled ? 'silver' : '#EA2027'},
                ]}>
                <Text style={styles.buttonText}>Loot</Text>
              </View>
            </TouchableOpacity>
            <Text
              style={{
                color: 'grey',
                marginTop: 5,
                fontStyle: 'italic',
                fontSize: 12,
              }}>
              Cost: 100
            </Text>
          </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  rewardContainer: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  treasure: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointButtonContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  point: {
    fontWeight: '500',
    fontSize: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    width: 150,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

const mapStateToProps = state => {
  const {group, auth, point} = state;
  return {group, auth, point};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    lootReward: data => dispatch(lootReward(data)),
    getUserGroupPoint: data => dispatch(getUserGroupPoint(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reward);
