import React from 'react';
import {FlatList, View, Text, StyleSheet, Keyboard} from 'react-native';
import RewardHistoryCard from './rewardHistoryCard';

const extractKey = ({id}) => id;

export default class RewardHistoryList extends React.Component {
  renderItem = ({item}) => {
    const {id} = item;

    const {groupId, onRedeemPress, prevRoute, theme, navigation} = this.props;

    if (id == 'header') {
      return (
        <View style={styles.header}>
          <View style={styles.rewardInfoContainer}>
            <Text style={[styles.headerText, theme.textColor]}>Reward</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.headerText, {color: '#EA2027'}]}>Winner</Text>
          </View>
        </View>
      );
    } else if (id == 'empty') {
      return <View style={styles.empty} />;
    } else {
      return (
        <RewardHistoryCard
          item={item}
          groupId={groupId}
          onRedeemPress={onRedeemPress}
          prevRoute={prevRoute}
          theme={theme}
          navigation={navigation}
        />
      );
    }
  };

  render() {
    const {rewardHistory, onEndReached, prevRoute} = this.props;

    let data = [...rewardHistory];

    if (prevRoute == 'RewardHistory') {
      data = [{id: 'header'}].concat(data).concat([{id: 'empty'}]);
    } else {
      data = data.concat([{id: 'empty'}]);
    }

    return (
      <FlatList
        keyExtractor={extractKey}
        renderItem={this.renderItem}
        data={data}
        showsVerticalScrollIndicator={false}
        style={{width: '100%', height: '100%'}}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        onScroll={() => Keyboard.dismiss()}
      />
    );
  }
}

const styles = StyleSheet.create({
  rewardInfoContainer: {
    width: '70%',
    maxHeight: 180,
  },
  rightContainer: {
    width: '30%',
    maxHeight: 180,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  header: {
    width: '100%',
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 17,
    flexDirection: 'row',
  },
  empty: {
    width: '100%',
    height: 200,
  },
});

