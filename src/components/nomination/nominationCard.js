import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {turnNomination} from '../../actions/nomination';
import {userLogout} from '../../actions/auth';
import {getTheme} from '../../utils/theme';

class NominationCard extends React.Component {
  options = [
    {key: 0, value: 'Once'},
    {key: 7, value: 'Once Every Week'},
    {key: 14, value: 'Once Every Two Weeks'},
    {key: 30, value: 'Once Every Month'},
  ];

  state = {
    item: this.props.item,
    loading: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  onEditPress = () => {
    const {item, onEditPress} = this.props;
    onEditPress(item);
  };

  onTurnPress = async () => {
    const {item, turnNomination, auth, navigation, userLogout} = this.props;
    const {on} = this.state;
    const data = {
      id: item.id,
      token: auth.token,
    };

    this.setState({loading: true});
    const nomination = await turnNomination(data);
    this.setState({loading: false});
    if (nomination.errors) {
      // alert(nomination.errors[0].message);
      alert('Cannot turn on nomination at this time, please try again later');
      if (nomination.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    this.setState({on: !on});
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps != this.props) {
      this.setState({item: this.props.item});
    }
  }

  onSelected = () => {
    const {prev_route, onNominationSelect, item} = this.props;
    if (prev_route != 'PostSetting') {
      return;
    }
    onNominationSelect(item);
  };

  render() {
    let {item, loading, theme} = this.state;
    let {name, period, points, on, selected, type} = item;
    const {prev_route, group} = this.props;
    const value = this.options.filter(i => i.key == period)[0].value;
    const type_display = type == 'reward' ? 'Reward' : 'Penalty';
    const {auth, rank_setting} = group.group;

    return (
      <TouchableWithoutFeedback onPress={this.onSelected}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: selected
                ? '#c7ecee'
                : theme.backgroundColor.backgroundColor,
            },
          ]}>
          <View style={styles.textContainer}>
            <Text style={[styles.name, theme.textColor]}>{name}</Text>
            <Text style={[styles.period, theme.textColor]}>
              {'For nomination: ' + points} points
            </Text>
            <Text style={[styles.period, theme.textColor]}>
              For winner: 200 points
            </Text>
            {/* <Text style={styles.period}>Multiplier: 3x</Text> */}
            <Text style={[styles.period, theme.textColor]}>{value}</Text>
          </View>

          {prev_route == 'PostSetting' ||
          auth.rank > rank_setting.group_setting_rank_required ? (
            <View style={styles.options} />
          ) : (
            <View style={styles.options}>
              <TouchableOpacity onPress={this.onEditPress}>
                <Text style={{color: '#2980b9'}}>Edit</Text>
              </TouchableOpacity>
              {loading ? (
                <ActivityIndicator animating={true} color={'grey'} />
              ) : (
                <TouchableOpacity onPress={this.onTurnPress}>
                  <Text style={{color: on ? '#27ae60' : 'red'}}>
                    {on ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 165,
    backgroundColor: 'white',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  textContainer: {
    width: '150%',
    height: 135,
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#bdc3c7',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  period: {
    marginTop: 7,
  },
  options: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    turnNomination: data => dispatch(turnNomination(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NominationCard);
