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
    const {onSettingPress} = this.props;
    return <RewardListCard item={item} onSettingPress={onSettingPress} />;
  };

  LeftAction = () => {};

  rightAction = () => {};

  render() {
    const {rewardList} = this.props;

    return (
      <FlatList
        data={rewardList}
        keyExtractor={extractKey}
        horizontal={true}
        renderItem={this.renderItem}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}
