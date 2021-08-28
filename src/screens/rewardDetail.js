import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {getRewardEntry} from '../actions/reward';
import InputImage from '../components/postSetting/inputImage';
import InputContent from '../components/postSetting/inputContent';
import TopRightButton from '../components/reward/topRightButton';
import {dateConversion} from '../utils/time';
import {getSingleGroupById} from '../actions/group';
import {getTheme} from '../utils/theme';

class RewardDetail extends React.Component {
  state = {
    id: null,
    description: '',
    image: null,
    count: 0,
    createdAt: null,
    pointCost: null,
    chance: '1',
    prevRoute: 'RewardHistory',
    groupId: this.props.group.group.id,
    directToGroup: false,
    ...this.props.route.params,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {prevRoute, theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Details',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
    if (prevRoute == 'RewardList' || prevRoute == 'GiftedRewardList') {
      this.getRewardEntry();
    }
  }

  componentWillUnmount() {
    const {groupId, directToGroup, prevRoute} = this.state;
    const {navigation} = this.props;
    // if direct from home reward page to detail page then to a group, reload reward when coming back
    if (directToGroup) {
      if (
        prevRoute == 'RewardHistory' ||
        prevRoute == 'MyGroupRewards' ||
        prevRoute == 'MyRewards'
      ) {
        // MyRewads have no previous group page
        // if has previous group page thus reload group and reward
        navigation.navigate(prevRoute, {
          refresh: true,
        });
      }
    }

    // always refresh if coming from a reward list
    if (prevRoute == 'RewardList' || prevRoute == 'GiftedRewardList') {
      navigation.navigate(prevRoute, {
        refresh: true,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {from, to, toId, fromId, prevRoute, theme} = this.state;
    const {group, navigation} = this.props;

    const inGroup = from == to && from == 'group' && fromId == group.group.id;
    const hasRewardManagementAuthority = group.group.auth
      ? group.group.auth.rank <=
          group.group.rank_setting.manage_reward_rank_required && inGroup
      : false;
    navigation.setOptions({
      headerRight: () =>
        hasRewardManagementAuthority &&
        (prevRoute == 'RewardList' || prevRoute == 'GiftedRewardList') ? (
          <TopRightButton
            type={'edit'}
            onPress={this.onPress}
            disabled={false}
            theme={theme}
          />
        ) : null,
    });
  }

  onPress = () => {
    const {
      name,
      description,
      chance,
      chanceDisplay,
      listId,
      image,
      id,
      pointCost,
      expiration,
      to,
      from,
      toId,
      fromId,
      prevRoute,
      giftedGroupDisplayName,
      giftedGroupName,
    } = this.state;
    const {navigation, reward} = this.props;

    const entry = {
      id,
      name,
      description,
      chance,
      listId,
      chanceDisplay,
      image,
      pointCost,
      redeemable: pointCost ? true : false,
      listName: reward.rewardList.filter(l => l.id == listId)[0].listName,
      isGift: parseInt(listId) > 3,
      expiration,
      hasExpiration: expiration != null,
      giftTo:
        parseInt(listId) <= 3
          ? null
          : giftedGroupDisplayName
          ? {
              id: toId,
              display_name: giftedGroupDisplayName,
              groupname: giftedGroupName,
            }
          : null,
    };

    navigation.navigate('RewardSetting', {
      ...entry,
      prevRoute,
    });
  };

  getRewardEntry = async () => {
    const {id} = this.state;
    const {getRewardEntry, auth} = this.props;

    const request = {entryId: id, token: auth.token};

    const req = await getRewardEntry(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Get reward details error, please try again later');
      return;
    }

    this.setState({...req, image: req.image ? {uri: req.image} : null});
  };

  getGroup = async () => {
    const {
      fromId,
      from,
      groupId,
      to,
      toId,
      giftedGroupDisplayName,
      id,
      prevRoute,
    } = this.state;
    const {auth, getSingleGroupById, navigation} = this.props;

    if ((from == 'group' && fromId) || (to == 'group' && toId)) {
      const request = {
        id: giftedGroupDisplayName ? toId : fromId,
        token: auth.token,
      };

      const req = await getSingleGroupById(request);
      this.setState({directToGroup: true});
      if (req.errors) {
        console.log(req.errors);
        alert('Cannot load group at this time, please try again later');
        return;
      }

      // log the redirection event on certain route
      // route: RewardHistory, MyGroupRewards, MyRewards, RewardList
      let log = null;
      if (
        prevRoute == 'RewardHistory' ||
        prevRoute == 'MyGroupRewards' ||
        prevRoute == 'MyRewards' ||
        prevRoute == 'RewardList'
      ) {
        log = {
          effectId: fromId,
          effectIdType: 'group',
          causeId: id,
          causeIdType: prevRoute == 'RewardList' ? 'rewardEntry' : 'reward',
          event:
            prevRoute == 'RewardList'
              ? 'redirection_rewardEntry_to_group'
              : 'redirection_reward_to_group',
        };
      }

      // redirect to group
      navigation.push('GroupNavigator', {
        prevRoute: 'RewardDetail',
        groupId,
        log,
      });
    }
  };

  render() {
    const {
      id,
      description,
      image,
      count,
      createdAt,
      name,
      chanceDisplay,
      pointCost,
      expiration,
      prevRoute,
      status,
      content,
      fromId,
      groupDisplayName,
      redeemer,
      updatedAt,
      winner,
      toId,
      giftedGroupDisplayName,
      theme,
    } = this.state;
    const {group} = this.props.group;

    return (
        <TouchableWithoutFeedback>
          <ScrollView style={[styles.container, theme.backgroundColor]}>
            <InputImage image={image} contentKeyboard={false} disabled={true} />
            <View style={[styles.infoContaier]}>
              <View style={styles.infoSubContainer}>
                <Text
                  style={[{fontWeight: '500', fontSize: 17}, theme.textColor]}>
                  {name}
                </Text>
              </View>
            </View>

            <InputContent
              content={description}
              disabled={true}
              theme={theme}
              type={'reward'}
            />

            <View style={styles.infoContaier}>
              <View style={styles.infoSubContainer}>
                {prevRoute == 'RewardList' ||
                prevRoute == 'GiftedRewardList' ? (
                  <Text style={theme.textColor}>{count} remaining</Text>
                ) : null}
                {content &&
                (prevRoute == 'MyRewards' || prevRoute == 'MyGroupRewards') ? (
                  <Text
                    style={
                      theme.textColor
                    }>{`Hidden Content: ${content}`}</Text>
                ) : null}
                <Text style={[styles.text, theme.textColor]}>
                  {pointCost
                    ? `Point Cost: ${pointCost} pts`
                    : `Chance To Win: ${chanceDisplay}%`}
                </Text>
                {expiration ? (
                  <Text style={[styles.text, theme.textColor]}>
                    Listing Expiration:{' '}
                    {dateConversion(expiration, 'expirationDisplay')}
                  </Text>
                ) : null}
                {fromId == group.id || !groupDisplayName ? null : (
                  <View
                    style={[
                      styles.text,
                      {flexDirection: 'row', alignItems: 'center'},
                    ]}>
                    <Text style={theme.textColor}>From: </Text>
                    <TouchableOpacity onPress={this.getGroup}>
                      <View style={styles.groupNameTag}>
                        <Text style={{color: 'white'}}>{groupDisplayName}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                {toId == group.id || !giftedGroupDisplayName ? null : (
                  <View
                    style={[
                      styles.text,
                      {flexDirection: 'row', alignItems: 'center'},
                    ]}>
                    <Text style={theme.textColor}>To: </Text>
                    <TouchableOpacity onPress={this.getGroup}>
                      <View style={styles.groupNameTag}>
                        <Text style={{color: 'white'}}>
                          {giftedGroupDisplayName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {prevRoute == 'MyRewards' ||
                prevRoute == 'MyGroupRewards' ||
                prevRoute == 'RewardManagement' ? (
                  <Text style={[styles.text, theme.textColor]}>
                    Reward ID: {id}
                  </Text>
                ) : null}
                {winner &&
                (prevRoute == 'MyRewards' ||
                  prevRoute == 'MyGroupRewards' ||
                  prevRoute == 'RewardManagement') ? (
                  <Text style={[styles.text, {color: 'grey'}]}>{`Won by ${
                    winner.displayName
                  } ${
                    winner.username == winner.displayName
                      ? ''
                      : `(@${winner.username})`
                  }`}</Text>
                ) : null}
                {prevRoute == 'MyRewards' ||
                prevRoute == 'MyGroupRewards' ||
                prevRoute == 'RewardManagement' ? (
                  <Text
                    style={[
                      styles.text,
                      {
                        color:
                          status == 'default' ? theme.textColor.color : 'grey',
                      },
                    ]}>
                    {status == 'default'
                      ? 'Available'
                      : `Redeemed ${
                          redeemer
                            ? `by ${redeemer.displayName}${
                                redeemer.username == redeemer.displayName
                                  ? ''
                                  : `(@${redeemer.username})`
                              }`
                            : ''
                        }`}
                  </Text>
                ) : null}
                {redeemer &&
                status == 'redeemed' &&
                (prevRoute == 'MyRewards' ||
                  prevRoute == 'MyGroupRewards' ||
                  prevRoute == 'RewardManagement') ? (
                  <Text
                    style={[
                      styles.text,
                      {
                        color: 'grey',
                      },
                    ]}>
                    {`Redeemed at ${dateConversion(updatedAt, 'reward')}`}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={styles.empty} />
          </ScrollView>
        </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  infoContaier: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  infoSubContainer: {
    width: '90%',
    padding: 5,
  },
  empty: {
    width: '100%',
    height: 200,
  },
  groupNameTag: {
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 2,
    paddingHorizontal: 5,
  },
  text: {
    marginTop: 10,
    color: 'black',
  },
});

const mapStateToProps = state => {
  const {auth, group, reward} = state;
  return {auth, group, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    getRewardEntry: data => dispatch(getRewardEntry(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardDetail);
