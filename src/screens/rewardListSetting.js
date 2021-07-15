import React from 'react';
import {
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import Input from '../components/reward/settingInput';
import validator from 'validator';
import TopRightButton from '../components/reward/topRightButton';
import {updateGroupRewardSetting, getGroupRewardList} from '../actions/reward';

class RewardListSetting extends React.Component {
  state = {
    id: '1',
    listName: 'List 1',
    chance1: '5',
    chance2: '10',
    chance3: '15',
    chance4: '30',
    chance5: '40',
    loading: false,
    ...this.props.route.params.list,
    origin: this.props.route.params.list,
  };

  componentDidMount() {
    const {navigation} = this.props;
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
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {navigation} = this.props;
    if (prevState != this.state) {
      const disabled = !this.validation();
      navigation.setOptions({
        headerRight: () => (
          <TopRightButton
            type={'done'}
            onPress={this.updateGroupRewardSetting}
            disabled={disabled || this.state.loading}
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
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
      origin,
    } = this.state;

    if (listName.trim().length == 0 || listName.length > 30) {
      return false;
    }

    if (
      !validator.isFloat(chance1) ||
      !validator.isFloat(chance2) ||
      !validator.isFloat(chance3) ||
      !validator.isFloat(chance4) ||
      !validator.isFloat(chance5)
    ) {
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
      return false;
    }

    const sum =
      parseFloat(chance1) +
      parseFloat(chance2) +
      parseFloat(chance3) +
      parseFloat(chance4) +
      parseFloat(chance5);

    if (sum > 100 || sum < 0) {
      return false;
    }

    // check if data is updated
    if (
      origin.listName == listName &&
      origin.chance1 == chance1 &&
      origin.chance2 == chance2 &&
      origin.chance3 == chance3 &&
      origin.chance4 == chance4 &&
      origin.chance5 == chance5
    ) {
      return false;
    }

    return true;
  };

  updateGroupRewardSetting = async () => {
    const {
      id,
      listName,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
    } = this.state;
    const {auth, group, updateGroupRewardSetting} = this.props;

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
          alert('Each chance must be unique')
        return false;
      }

    const request = {
      groupRewardSettingId: id,
      listName: listName.trim(),
      chance1: parseFloat(chance1),
      chance2: parseFloat(chance2),
      chance3: parseFloat(chance3),
      chance4: parseFloat(chance4),
      chance5: parseFloat(chance5),
      token: auth.token,
      groupId: group.group.id,
    };

    this.setState({loading: true});
    const req = await updateGroupRewardSetting(request);
    this.setState({loading: false});
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot update reward settings, please try again later');
      return;
    }
    this.setState({
      origin: {listName, chance1, chance2, chance3, chance4, chance5},
    });
  };

  onInputChange = (type, value) => {
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
    }
  };

  onPress = () => {};

  render() {
    const {
      listName,
      chance1,
      chance2,
      chance3,
      chance4,
      chance5,
      loading,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} bounces={false}>
          <Input
            type={'listName'}
            value={listName}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'chance1'}
            value={chance1.toString()}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'chance2'}
            value={chance2.toString()}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'chance3'}
            value={chance3.toString()}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'chance4'}
            value={chance4.toString()}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'chance5'}
            value={chance5.toString()}
            onInputChange={this.onInputChange}
          />
          <Text style={styles.text}>
            The sum of all chances must be not greater than 100 and each chance
            must be unique
          </Text>
          <ActivityIndicator animating={loading} color={'grey'} />
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
