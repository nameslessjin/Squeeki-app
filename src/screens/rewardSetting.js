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
  getSystemRewardListSetting,
} from '../actions/reward';
import RewardModal from '../components/reward/rewardModal';
import validator from 'validator';
import InputImage from '../components/postSetting/inputImage';
import {getTheme} from '../utils/theme';

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
    contentList: [{id: '1', content: ''}],
    image: null,
    redeemable: false,
    pointCost: '100',
    expiration: Date.now(),
    hasExpiration: true,
    giftTo: null,
    isGift: false,
    systemRewardSetting: null,
    prevRoute: 'RewardList',
    ...this.props.route.params,
    origin: this.props.route.params,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation, route} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitle: 'Cancel',
      headerRight: () => (
        <TopRightButton
          type={'done'}
          onPress={this.onAddReward}
          disabled={true}
          theme={theme}
        />
      ),
      headerTitle: 'Settings',
      headerStyle: theme.backgroundColor,
      headerTintColor: theme.textColor.color,
    });

    if (route.params) {
      if (route.params.pointCost == null) {
        this.setState({
          pointCost: '0',
          origin: {...this.props.route.params, pointCost: '0'},
        });
      }
    }
    this.getSystemRewardListSetting();
  }

  getSystemRewardListSetting = async () => {
    const req = await this.props.getSystemRewardListSetting();
    if (req.errors) {
      console.log(req.errors);
      alert(
        'Cannot get system reward list setting at this time, please try again later',
      );
      return;
    }
    this.setState({systemRewardSetting: req});
  };

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
      isGift,
      giftTo,
      systemRewardSetting,
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
      // min pointCost is 100 max is 999999
      if (parseInt(pointCost) < 100 || parseInt(pointCost) > 999999) {
        return false;
      }
    } else {
      // if reward is a gift then the id is between 4 to 6 else 1 to 3
      if (isGift) {
        if (parseInt(listId) > 6 || parseInt(listId) < 4) {
          return false;
        }

        // check systemRewardSetting
        if (!systemRewardSetting) {
          return false;
        }

        //check giftTo
        if (!giftTo) {
          return false;
        }
      } else {
        if (parseInt(listId) > 3 || parseInt(listId) < 1) {
          return false;
        }
      }

      // chance should be between 1 and 3
      if (parseInt(chance) < 1 || parseInt(chance) > 5) {
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

  randomIdGenerator = () => {
    const options =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSwXYZ1234567890-';
    let id = '';

    for (let i = 0; i < 10; i++) {
      const random = Math.floor(Math.random() * options.length);
      id = id + options[random];
    }

    return id;
  };

  componentDidUpdate(prevProps, prevState) {
    const {navigation, route} = this.props;
    const {count, contentList, loading, theme} = this.state;

    if (prevProps.route.params != route.params) {
      if (route.params) {
        if (route.params.giftTo) {
          this.setState({giftTo: route.params.giftTo});
        }
      }
    }

    // if state is updated, check if all inputs are valid
    if (prevState != this.state) {
      const disabled = !this.validation();
      navigation.setOptions({
        headerRight: () => (
          <TopRightButton
            type={'done'}
            onPress={this.createUpdateGroupReward}
            disabled={disabled || loading}
            theme={theme}
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
              updatedContentList.push({
                id: this.randomIdGenerator(),
                content: '',
              });
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
    const {prevRoute} = this.state;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      isGift: prevRoute == 'GiftedRewardList',
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
      image,
      id,
      pointCost,
      expiration,
      giftTo,
      isGift,
      prevRoute,
    } = this.state;
    const {
      auth,
      group,
      createUpdateGroupReward,
      navigation,
      reward,
    } = this.props;

    // if group is created for current group
    if (!isGift) {
      // if the number of rewards in a list/chance reach limit, return
      if (!this.checkRewardCountLimit()) {
        return;
      }
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
      toId: giftTo ? giftTo.id : group.group.id,
      image,
      pointCost: pointCost == '0' ? null : pointCost,
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
      } else if (
        req.errors[0].message ==
        'Each group can only gifts up to 2 rewards to other groups'
      ) {
        alert('Each group can only gifts up to 2 rewards to other groups');
      } else {
        alert('Cannot add reward at this time, please try again later');
      }
      return;
    }
    navigation.navigate(
      prevRoute == 'GiftedRewardList' ? 'GiftedRewardList' : 'RewardList',
    );
  };

  onInputChange = (value, type) => {
    const {expiration, origin, systemRewardSetting} = this.state;
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
      const lineCount = value.split(/\r\n|\r|\n/).length;
      const valueSplit = value.substr(0, 255).split('\n');
      if (lineCount >= 15) {
        this.setState({description: valueSplit.slice(0, 15).join('\n')});
        return;
      }

      this.setState({description: value.substr(0, 255)});
    } else if (type == 'chance') {
      this.setState({chance: value.id, chanceDisplay: value.label});
    } else if (type == 'count') {
      this.setState({count: value.trim()});
    } else if (type == 'listId') {
      let rewardList = [];
      let rewardChance1 = '1';
      if (parseInt(value.id) <= 3) {
        rewardList = this.props.reward.rewardList.filter(r => r.id == value.id);
        rewardChance1 = rewardList[0].chance1;
      } else {
        rewardChance1 = systemRewardSetting.chance.filter(
          c => c.listId == value.id,
        )[0].label;
      }
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
          pointCost: '100',
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
          hasExpiration: prevState.isGift ? true : !prevState.hasExpiration,
          expiration: prevState.isGift
            ? prevState.expiration
            : prevState.hasExpiration
            ? null
            : origin
            ? origin.expiration
              ? origin.expiration
              : Date.now()
            : Date.now(),
        };
      });
    } else if (type == 'isGift') {
      // if reward is a gift reward, it must have expiration date
      // switch to preset values
      this.setState(prevState => {
        return {
          isGift: !prevState.isGift,
          giftTo: null,
          redeemable: false,
          pointCost: '0',
          listId: prevState.isGift ? '1' : '4',
          listName: prevState.isGift
            ? this.props.reward.rewardList[0].listName
            : systemRewardSetting
            ? systemRewardSetting.list[0].label
            : 'List Not Found, please reload reward page',
          chance: '1',
          chanceDisplay: prevState.isGift
            ? this.props.reward.rewardList[0].chance1
            : systemRewardSetting
            ? systemRewardSetting.chance.filter(c => c.listId == '4')[0].label
            : 'Chance Not Found, please reload reward page',
          // hasExpiration: !prevState.isGift ? true : false,
          // expiration: !prevState.isGift ? Date.now() : null,
          hasExpiration: true,
          expiration: Date.now(),
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
    const {id, prevRoute} = this.state;
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
    navigation.navigate(
      prevRoute == 'GiftedRewardList' ? 'GiftedRewardList' : 'RewardList',
    );
  };

  onPress = type => {
    const {navigation} = this.props;
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
    } else if (type == 'giftTo' && !this.state.id) {
      navigation.navigate('Search', {prevRoute: 'rewardSetting'});
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
      giftTo,
      isGift,
      systemRewardSetting,
      theme,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={[styles.container, theme.backgroundColor]}
          bounces={false}>
          <StatusBar barStyle={'dark-content'} />
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
            theme={theme}
          />

          <Input
            type={'description'}
            value={description}
            onInputChange={this.onInputChange}
            theme={theme}
          />

          {!id && !redeemable ? (
            <Input
              type={'isGift'}
              value={isGift}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {!id && !isGift ? (
            <Input
              type={'redeemable'}
              value={redeemable}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {isGift ? (
            <Input
              type={'giftTo'}
              value={giftTo}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
              disabled={id}
              theme={theme}
            />
          ) : null}

          <Input
            type={'listId'}
            value={listName}
            onInputChange={this.onInputChange}
            onPress={this.onPress}
            theme={theme}
          />

          {redeemable ? (
            <Input
              type={'pointCost'}
              value={pointCost}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
              theme={theme}
            />
          ) : (
            <Input
              type={'chance'}
              value={chanceDisplay}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
              theme={theme}
            />
          )}

          {!id ? (
            <Input
              type={'count'}
              value={count.toString()}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}

          {/* <Input
            type={'hasExpiration'}
            value={hasExpiration}
            onInputChange={this.onInputChange}
            disabled={false}
          /> */}

          {hasExpiration ? (
            <Input
              type={'expiration'}
              value={expiration}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
              theme={theme}
            />
          ) : null}

          {!id ? (
            <Input
              type={'separateContent'}
              value={separateContent}
              onInputChange={this.onInputChange}
              disabled={false}
              theme={theme}
            />
          ) : null}

          {separateContent && !id ? (
            <Input
              type={'contentList'}
              value={contentList}
              onInputChange={this.onInputChange}
              onPress={this.onPress}
              theme={theme}
            />
          ) : null}
          <InputImage
            image={image}
            contentKeyboard={false}
            onPress={() => this.onPress('image')}
            disabled={false}
            theme={theme}
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
          {modalVisible ? (
            <RewardModal
              modalVisible={modalVisible}
              onBackdropPress={this.onBackdropPress}
              onInputChange={this.onInputChange}
              modalType={modalType}
              rewardList={this.props.reward.rewardList}
              listId={listId}
              expiration={expiration}
              redeemable={redeemable}
              isGift={isGift}
              systemRewardSetting={systemRewardSetting}
              theme={theme}
            />
          ) : null}
          <View style={styles.empty} />
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
  empty: {
    width: '100%',
    height: 200,
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
    getSystemRewardListSetting: () => dispatch(getSystemRewardListSetting()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardSetting);
