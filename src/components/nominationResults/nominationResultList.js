import React from 'react';
import {FlatList, StyleSheet, View, Text, Dimensions} from 'react-native';
import NominationResultsCard from './nominationResultsCard';
import {getFormalTime, getSundays} from '../../utils/time';

const extractTime = ({time}) => time;
const extractNominationName = ({nomination_name}) => nomination_name;
const extractNomineeName = ({nominee_name}) =>
  nominee_name + (Math.random() * 1000).toString();

export default class NominationResultsList extends React.Component {
  renderItemNominee = i => {
    const {onNomineePress, theme} = this.props;
    return <NominationResultsCard onPress={onNomineePress} {...i.item} theme={theme} />;
  };

  renderItemNominationName = ({item}) => {
    const {
      list,
      nomination_name,
      nominationId,
      total_vote_count,
      most_recent,
      time,
    } = item;
    const {theme} = this.props

    const max_vote = Math.max.apply(
      Math,
      list.map(i => {
        return i.vote;
      }),
    );

    list.forEach(l => {
      l.total_vote_count = total_vote_count;
      l.most_recent = most_recent;
      l.max = l.vote == max_vote;
      l.time = time;
      l.nominationId = nominationId;
    });

    return (
      <View style={{padding: 5}}>
        <Text style={[{fontWeight: 'bold', marginBottom: 5}, theme.textColor]}>
          {nomination_name}:
        </Text>
        <FlatList
          style={styles.container}
          data={item.list}
          keyExtractor={extractNomineeName}
          renderItem={this.renderItemNominee}
          alwaysBounceHorizontal={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  renderItemTime = ({item}) => {
    const {time} = item;
    const {theme} = this.props;
    const {year, month, date} = getFormalTime(parseInt(time) * 1000000);

    // - 1 second.  For example, 5/23/2021 EST 8:59pm
    const {last_sunday, next_sunday} = getSundays(
      parseInt(time) * 1000000 - 1000,
    );
    const this_sunday = getSundays().next_sunday;
    const {list} = item;

    const most_recent =
      Math.floor(this_sunday.getTime() / 1000) ==
      Math.floor(next_sunday.getTime() / 1000);

    const timeText = (
      <Text
        style={[
          {fontStyle: 'italic', fontSize: 15, marginVertical: 5},
          theme.textColor,
        ]}>
        {most_recent
          ? 'This Week'
          : last_sunday.getMonth() +
            1 +
            '/' +
            last_sunday.getDate() +
            '/' +
            last_sunday.getFullYear() +
            '-' +
            (month + 1) +
            '/' +
            date +
            '/' +
            year}
      </Text>
    );

    let modified_list = [];

    let total_vote_count = 0;
    if (list) {
      modified_list = JSON.parse(JSON.stringify(list));
      if (modified_list.length != 0) {
        modified_list.forEach(l => {
          l.list.forEach(i => {
            total_vote_count = total_vote_count + i.vote;
          });
        });
        modified_list.forEach(l => {
          l.total_vote_count = total_vote_count;
          l.most_recent = most_recent;
          l.time = time;
        });
      }
    }

    return (
      <View
        style={[
          {
            alignItems: 'center',
            margin: 7,
            borderRadius: 10,
            borderWidth: StyleSheet.hairlineWidth
          },
          theme.backgroundColor,
          theme.borderColor
        ]}>
        {timeText}
        {list ? (
          modified_list.length == 0 ? (
            <Text style={{color: 'grey', margin: 3}}>
              Currently, there is no nomination. Become the first one to
              nominate.
            </Text>
          ) : (
            <FlatList
              style={styles.container}
              data={modified_list}
              extraData={total_vote_count}
              keyExtractor={extractNominationName}
              renderItem={this.renderItemNominationName}
              alwaysBounceHorizontal={false}
              showsVerticalScrollIndicator={false}
            />
          )
        ) : null}
      </View>
    );
  };

  render() {
    const {
      mostRecentNominationResults,
      nominationResults,
      onEndReached,
      onRefresh,
      refreshing,
    } = this.props;
    const {oldResultList} = nominationResults;
    const nominationResultList = mostRecentNominationResults.time
      ? [mostRecentNominationResults].concat(oldResultList || [])
      : oldResultList || [];

    return (
      <FlatList
        style={styles.container}
        data={nominationResultList}
        keyExtractor={extractTime}
        renderItem={this.renderItemTime}
        alwaysBounceHorizontal={false}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
