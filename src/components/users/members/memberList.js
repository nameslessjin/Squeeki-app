import React from 'react';
import {FlatList, StyleSheet, View, SectionList, Text} from 'react-native';
import MemberCard from './memberCard';
import {extractMembersWithRank} from '../../../functions/user';
import SearchBar from '../userSearch/searchBar';

const extractKey = ({id}) => id;

export default class MemberList extends React.Component {
  renderFlatList = ({item}) => {
    if (item == 'search') {
      const {onSearchChange, search_term, theme} = this.props;
      return (
        <View style={styles.searchBar}>
          <SearchBar onChange={onSearchChange} value={search_term} theme={theme} />
        </View>
      );
    }
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
    const {navigation, theme} = this.props;
    return <MemberCard navigation={navigation} item={item} theme={theme}/>;
  };

  renderSectionHeader = ({section}) => {
    const {theme} = this.props
    if (section.title == 'search') {
      return null;
    }

    return <Text style={[styles.title, theme.textColor]}>{section.title}</Text>;
  };

  render() {
    const {onEndReached, navigation, group, members, rankName} = this.props;
    const sections = extractMembersWithRank(members, group.auth.rank, rankName);

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
        keyboardShouldPersistTaps={'handled'}
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
    marginVertical: 5,
  },
  searchBar: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
