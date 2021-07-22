import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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
    point: '0',
    ...this.props.route.params,
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Details',
    });
    this.getRewardEntry();
  }

  componentDidUpdate(prevProps, prevState) {
    const {from, to, toId, fromId} = this.state;
    const {group, navigation} = this.props;
    if (this.state != prevState) {
      const inGroup =
        from == to &&
        from == 'group' &&
        toId == fromId &&
        fromId == group.group.id;
      navigation.setOptions({
        headerRight: () =>
          inGroup ? (
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
      point,
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
      point,
      redeemable: point == '0' ? false : true,
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
      description,
      image,
      count,
      createdAt,
      name,
      chanceDisplay,
      point,
      expiration,
    } = this.state;

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
              <Text>{count} remaining</Text>
              <Text style={{marginTop: 10}}>
                {point == '0' ? `Chance: ${chanceDisplay}%` : `${point} pts`}
              </Text>
              {expiration ? (
                <Text style={{marginTop: 10}}>
                  {dateConversion(expiration, 'expirationDisplay')}
                </Text>
              ) : null}
            </View>
          </View>
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
