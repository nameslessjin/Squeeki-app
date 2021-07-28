import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import TopRightButton from '../components/reward/topRightButton';
import Input from '../components/reward/settingInput';
import {
  createUpdateGroupReward,
  getGroupRewardList,
  updateRewardEntryStatus,
} from '../actions/reward';
import RewardModal from '../components/reward/rewardModal';
import validator from 'validator';
import {v4 as uuidv4} from 'uuid';
import InputImage from '../components/postSetting/inputImage';

class RewardSetting extends React.Component {
  state = {
    loading: false,
    id: null,
    name: '',
    description: '',
    chance: '1',
    chanceDisplay: `${this.props.reward.rewardList[0].chance1}`,
    modalVisible: false,
    count: '1',
    separateContent: false,
    listId: '1',
    listName: this.props.reward.rewardList[0].listName,
    modalType: 'listId',
    contentList: [{id: uuidv4(), content: ''}],
    image: null,
    redeemable: false,
    pointCost: '0',
    expiration: null,
    hasExpiration: false,
    ...this.props.route.params,
    origin: this.props.route.params,
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
    // need to check for update later
    let {
      name,
      description,
      chance,
      count,
      listId,
      separateContent,
      contentList,
      origin,
      image,
      id,
      pointCost,
      redeemable,
      expiration,
    } = this.state;

    if (name.trim().length == 0 || name.length > 30) {
      return false;
    }

    if (description.trim().length < 1 || description.length > 255) {
      return false;
    }

    // check expiration date
    if (expiration) {
      if (expiration <= Date.now()) {
        return false;
      }
    }

    // if chance is not a float or either count and list No is not int, return false
    if (
      !validator.isInt(chance) ||
      !validator.isInt(count) ||
      !validator.isInt(listId) ||
      !validator.isInt(pointCost)
    ) {
      return false;
    }

    if (redeemable) {
      if (parseInt(pointCost) < 1 || parseInt(pointCost) > 999999) {
        return false;
      }
    } else {
      if (parseInt(listId) > 3 || parseInt(listId) < 1) {
        return false;
      }

      // chance should be between 1 and 3
      if (parseInt(chance) < 1 || parseInt(chance) > 3) {
        return false;
      }
    }

    // count should be between 1 and 9999
    if (parseInt(count) < 1 || parseInt(count) > 999) {
      return false;
    }

    // check for content list and content
    if (!id) {
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
      }
    }

    // check again origin one if update existing one
    if (id) {
      if (
        origin.name == name &&
        origin.description == description &&
        origin.listId == listId &&
        origin.chance == chance &&
        origin.pointCost == pointCost &&
        origin.expiration == expiration
      ) {
        // if origin image exists
        if (origin.image) {
          if (origin.image.uri == image.uri) {
            return false;
          }
        } else {
          if (image == null) {
            return false;
          }
        }
      }
    }

    return true;
  };

  componentDidUpdate(prevProps, prevState) {
    const {navigation} = this.props;
    const {count, contentList} = this.state;
    if (prevState != this.state) {
      const disabled = !this.validation();
      navigation.setOptions({
        headerRight: () => (
          <TopRightButton
            type={'done'}
            onPress={this.createUpdateGroupReward}
            disabled={disabled || this.state.loading}
          />
        ),
      });

      // check count and contentList and separateContent
      if (prevState.count != count) {
        if (
          !validator.isInt(count) ||
          parseInt(count) > 999 ||
          parseInt(count) < 1
        ) {
          return;
        } else {
          let updatedContentList = [...contentList];
          if (contentList.length < parseInt(count)) {
            for (let i = 0; i < parseInt(count) - contentList.length; i++) {
              updatedContentList.push({id: uuidv4(), content: ''});
            }
          } else if (contentList.length > parseInt(count)) {
            // set timer, don't delete immediate
            setTimeout(() => {
              if (this.state.contentList.length > parseInt(this.state.count)) {
                for (let i = 0; i < contentList.length - parseInt(count); i++) {
                  updatedContentList.pop();
                }
              }
            }, 300);
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

  checkRewardCountLimit = () => {
    const {redeemable, id, listId, chanceDisplay} = this.state;
    const {reward} = this.props;

    let chosenRewardList = redeemable
      ? reward.rewardList.filter(r => r.id == '0')[0].redeemRewardEntryList
      : reward.rewardList
          .filter(r => r.id == listId)[0]
          .rewardEntryList.filter(l => l.chance == chanceDisplay)[0];

    // if updaing an exisiting one
    if (id) {
      chosenRewardList = redeemable ? chosenRewardList : chosenRewardList.data;
      if (chosenRewardList.filter(r => r.id == id).length > 0) {
        return true;
      }
    }

    if (redeemable && chosenRewardList.length >= 10) {
      alert('Each group can only have up to 10 redeemable rewards');
      return false;
    }

    if (!redeemable && chosenRewardList.length >= 3) {
      alert('Each group can only have up to 3 redeemable rewards');
      return false;
    }

    return true;
  };

  createUpdateGroupReward = async () => {
    const {
      name,
      chance,
      listId,
      count,
      description,
      contentList,
      separateContent,
      from,
      to,
      toId,
      image,
      id,
      pointCost,
      expiration,
    } = this.state;
    const {
      auth,
      group,
      createUpdateGroupReward,
      navigation,
      reward,
    } = this.props;

    // if the number of rewards in a list/chance reach limit, return
    if (!this.checkRewardCountLimit()) {
      return;
    }

    // check validation one last time
    if (!this.validation()) {
      alert(
        'Cannot create reward, please check your information then resubmit',
      );
      return;
    }

    const request = {
      token: auth.token,
      entryId: id,
      name,
      chance,
      listId,
      count,
      description,
      contentList,
      separateContent,
      fromId: group.group.id,
      from: 'group',
      to: 'group',
      toId: group.group.id,
      image,
      pointCost,
      expiration,
    };

    this.setState({loading: true});
    const req = await createUpdateGroupReward(request);
    this.setState({loading: false});

    if (req.errors) {
      console.log(req.errors);
      if (
        req.errors[0].message ==
        'Each chance in each list can only contain up to 3 rewards'
      ) {
        alert('Each chance in each list can only contain up to 3 rewards');
      } else if (
        req.errors[0].message ==
        'Each chance in each list can only contain up to 10 rewards'
      ) {
        alert('Redeem list can only contain up to 10 rewards');
      } else {
        alert('Cannot add reward at this time, please try again later');
      }
      return;
    }
    navigation.navigate('Reward');
  };

  onInputChange = (value, type) => {
    const {expiration, origin} = this.state;
    this.setState(prevState => {
      return {
        ...prevState,
        expiration: expiration
          ? expiration < Date.now()
            ? Date.now()
            : expiration
          : null,
      };
    });

    if (type == 'name') {
      this.setState({name: value.substr(0, 30)});
    } else if (type == 'description') {
      this.setState({description: value});
    } else if (type == 'chance') {
      this.setState({chance: value.id, chanceDisplay: value.label});
    } else if (type == 'count') {
      this.setState({count: value.trim()});
    } else if (type == 'listId') {
      const rewardList = this.props.reward.rewardList.filter(
        r => r.id == value.id,
      );
      const rewardChance1 = rewardList[0].chance1;
      this.setState({
        listId: value.id,
        listName: value.label,
        chanceDisplay: `${rewardChance1}`,
        chance: '1',
      });
    } else if (type == 'separateContent') {
      this.setState(prevState => {
        return {
          ...prevState,
          separateContent: !prevState.separateContent,
        };
      });
    } else if (type == 'image') {
      this.setState({
        modalVisible: false,
        image: {...value},
      });
    } else if (type == 'redeemable') {
      this.setState(prevState => {
        return {
          ...prevState,
          redeemable: !prevState.redeemable,
          pointCost: '0',
          chance: prevState.redeemable ? '1' : '0',
          chanceDisplay: prevState.redeemable
            ? `${this.props.reward.rewardList[0].chance1}`
            : 0,
          listId: prevState.redeemable ? '1' : '0',
          listName: prevState.redeemable
            ? this.props.reward.rewardList[0].listName
            : this.props.reward.rewardList[2].listName,
        };
      });
    } else if (type == 'pointCost') {
      this.setState({pointCost: value.trim()});
    } else if (type == 'expiration') {
      this.setState({expiration: value.getTime()});
    } else if (type == 'hasExpiration') {
      this.setState(prevState => {
        return {
          ...prevState,
          hasExpiration: !prevState.hasExpiration,
          expiration: prevState.hasExpiration
            ? null
            : origin
            ? origin.expiration
              ? origin.expiration
              : Date.now()
            : Date.now(),
        };
      });
    }
  };

  onBackdropPress = () => {
    Keyboard.dismiss();
    this.setState({modalVisible: false});
    const {expiration} = this.state;

    this.setState(prevState => {
      return {
        ...prevState,
        expiration: expiration
          ? expiration < Date.now()
            ? Date.now()
            : expiration
          : null,
      };
    });
  };

  updateRewardEntryStatus = async type => {
    const {auth, updateRewardEntryStatus, navigation} = this.props;
    const {id} = this.state;
    const request = {
      token: auth.token,
      entryId: id,
      status: type,
    };
    this.setState({loading: true});
    const req = await updateRewardEntryStatus(request);
    this.setState({loading: false});
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot delete reward at this time, please try again later');
      return;
    }
    navigation.navigate('Reward');
  };

  onPress = type => {
    if (type == 'listId') {
      const {redeemable} = this.state;
      if (!redeemable) {
        this.setState({modalVisible: true, modalType: 'listId'});
      }
    } else if (type == 'chance') {
      this.setState({modalVisible: true, modalType: 'chance'});
    } else if (type == 'contentList') {
      this.props.navigation.navigate('RewardContentList', {
        contentList: this.state.contentList,
      });
    } else if (type == 'image') {
      this.setState({modalVisible: true, modalType: 'image'});
    } else if (type == 'delete') {
      Alert.alert('Delete reward', null, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => this.updateRewardEntryStatus(type),
          style: 'destructive',
        },
      ]);
    } else if (type == 'expiration') {
      this.setState({modalVisible: true, modalType: 'expiration'});
    }
  };

  render() {
    const {
      loading,
      name,
      description,
      count,
      modalVisible,
      separateContent,
      contentList,
      modalType,
      listName,
      listId,
      chanceDisplay,
      image,
      id,
      redeemable,
      pointCost,
      expiration,
      hasExpiration,
    } = this.state;
    console.log(this.state);
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
            type={'description'}
            value={description}
            onInputChange={this.onInputChange}
          />

          {!id ? (
            <Input
              type={'redeemable'}
              value={redeemable}
              onInputChange={this.onInputChange}
            />
          ) : null}

          <Input
            type={'listId'}
            value={listName}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
          />

          {redeemable ? (
            <Input
              type={'pointCost'}
              value={pointCost}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
            />
          ) : (
            <Input
              type={'chance'}
              value={chanceDisplay}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
            />
          )}

          {!id ? (
            <Input
              type={'count'}
              value={count.toString()}
              onInputChange={this.onInputChange}
            />
          ) : null}

          <Input
            type={'hasExpiration'}
            value={hasExpiration}
            onInputChange={this.onInputChange}
          />

          {hasExpiration ? (
            <Input
              type={'expiration'}
              value={expiration}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
            />
          ) : null}

          {!id ? (
            <Input
              type={'separateContent'}
              value={separateContent}
              onInputChange={this.onInputChange}
            />
          ) : null}

          {separateContent && !id ? (
            <Input
              type={'contentList'}
              value={contentList}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
            />
          ) : null}
          <InputImage
            image={image}
            contentKeyboard={false}
            onPress={() => this.onPress('image')}
            disabled={false}
          />

          {id && !loading ? (
            <View style={styles.button}>
              <TouchableOpacity onPress={() => this.onPress('delete')}>
                <Text style={[styles.buttonText, {color: '#EA2027'}]}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <ActivityIndicator
            animating={loading}
            color={'grey'}
            style={{marginTop: 30}}
          />

          <RewardModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onInputChange={this.onInputChange}
            modalType={modalType}
            rewardList={this.props.reward.rewardList}
            listId={listId}
            expiration={expiration}
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
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    color: '#1e90ff',
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    marginTop: 15,
  },
});

const mapStateToProps = state => {
  const {auth, group, reward} = state;
  return {auth, group, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    createUpdateGroupReward: data => dispatch(createUpdateGroupReward(data)),
    getGroupRewardList: data => dispatch(getGroupRewardList(data)),
    updateRewardEntryStatus: data => dispatch(updateRewardEntryStatus(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardSetting);
