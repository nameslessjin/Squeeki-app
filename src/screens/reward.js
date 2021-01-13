import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  touchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {lootReward} from '../actions/reward';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Card from '../components/reward/rewardCard';

class Reward extends React.Component {
  state = {
    point: 0,
    loading: false,
    reward: {},
  };

  componentDidMount() {
    const {point} = this.props;
    this.setState({point: point.total_point});
  }

  componentWillUnmount() {
    // get group points
    console.log('unmount')
  }

  lootReward = async () => {
    const {lootReward, navigation, userLogout, group, auth} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    const req = await lootReward(request);
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

    this.setState({reward: req.reward, point: req.total_point});
  };

  onLootPress = async () => {
    this.setState({loading: true});
    // function loot measure
    await this.lootReward();
    this.setState({loading: false});
  };

  render() {
    const {point, loading, reward} = this.state;
    const disabled = loading || point < 100;
    console.log(reward);
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <View style={styles.container}>
          <View
            style={{
              width: '100%',
              height: '70%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {reward.id ? (
              <Card item={reward} route={'reward'} />
            ) : (
              <MaterialIcons
                name={'treasure-chest'}
                size={200}
                color={'gold'}
                style={{
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              />
            )}
          </View>
          <View
            style={{
              width: '100%',
              height: '30%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '500', fontSize: 20, marginBottom: 10}}>
              Points: {point}
            </Text>
            <TouchableOpacity disabled={disabled} onPress={this.onLootPress}>
              <View
                style={{
                  width: 150,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: disabled ? 'silver' : '#EA2027',
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
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
                  Loot
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
});

const mapStateToProps = state => {
  const {group, auth, point} = state;
  return {group, auth, point};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    lootReward: data => dispatch(lootReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reward);
