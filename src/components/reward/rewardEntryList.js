import React from 'react';
import {
  SectionList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {dateConversion} from '../../utils/time';
import {connect} from 'react-redux';
import {getSingleGroupById} from '../../actions/group';

const {width, height} = Dimensions.get('window');

const extractKey = ({id}) => id;

class RewardEntryList extends React.Component {
  state = {
    redeemItemId: null,
  };

  getGroup = async reward => {
    const {from, fromId} = reward;
    const {auth, getSingleGroupById, navigation, group} = this.props;

    if (from == 'group' && fromId) {
      const request = {
        id: fromId,
        token: auth.token,
      };

      const req = await getSingleGroupById(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Cannot load group at this time, please try again later');
        return;
      }

      navigation.push('GroupNavigator', {
        prevRoute: 'RewardList',
        groupId: group.group.id
      })
    }
  };

  onRedeemPress = item => {
    const {onLootRedeemPress} = this.props;
    const {id, expiration} = item;
    const expired = expiration
      ? dateConversion(expiration, 'expirationDisplay') == 'Expired'
      : false;

    if (expired) {
      alert('This reward listing is expired, please choose another reward');
      return;
    }

    onLootRedeemPress('redeem', item);
    this.setState({redeemItemId: id});
    this.setState({redeemItemId: null});
  };

  renderItem = ({item, index, section}) => {
    const {
      name,
      count,
      pointCost,
      expiration,
      id,
      fromId,
      groupDisplayName,
    } = item;
    const {onPress, type} = this.props;
    const {redeemItemId} = this.state;
    const expired = expiration
      ? dateConversion(expiration, 'expirationDisplay') == 'Expired'
      : false;

    return (
      <View style={styles.card}>
        <View
          style={[
            styles.cardInfo,
            {width: type == 'redeem' ? width * 0.9 - 95 : width * 0.9 - 90},
          ]}>
          <Text style={styles.name}>{name}</Text>
          {groupDisplayName ? (
            <View
              style={[
                styles.text,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <Text>From: </Text>
              <TouchableOpacity onPress={() => this.getGroup(item)}>
                <View style={styles.groupNameTag}>
                  <Text style={{color: 'white'}}>{groupDisplayName}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          {type == 'redeem' ? (
            <Text style={styles.infoText}>{pointCost} pts</Text>
          ) : null}
          <Text style={styles.infoText}>{count} Remaining</Text>
          {expiration ? (
            <Text style={styles.infoText}>
              {dateConversion(expiration, 'expirationDisplay')}
            </Text>
          ) : null}
        </View>
        <View style={styles.buttonContainer}>
          {type == 'redeem' ? (
            <TouchableOpacity
              onPress={() => this.onRedeemPress(item)}
              disabled={redeemItemId == id || expired}>
              <View
                style={[
                  styles.redeemButton,
                  {
                    backgroundColor:
                      redeemItemId == id || expired ? 'grey' : '#EA2027',
                  },
                ]}>
                {redeemItemId == id ? (
                  <ActivityIndicator animating={true} color={'white'} />
                ) : (
                  <Text style={{color: 'white'}}>Redeem</Text>
                )}
              </View>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => onPress(item, 'detail')}>
            {type == 'redeem' ? (
              <Text style={{color: 'grey'}}>View</Text>
            ) : (
              <View style={styles.viewButton}>
                <Text style={{color: 'white'}}>View</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderSectionHeader = ({section}) => {
    const {title, data, index, id, chance} = section;

    if (data.length != 0) {
      return (
        <View style={styles.title}>
          <Text style={styles.titleText}>{`${title}`}</Text>
          <Text style={styles.chance}>{`(${chance}%)`}</Text>
        </View>
      );
    }
  };

  render() {
    const {rewardEntryList, type} = this.props;

    return type == 'loot' ? (
      <SectionList
        sections={rewardEntryList.map((r, index) => ({...r, index}))}
        keyExtractor={extractKey}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={this.renderSectionHeader}
        style={{width: '100%', height: '100%'}}
        stickySectionHeadersEnabled={false}
      />
    ) : (
      <FlatList
        keyExtractor={extractKey}
        renderItem={this.renderItem}
        data={rewardEntryList}
        showsVerticalScrollIndicator={false}
        style={{width: '100%', height: '100%', marginTop: 20}}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    justifyContent: 'center',
    width: '100%',
    minHeight: 45,
    maxHeight: 80,
    alignItems: 'center',
    marginVertical: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    maxHeight: 110,
    minHeight: 70,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // backgroundColor: 'yellow',
  },
  cardInfo: {
    height: '100%',
    width: width * 0.9 - 100,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'silver',
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 13,
  },
  chance: {
    fontSize: 13,
    fontWeight: 'normal',
    color: 'grey',
  },
  viewButton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'silver',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redeemButton: {
    width: 65,
    height: 35,
    borderRadius: 15,
    backgroundColor: '#EA2027',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonContainer: {
    height: '100%',
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupNameTag: {
    backgroundColor: '#1e90ff',
    borderRadius: 7,
    padding: 2,
    paddingHorizontal: 5,
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RewardEntryList);
