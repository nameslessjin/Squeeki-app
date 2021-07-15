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
import {createGroupReward, getGroupRewardList} from '../actions/reward';
import RewardModal from '../components/reward/rewardModal';
import validator from 'validator';
import {v4 as uuidv4} from 'uuid';

class RewardSetting extends React.Component {
  state = {
    loading: false,
    name: '',
    content: '',
    chance: '1',
    chanceDisplay: `${this.props.reward.rewardList[0].chance1}%`,
    modalVisible: false,
    count: '1',
    separateContent: false,
    listNum: '1',
    listName: this.props.reward.rewardList[0].listName,
    modalType: 'listNum',
    contentList: [],
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitle: 'Cancel',
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
    let {
      name,
      content,
      chance,
      count,
      listNum,
      separateContent,
      contentList,
    } = this.state;

    if (name.trim().length == 0 || name.length > 30) {
      return false;
    }

    // if chance is not a float or either count and list No is not int, return false
    if (
      !validator.isInt(chance) ||
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
    if (parseInt(count) < 1 || parseInt(count) > 999) {
      return false;
    }

    // chance should be between 1 and 5
    if (parseInt(chance) < 1 || parseInt(chance) > 5) {
      return false;
    }

    // check for content list and content
    if (separateContent) {
      let empty = false;
      if (contentList.length != count) {
        return false;
      }

      contentList.forEach(c => {
        if (c.content.trim().length == 0) {
          empty = true;
        }
      });

      if (empty) {
        return false;
      }
    } else {
      if (content.trim().length < 1 || content.length > 255) {
        return false;
      }
    }

    return true;
  };

  componentDidUpdate(prevProps, prevState) {
    const {navigation} = this.props;
    if (prevState != this.state) {
      const disabled = !this.validation();
      navigation.setOptions({
        headerRight: () => (
          <TopRightButton
            type={'done'}
            onPress={this.createGroupReward}
            disabled={disabled || this.state.loading}
          />
        ),
      });

      // check count and contentList and separateContent
      const {count, contentList, separateContent} = this.state;
      if (prevState.count != count) {
        if (parseInt(count) == 1) {
          setTimeout(() => {
            if (this.state.count == 1) {
              this.setState({separateContent: false});
            }
          }, 500);
        }

        if (
          !validator.isInt(count) ||
          parseInt(count) > 999 ||
          parseInt(count) <= 1
        ) {
          return;
        } else {
          let updatedContentList = [...contentList];
          if (contentList.length < parseInt(count)) {
            for (let i = 0; i < parseInt(count) - contentList.length; i++) {
              updatedContentList.push({id: uuidv4(), content: ''});
            }
          } else if (contentList.length > parseInt(count)) {
            for (let i = 0; i < contentList.length - parseInt(count); i++) {
              updatedContentList.pop();
            }
          }

          if (contentList != updatedContentList) {
            this.setState({contentList: updatedContentList});
          }
        }
      }
    }

    if (prevProps != this.props) {
      if (this.props.route.params) {
        if (this.props.route.params.contentList) {
          this.setState({contentList: this.props.route.params.contentList});
        }
      }
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

  createGroupReward = async () => {
    const {
      name,
      chance,
      listNum,
      count,
      content,
      contentList,
      separateContent,
      from,
      to,
      toId,
    } = this.state;
    const {auth, group, createGroupReward, navigation} = this.props;

    const request = {
      token: auth.token,
      name,
      chance,
      listNum,
      count,
      content,
      contentList,
      separateContent,
      fromId: group.group.id,
      from: 'group',
      to: 'group',
      toId: group.group.id,
    };

    this.setState({loading: true});
    const req = await createGroupReward(request);
    this.setState({loading: false});

    if (req.errors) {
      console.log(req.errors);
      alert('Cannot add reward at this time, please try again later');
      return;
    }
    navigation.navigate('Reward');
  };

  onInputChange = (type, value) => {
    if (type == 'name') {
      this.setState({name: value.substr(0, 30)});
    } else if (type == 'content') {
      this.setState({content: value});
    } else if (type == 'chance') {
      this.setState({chance: value.id, chanceDisplay: value.label});
    } else if (type == 'count') {
      this.setState({count: value.trim()});
    } else if (type == 'listNum') {
      this.setState({listNum: value.id, listName: value.label});
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
      this.setState({modalVisible: true, modalType: 'listNum'});
    } else if (type == 'chance') {
      this.setState({modalVisible: true, modalType: 'chance'});
    } else if (type == 'contentList') {
      this.props.navigation.navigate('RewardContentList', {
        contentList: this.state.contentList,
      });
    }
  };

  render() {
    const {
      loading,
      name,
      content,
      count,
      modalVisible,
      separateContent,
      contentList,
      modalType,
      listName,
      listNum,
      chanceDisplay,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} bounces={false}>
          <StatusBar barStyle={'dark-content'} />
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'listNum'}
            value={listName}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />
          <Input
            type={'chance'}
            value={chanceDisplay}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />
          <Input
            type={'count'}
            value={count.toString()}
            onInputChange={this.onInputChange}
          />

          {count > 1 || separateContent ? (
            <Input
              type={'separateContent'}
              value={separateContent}
              onInputChange={this.onInputChange}
            />
          ) : null}

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
            />
          )}
          <ActivityIndicator animating={loading} color={'grey'} />
          <RewardModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onInputChange={this.onInputChange}
            modalType={modalType}
            rewardList={this.props.reward.rewardList}
            listNum={listNum}
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
  const {auth, group, reward} = state;
  return {auth, group, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    createGroupReward: data => dispatch(createGroupReward(data)),
    getGroupRewardList: data => dispatch(getGroupRewardList(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardSetting);
