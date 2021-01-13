import React from 'react';
import {FlatList, StyleSheet, View, SectionList, Text} from 'react-native';
import MemberCard from './memberCard';
import {extractMembersWithRank} from '../../../functions/user';

const extractKey = ({id}) => id;

export default class MemberList extends React.Component {
  renderFlatList = ({item}) => {
    
    return (
      <FlatList
        style={[styles.container, {alignItems: 'center', marginBottom: 30}]}
        alwaysBounceHorizontal={false}
        keyExtractor={extractKey}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={item}
        scrollEnabled={false}
        renderItem={this.renderItem}
      />
    );
  };

  renderItem = ({item}) => {
    const {navigation} = this.props;
    return <MemberCard navigation={navigation} item={item} />
  };

  renderSectionHeader = ({section}) => {
    return <Text style={styles.title}>{section.title}</Text>;
  };

  render() {
    const {onEndReached, navigation, group} = this.props;
    const {members} = this.props.members;
    const sections = extractMembersWithRank(members, group.auth.rank);

    return (
      <SectionList
        style={[styles.container]}
        keyExtractor={extractKey}
        sections={sections}
        renderItem={this.renderFlatList}
        renderSectionHeader={this.renderSectionHeader}
        scrollEnabled={true}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 5
  },
});
