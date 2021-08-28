import React from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Input from '../components/reward/settingInput';
import validator from 'validator';
import TopRightButton from '../components/reward/topRightButton';
import {updateGroupRewardSetting, getGroupRewardList} from '../actions/reward';
import {getTheme} from '../utils/theme';

class RewardListSetting extends React.Component {
  state = {
    id: '1',
    type: 'loot',
    listName: 'List 1',
    chance1: '5',
    chance2: '10',
    chance3: '15',
    chance4: '30',
    chance5: '40',
    chance1Name: 'First Reward',
    chance2Name: 'Second Reward',
    chance3Name: 'Third Reward',
    chance4Name: 'Forth Reward',
    chance5Name: 'Fifth Reward',
    pointCost: '100',
    loading: false,
    ...this.props.route.params.list,
    origin: this.props.route.params.list,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitle: 'Cancel',
      headerTitle: 'List Settings',
      headerRight: () => (
        <TopRightButton
          type={'done'}
          onPress={this.updateGroupRewardSetting}
          disabled={true}
        />
      ),
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {navigation} = this.props;
    const {theme} = this.state;
    if (prevState != this.state) {
      const disabled = !this.validation();
      navigation.setOptions({
        headerRight: () => (
          <TopRightButton
            type={'done'}
            onPress={this.updateGroupRewardSetting}
            disabled={disabled || this.state.loading}
            theme={theme}
          />
        ),
      });
    }
  }

  componentWillUnmount() {
    const {auth, group, getGroupRewardList} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };
    getGroupRewardList(request);
  }

  validation = () => {
    let {
      listName,
      type,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
      chance1Name,
      chance2Name,
      chance3Name,
      chance4Name,
      chance5Name,
      origin,
      pointCost,
    } = this.state;

    // list name must be between 0 and 30
    if (listName.trim().length == 0 || listName.length > 30) {
      return false;
    }

    if (type == 'loot') {
      // chance name must be between 0 and 30
      if (
        chance1Name.trim().length == 0 ||
        chance1Name.length > 30 ||
        chance2Name.trim().length == 0 ||
        chance2Name.length > 30 ||
        chance3Name.trim().length == 0 ||
        chance3Name.length > 30 ||
        chance4Name.trim().length == 0 ||
        chance4Name.length > 30 ||
        chance5Name.trim().length == 0 ||
        chance5Name.length > 30
      ) {
        return false;
      }

      // chance must be float
      if (
        !validator.isFloat(chance1) ||
        !validator.isFloat(chance2) ||
        !validator.isFloat(chance3) ||
        !validator.isFloat(chance4) ||
        !validator.isFloat(chance5) ||
        !validator.isInt(pointCost)
      ) {
        return false;
      }

      // point cost needs to be between 100 and 9999
      if (parseInt(pointCost) < 100 || parseInt(pointCost) > 9999) {
        return false;
      }

      // chance must be unique
      if (
        chance1 == chance2 ||
        chance1 == chance3 ||
        chance1 == chance4 ||
        chance1 == chance5 ||
        chance2 == chance3 ||
        chance2 == chance4 ||
        chance2 == chance5 ||
        chance3 == chance4 ||
        chance3 == chance5 ||
        chance4 == chance5
      ) {
        return false;
      }

      // sum of chances must be not greater than 100
      const sum =
        parseFloat(chance1) +
        parseFloat(chance2) +
        parseFloat(chance3) +
        parseFloat(chance4) +
        parseFloat(chance5);

      if (sum > 100 || sum < 0) {
        return false;
      }
    } else {
    }

    // check if data is updated
    if (origin.listName == listName) {
      if (type == 'loot') {
        if (
          origin.chance1 == chance1 &&
          origin.chance2 == chance2 &&
          origin.chance3 == chance3 &&
          origin.chance4 == chance4 &&
          origin.chance5 == chance5 &&
          origin.chance1Name == chance1Name &&
          origin.chance2Name == chance2Name &&
          origin.chance3Name == chance3Name &&
          origin.chance4Name == chance4Name &&
          origin.chance5Name == chance5Name &&
          origin.pointCost == pointCost
        ) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  };

  updateGroupRewardSetting = async () => {
    const {
      id,
      type,
      listName,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
      chance1Name,
      chance2Name,
      chance3Name,
      chance4Name,
      chance5Name,
      pointCost,
    } = this.state;
    const {auth, group, updateGroupRewardSetting, navigation} = this.props;

    let request = {};

    // loot list
    if (type == 'loot') {
      const sum =
        parseFloat(chance1) +
        parseFloat(chance2) +
        parseFloat(chance3) +
        parseFloat(chance4) +
        parseFloat(chance5);

      if (sum > 100 || sum < 0) {
        alert('The sum of chance needs to be between 0 and 100');
        return false;
      }

      if (
        chance1 == chance2 ||
        chance1 == chance3 ||
        chance1 == chance4 ||
        chance1 == chance5 ||
        chance2 == chance3 ||
        chance2 == chance4 ||
        chance2 == chance5 ||
        chance3 == chance4 ||
        chance3 == chance5 ||
        chance4 == chance5
      ) {
        alert('Each chance must be unique');
        return false;
      }

      if (parseInt(pointCost) < 100 || parseInt(pointCost) > 9999) {
        alert('Point costs need to be between 100 and 9999');
        return false;
      }

      request = {
        listId: id,
        listName: listName.trim(),
        chance1: parseFloat(chance1),
        chance2: parseFloat(chance2),
        chance3: parseFloat(chance3),
        chance4: parseFloat(chance4),
        chance5: parseFloat(chance5),
        chance1Name,
        chance2Name,
        chance3Name,
        chance4Name,
        chance5Name,
        pointCost: parseInt(pointCost),
        token: auth.token,
        groupId: group.group.id,
      };
    } else {
      // redeem list
      request = {
        listId: id,
        listName: listName.trim(),
        token: auth.token,
        groupId: group.group.id,
      };
    }

    this.setState({loading: true});
    const req = await updateGroupRewardSetting(request);
    this.setState({loading: false});
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot update reward settings, please try again later');
      return;
    }

    navigation.goBack();
  };

  onInputChange = (value, type) => {
    if (type == 'listName') {
      this.setState({listName: value.substr(0, 30)});
    } else if (type == 'chance1') {
      this.setState({chance1: value.trim()});
    } else if (type == 'chance2') {
      this.setState({chance2: value.trim()});
    } else if (type == 'chance3') {
      this.setState({chance3: value.trim()});
    } else if (type == 'chance4') {
      this.setState({chance4: value.trim()});
    } else if (type == 'chance5') {
      this.setState({chance5: value.trim()});
    } else if (type == 'chance1Name') {
      this.setState({chance1Name: value.substr(0, 30)});
    } else if (type == 'chance2Name') {
      this.setState({chance2Name: value.substr(0, 30)});
    } else if (type == 'chance3Name') {
      this.setState({chance3Name: value.substr(0, 30)});
    } else if (type == 'chance4Name') {
      this.setState({chance4Name: value.substr(0, 30)});
    } else if (type == 'chance5Name') {
      this.setState({chance5Name: value.substr(0, 30)});
    } else if (type == 'pointCost') {
      this.setState({pointCost: value.trim()});
    }
  };

  render() {
    const {
      listName,
      type,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
      loading,
      chance1Name,
      chance2Name,
      chance3Name,
      chance4Name,
      chance5Name,
      pointCost,
      id,
      theme,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={[styles.container, theme.greyArea]} bounces={false}>
          <Input
            type={'listName'}
            value={listName}
            onInputChange={this.onInputChange}
            theme={theme}
          />

          {type == 'loot' ? (
            <Input
              type={'pointCost'}
              value={pointCost}
              onInputChange={this.onInputChange}
              listId={id}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance1Name'}
              value={chance1Name}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance1'}
              value={chance1.toString()}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance2Name'}
              value={chance2Name}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance2'}
              value={chance2.toString()}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance3Name'}
              value={chance3Name}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance3'}
              value={chance3.toString()}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance4Name'}
              value={chance4Name}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance4'}
              value={chance4.toString()}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance5Name'}
              value={chance5Name}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Input
              type={'chance5'}
              value={chance5.toString()}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {type == 'loot' ? (
            <Text style={[styles.text, theme.textColor]}>
              The sum of all chances must be not greater than 100% and each
              chance must be unique
            </Text>
          ) : null}

          <ActivityIndicator animating={loading} color={'grey'} />
          <View style={styles.empty} />
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  text: {
    color: 'grey',
    marginTop: 5,
    fontSize: 12,
    marginLeft: 5,
  },
  empty: {
    width: '100%',
    height: 400,
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    updateGroupRewardSetting: data => dispatch(updateGroupRewardSetting(data)),
    getGroupRewardList: data => dispatch(getGroupRewardList(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardListSetting);
