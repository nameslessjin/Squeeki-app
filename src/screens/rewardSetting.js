import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import TopRightButton from '../components/reward/topRightButton';
import Input from '../components/reward/settingInput';
import {createGroupReward, getGroupReward} from '../actions/reward';
import {loadGroupRewardsFunc} from '../functions/reward';
import {userLogout} from '../actions/auth';
import RewardModal from '../components/reward/rewardModal'

class RewardSetting extends React.Component {
  state = {
    loading: false,
    name: '',
    content: '',
    chance: '',
    hide: false,
    modalVisible: false
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerRight: () => (
        <TopRightButton
          type={'done'}
          onPress={this.onAddReward}
          disabled={true}
        />
      ),
      headerTitle: 'Settings'
    });
  }

  validation = () => {
    let {name, content, chance, hide} = this.state;
    name = name.trim();
    content = content.trim();
    chance = parseInt(chance.trim());

    if (name.length == 0) {
      return false;
    }

    if (content.length == 0) {
      return false;
    }

    if (
      !(
        chance == 1 ||
        chance == 4 ||
        chance == 10 ||
        chance == 15 ||
        chance == 30 ||
        chance == 40
      )
    ) {
      return false;
    }

    return true;
  };

  componentWillUnmount() {
    this.loadGroupReward();
  }

  loadGroupReward = () => {
    const {
      group,
      auth,
      userLogout,
      navigation,
      getGroupReward,
    } = this.props;
    const data = {
      group,
      userLogout,
      auth,
      navigation,
      count: 0,
      func: getGroupReward,
      redeemed: false,
    };

    loadGroupRewardsFunc(data);
  };

  componentDidUpdate(prevProps, prevState) {
    const {navigation} = this.props;
    if (prevState != this.state) {
      const disabled = !this.validation();
      navigation.setOptions({
        headerRight: () => (
          <TopRightButton
            type={'done'}
            onPress={this.onAddReward}
            disabled={disabled}
          />
        ),
      });
    }
  }

  onAddReward = async () => {
    const {name, content, hide, chance} = this.state;
    const {navigation, auth, group, createGroupReward, userLogout} = this.props;

    const request = {
      token: auth.token,
      groupId: group.group.id,
      type: 'manual',
      content: content.trim(),
      hide: hide,
      name: name.trim(),
      chance: parseInt(chance),
      from: 'group',
    };

    this.setState({loading: true});
    const req = await createGroupReward(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot add reward at this time, please try again later')
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.setState({loading: false});
    navigation.navigate('List');
  };

  onInputChange = (type, value) => {
    if (type == 'name') {
      this.setState({name: value});
    } else if (type == 'content') {
      this.setState({content: value});
    } else if (type == 'chance') {
      this.setState({chance: value.trim()});
    } else if (type == 'hide') {
      this.setState(prevState => {
        return {
          ...prevState,
          hide: !prevState.hide,
        };
      });
    }
  };

  onBackdropPress = () => {
    Keyboard.dismiss()
    this.setState({modalVisible: false})
  }

  onQuestionMarkPress = () => {
    this.setState({modalVisible: true})
  }

  render() {
    const {loading, name, content, chance, hide, modalVisible} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'content'}
            value={content}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'hide'}
            value={hide}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'chance'}
            value={chance}
            onInputChange={this.onInputChange}
            onQuestionMarkPress={this.onQuestionMarkPress}
          />
          <ActivityIndicator animating={loading} />
          <RewardModal modalVisible={modalVisible} onBackdropPress={this.onBackdropPress} />
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
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    createGroupReward: data => dispatch(createGroupReward(data)),
    userLogout: () => dispatch(userLogout()),
    getGroupReward: data => dispatch(getGroupReward(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardSetting);
