import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import TopRightButton from '../components/reward/topRightButton';
import Input from '../components/reward/settingInput';
import {createGroupReward, getGroupReward} from '../actions/reward';
import {loadGroupRewardsFunc} from '../functions/reward';
import {userLogout} from '../actions/auth';
import RewardModal from '../components/reward/rewardModal';
import validator from 'validator';
import {v4 as uuidv4} from 'uuid';

class RewardSetting extends React.Component {
  state = {
    loading: false,
    name: '',
    content: '',
    chance: '10',
    hide: false,
    modalVisible: false,
    count: '1',
    separateContent: false,
    listNum: '1',
    contentList: [],
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
      headerTitle: 'Settings',
    });
  }

  validation = () => {
    let {name, content, chance, hide, count, listNum} = this.state;
    name = name.trim();
    content = content.trim();

    if (name.length == 0) {
      return false;
    }

    // if chance is not a float or either count and list No is not int, return false
    if (
      !validator.isFloat(chance) ||
      !validator.isInt(count) ||
      !validator.isInt(listNum)
    ) {
      return false;
    }

    // list No should be 1, 2 or 3
    if (parseInt(listNum) > 3 || parseInt(listNum) < 1) {
      return false;
    }

    // count should be between 1 and 9999
    if (parseInt(count) < 1 || parseInt(count) > 9999) {
      return false;
    }

    // chance should be between 0.1 and 100
    if (parseFloat(chance) < 0.1 || parseFloat(chance) > 100) {
      return false;
    }

    return true;
  };

  componentWillUnmount() {
    // this.loadGroupReward();
  }

  loadGroupReward = () => {
    const {group, auth, userLogout, navigation, getGroupReward} = this.props;
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

    // this.setState({loading: true});
    // const req = await createGroupReward(request);
    // if (req.errors) {
    //   // alert(req.errors[0].message);
    //   alert('Cannot add reward at this time, please try again later')
    //   if (req.errors[0].message == 'Not Authenticated') {
    //     userLogout();
    //     navigation.reset({
    //       index: 0,
    //       routes: [{name: 'SignIn'}],
    //     });
    //   }
    //   return;
    // }
    // this.setState({loading: false});
    // navigation.navigate('List');
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
    } else if (type == 'count') {
      this.setState({count: value.trim()});
    } else if (type == 'listNum') {
      console.log('value');
      this.setState({listNum: value.trim()});
    } else if (type == 'separateContent') {
      this.setState(prevState => {
        return {
          ...prevState,
          separateContent: !prevState.separateContent,
        };
      });
    }
  };

  onBackdropPress = () => {
    Keyboard.dismiss();
    this.setState({modalVisible: false});
  };

  onPress = type => {
    if (type == 'listNum') {
      this.setState({modalVisible: true});
    } else if (type == 'contentList') {
      const {count, contentList} = this.state;
      if (
        !validator.isInt(count) ||
        parseInt(count) > 9999 ||
        parseInt(count) < 1
      ) {
        alert('Count is not a valid integer');
        return;
      }
      let updatedContentList = [...contentList];
      if (contentList.length < parseInt(count)) {
        for (let i = 0; i < parseInt(count) - contentList.length; i++) {
          console.log('<');
          updatedContentList.push({id: uuidv4(), content: ''});
        }
      } else if (contentList.length > parseInt(count)) {
        console.log('>');
        for (let i = 0; i < contentList.length - parseInt(count); i++) {
          updatedContentList.pop();
        }
      }

      this.setState({contentList: updatedContentList});

      console.log(updatedContentList);

      // this.props.navigation.navigate()
    }
  };

  render() {
    const {
      loading,
      name,
      content,
      count,
      chance,
      hide,
      modalVisible,
      separateContent,
      listNum,
      contentList,
    } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} bounces={false}>
          <StatusBar barStyle={'dark-content'} />
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />
          <Input
            type={'chance'}
            value={chance.toString()}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />
          <Input
            type={'listNum'}
            value={listNum.toString()}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />
          <Input
            type={'count'}
            value={count.toString()}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />
          <Input
            type={'separateContent'}
            value={separateContent}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />

          {separateContent ? (
            <Input
              type={'contentList'}
              value={contentList}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
            />
          ) : (
            <Input
              type={'content'}
              value={content}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
            />
          )}
          <Input
            type={'hide'}
            value={hide}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />
          <ActivityIndicator animating={loading} color={'grey'} />
          <RewardModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onInputChange={this.onInputChange}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // justifyContent: 'flex-start',
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
