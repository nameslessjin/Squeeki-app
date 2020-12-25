import React from 'react';
import {FlatList, StyleSheet, View, Text, Dimensions} from 'react-native';
import NominationResultsCard from './nominationResultsCard';
import {getNominationTime, getSundays} from '../../utils/time';

const {width} = Dimensions.get('window');

const extractTime = ({time}) => time;
const extractNominationName = ({nomination_name}) => nomination_name;
const extractNomineeName = ({nominee_name}) =>
  nominee_name + (Math.random() * 1000).toString();

export default class NominationResultsList extends React.Component {
  renderItemNominee = i => {
    const {nominee_name, vote, total_vote_count, max, most_recent} = i.item;
    const percentage = vote / total_vote_count;

    return (
      <View style={{justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            height: 40,
            zIndex: 1,
          }}>
          <Text>{nominee_name}</Text>
          <Text>Vote: {vote}</Text>
        </View>
        <View
          style={{
            zIndex: 0,
            backgroundColor: most_recent
              ? max
                ? '#ff7675'
                : '#c7ecee'
              : '#b8e994',
            width: percentage * width - 23,
            height: '100%',
            position: 'absolute',
          }}
        />
      </View>
    );
  };

  renderItemNominationName = ({item}) => {
    const {list, nomination_name, total_vote_count, most_recent} = item;

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
    });

    return (
      <View style={{padding: 5}}>
        <Text style={{fontWeight: 'bold', marginBottom: 5}}>{nomination_name}:</Text>
        <FlatList
          style={styles.container}
          data={item.list}
          keyExtractor={extractNomineeName}
          renderItem={this.renderItemNominee}
          alwaysBounceHorizontal={false}
        />
      </View>
    );
  };

  renderItemTime = ({item}) => {
    const {time} = item;
    const {year, month, date} = getNominationTime(parseInt(time) * 1000000);
    const {last_sunday, next_sunday} = getSundays(parseInt(time) * 1000000);
    const this_sunday = getSundays().next_sunday;
    const {list} = item;
    const most_recent =
      Math.floor(this_sunday.getTime() / 1000) ==
      Math.floor(next_sunday.getTime() / 1000);
    const timeText = (
      <Text style={{fontStyle: 'italic', fontSize: 15, marginVertical: 5}}>
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
        });
      }
    }

    return (
      <View
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          margin: 7,
          borderRadius: 10,
        }}>
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
    const nominationResultList = (mostRecentNominationResults.time) ? [mostRecentNominationResults].concat(
      oldResultList || [],
    ) : oldResultList || [];

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
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
