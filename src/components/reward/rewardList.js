import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from 'react-native';
import RewardListCard from './rewardListCard';

const extractKey = ({id}) => id;

export default class rewardList extends React.Component {
  renderItem = ({item}) => {
    const {navigation, group, onLootRedeemPress, prevRoute, theme} = this.props;
    return (
      <RewardListCard
        item={item}
        navigation={navigation}
        group={group}
        onLootRedeemPress={onLootRedeemPress}
        prevRoute={prevRoute}
        theme={theme}
      />
    );
  };

  LeftAction = () => {};

  rightAction = () => {};

  render() {
    const {rewardList, group} = this.props;
    const hasRewardManagementAuthority = group.auth
      ? group.auth.rank <= group.rank_setting.manage_reward_rank_required
      : false;
    let authorizedList = [...rewardList];
    if (!hasRewardManagementAuthority) {
      authorizedList = authorizedList.filter(l => {
        if (l.type == 'loot') {
          let empty = true;
          l.rewardEntryList.forEach(r => {
            if (r.data.length > 0) {
              empty = false;
            }
          });
          return !empty;
        } else if (l.type == 'redeem') {
          return l.redeemRewardEntryList.length != 0;
        }
      });
    }

    return (
      <FlatList
        data={authorizedList}
        keyExtractor={extractKey}
        horizontal={true}
        renderItem={this.renderItem}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}
