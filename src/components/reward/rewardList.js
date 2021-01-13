import React from 'react';
import {
  StyleSheet,
  SectionList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {extractReward} from '../../functions/reward';
import RewardCard from './rewardCard';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const extractKey = ({id}) => id;

export default class RewardList extends React.Component {
  state = {
    option: 'unredeemed',
  };

  onOptionPress = () => {
    const {option} = this.state;
    const {loadGroupReward} = this.props;
    if (option == 'unredeemed') {
      this.setState({option: 'redeemed'});
      loadGroupReward(true, true);
    } else {
      this.setState({option: 'unredeemed'});
      loadGroupReward(true, false);
    }
  };

  optionButton = () => {
    const {option} = this.state;
    const is_redeemed = option == 'redeemed';
    return (
      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderBottomWidth: !is_redeemed ? StyleSheet.hairlineWidth : 0,
              borderBottomColor: !is_redeemed ? '#EA2027' : null,
            },
          ]}
          onPress={this.onOptionPress}
          disabled={!is_redeemed}>
          <Text
            style={{
              fontWeight: '600',
              color: !is_redeemed ? '#EA2027' : 'grey',
            }}>
            Unredeemed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderBottomWidth: is_redeemed ? StyleSheet.hairlineWidth : 0,
              borderBottomColor: is_redeemed ? '#EA2027' : null,
            },
          ]}
          onPress={this.onOptionPress}
          disabled={is_redeemed}>
          <Text
            style={{
              fontWeight: '600',
              color: is_redeemed ? '#EA2027' : 'grey',
            }}>
            Redeemed
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderSectionHeader = ({section}) => {
    const {id, title} = section;
    const {onQuestionMarkPress} = this.props
    if (id == '0') {
      return this.optionButton();
    } else if (id == '-1') {
      return (
        <View
          style={styles.reward_chance}>
          <Text>Reward Chance:</Text>
          <TouchableOpacity onPress={onQuestionMarkPress}>
            <View
              style={styles.question_mark}>
              <MaterialIcons name={'help'} size={15} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    let color = '#b9f2ff';
    switch (title) {
      case 'Diamond':
        color = '#b9f2ff';
        break;
      case 'Sapphire':
        color = '#0f52ba';
        break;
      case 'Emerald':
        color = '#50C878';
        break;
      case 'Gold':
        color = '#d4af37';
        break;
      case 'Silver':
        color = '#C0C0C0';
        break;
      case 'Bronze':
        color = '#cd7f32';
        break;
      default:
        color = '#b9f2ff';
        break;
    }

    return <Text style={[styles.title, {color: color}]}>{title}</Text>;
  };

  renderItem = i => {
    const {auth, onDeleteReward, route} = this.props;
    const {id} = i.item;

    if (id == '0') {
      return this.optionButton();
    }

    return (
      <RewardCard
        item={i.item}
        auth={auth}
        onDeleteReward={onDeleteReward}
        route={route}
      />
    );
  };

  flatList = list => {
    const {onEndReached} = this.props;
    return (
      <FlatList
        style={styles.container}
        keyExtractKey={extractKey}
        data={list}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        onEndReached={() => onEndReached(true)}
        onEndReachedThreshold={0.1}
      />
    );
  };

  render() {
    const {rewards, onEndReached, route, redeemed_gift_card_count} = this.props;
    const {option} = this.state;
    const redeemed = option == 'redeemed';
    let sections = extractReward(rewards, redeemed_gift_card_count);
    const options = {
      title: 'options',
      id: '0',
      data: [],
    };

    const reward_chance = {
      title: 'chance',
      id: '-1',
      data: [],
    };

    let list = [options];
    if (redeemed) {
      list = list.concat(rewards);
    } else {
      list = list.concat(sections);
      list = list.concat(reward_chance);
    }

    let return_list = redeemed ? (
      this.flatList(list)
    ) : (
      <SectionList
        style={styles.container}
        keyExtractKey={extractKey}
        sections={list}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        stickySectionHeadersEnabled={false}
        onEndReached={() => onEndReached(false)}
        onEndReachedThreshold={0.1}
      />
    );
    if (route == 'history') {
      list = rewards;
      return_list = this.flatList(list);
    }

    return return_list;
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 5,
  },
  button: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    height: 40,
    marginHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  question_mark: {
    width: 18,
    height: 18,
    backgroundColor: 'grey',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  reward_chance: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
  }
});
