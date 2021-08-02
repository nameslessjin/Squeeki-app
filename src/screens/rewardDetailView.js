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

class RewardDetailView extends React.Component {
  state = {
    id: null,
    description: '',
    image: null,
    count: 0,
    createdAt: null,
    pointCost: null,
    chance: '1',
    prevRoute: 'history',
    isPrivate: false,
    ...this.props.route.params,
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {prevRoute} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Details',
    });
    if (prevRoute == 'reward') {
      this.getRewardEntry();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {from, to, toId, fromId, prevRoute} = this.state;
    const {group, navigation} = this.props;
    if (this.state != prevState) {
      const inGroup =
        from == to &&
        from == 'group' &&
        toId == fromId &&
        fromId == group.group.id;
      const hasRewardManagementAuthority =
        group.group.auth.rank <=
          group.group.rank_setting.manage_reward_rank_required && inGroup;
      navigation.setOptions({
        headerRight: () =>
          hasRewardManagementAuthority && prevRoute == 'reward' ? (
            <TopRightButton
              type={'edit'}
              onPress={this.onPress}
              disabled={false}
            />
          ) : null,
      });
    }
  }

  onPress = () => {
    const {
      name,
      description,
      chance,
      chanceDisplay,
      count,
      separateContent,
      listId,
      image,
      id,
      pointCost,
      expiration,
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
      expiration,
      hasExpiration: expiration != null,
    };

    console.log(new Date(parseInt(expiration)));

    navigation.navigate('RewardSetting', {
      ...entry,
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

  render() {
    const {
      di,
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
      isPrivate,
      content,
      fromId,
      groupDisplayName,
    } = this.state;
    const {group} = this.props.group;

    return (
      <TouchableWithoutFeedback>
        <ScrollView style={styles.container}>
          <InputImage image={image} contentKeyboard={false} disabled={true} />
          <View style={[styles.infoContaier]}>
            <View style={styles.infoSubContainer}>
              <Text style={{fontWeight: '500', fontSize: 17}}>{name}</Text>
            </View>
          </View>
          <InputContent content={description} disabled={true} />
          <View style={styles.infoContaier}>
            <View style={styles.infoSubContainer}>
              {prevRoute == 'reward' ? <Text>{count} remaining</Text> : null}
              {isPrivate && content ? (
                <Text>{`Hidden Content: ${content}`}</Text>
              ) : null}
              <Text style={styles.text}>
                {pointCost
                  ? `Point Cost: ${pointCost} pts`
                  : `Chance To Win: ${chanceDisplay}%`}
              </Text>
              {expiration ? (
                <Text style={styles.text}>
                  Listing Expiration:{' '}
                  {dateConversion(expiration, 'expirationDisplay')}
                </Text>
              ) : null}
              {fromId == group.id ? (
                <Text style={styles.text}>Group: {groupDisplayName}</Text>
              ) : (
                <View style={[styles.text, {flexDirection: 'row'}]}>
                  <Text>Group: </Text>
                  <TouchableOpacity>
                    <View style={styles.groupNameTag}>
                      <Text style={{color: 'white'}}>{groupDisplayName}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {isPrivate && prevRoute == 'history' ? (
                <Text
                  style={[
                    styles.text,
                    {
                      color: status == 'default' ? 'black' : 'grey',
                    },
                  ]}>
                  {status == 'default' ? 'Available' : 'Used'}
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
  },
});

const mapStateToProps = state => {
  const {auth, group, reward} = state;
  return {auth, group, reward};
};

const mapDispatchToProps = dispatch => {
  return {
    getRewardEntry: data => dispatch(getRewardEntry(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardDetailView);
