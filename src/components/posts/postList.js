import React from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import GroupHeader from '../group/groupHeader';
import PostCard from './postCard';
import RecommendedGroupCard from '../groups/recommendedGroupCard';
import PostCategorySelector from '../posts/postCategorySelector';
import RewardHistoryCard from '../reward/rewardHistoryCard';

const extractKey = ({id}) => id;
const extractCategory = ({category}) => category;
export default class PostList extends React.Component {
  renderItem = ({item}) => {
    const {
      navigation,
      onAddPost,
      onPostSelect,
      prevRoute,
      group,
      theme,
      position,
      selectedPostCategory,
      onSelectPostCategory,
    } = this.props;

    if (item.isGroup && prevRoute == 'Group') {
      return (
        <GroupHeader
          item={item}
          navigation={navigation}
          onAddPost={onAddPost}
        />
      );
    }

    if (item.id == 'category') {
      const list = [
        {category: 'all'},
        {category: 'rewards'},
        {category: 'general'},
        {category: 'events'},
        {category: 'tasks'},
        {category: 'mentioned'},
      ];
      return (
        <View style={styles.postCategoryContainer}>
          <FlatList
            keyExtractor={extractCategory}
            data={list}
            horizontal={true}
            alwaysBounceVertical={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <PostCategorySelector
                {...item}
                selectedPostCategory={selectedPostCategory}
                onSelectPostCategory={onSelectPostCategory}
              />
            )}
          />
        </View>
      );
    }

    if (item.type == 'reward') {
      return (
        <RewardHistoryCard
          item={item}
          groupId={group.id}
          prevRoute={prevRoute == 'Group' ? 'GroupNavigator' : prevRoute}
          theme={theme}
          navigation={navigation}
        />
      );
    }

    if (item.id == 'rewardRecent') {
      return (
        <View
          style={{
            width: '100%',
            height: 40,
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={{fontSize: 18, fontWeight: '500'}}>
            Recent 20 winners
          </Text>
        </View>
      );
    }

    if (item.id == 'empty') {
      return <View style={styles.empty} />;
    }

    if (item.id == 'null') {
      return (
        <View style={styles.placeholder}>
          <Text style={styles.noPostStyle}>
            {group
              ? group.status != 'active'
                ? `This group is ${group.status}`
                : 'There is not any post yet'
              : 'There is not any post yet'}
          </Text>
        </View>
      );
    }

    if (item.id == 'recommendedGroups') {
      return this.renderRecommendedGroups(item);
    }

    return (
      <PostCard
        item={item}
        navigation={navigation}
        onPostSelect={onPostSelect}
        prevRoute={prevRoute}
        position={position}
        from={
          group
            ? selectedPostCategory == 'mentioned'
              ? 'Mentioned'
              : 'Group'
            : 'Home'
        }
      />
    );
  };

  renderRecommendedGroups = item => {
    const {id, data} = item;
    const {theme, navigation, prevRoute, position} = this.props;

    return (
      <View style={[{width: '100%'}, theme.backgroundColor]}>
        <View
          style={{
            width: '100%',
            height: 40,
            justifyContent: 'center',
            padding: 5,
          }}>
          <Text style={[theme.textColor, {fontSize: 24, fontWeight: '500'}]}>
            Discover Groups
          </Text>
        </View>
        <FlatList
          style={[styles.container, {minHeight: 130, marginBottom: 20}]}
          alwaysBounceVertical={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={data}
          keyExtractor={extractKey}
          renderItem={({item}) => (
            <RecommendedGroupCard
              item={item}
              navigation={navigation}
              prevRoute={prevRoute}
              position={position}
            />
          )}
        />
      </View>
    );
  };

  render() {
    const {
      group,
      onEndReached,
      onRefresh,
      refreshing,
      recommendedGroups,
      prevRoute,
      selectedPostCategory,
      rewards,
    } = this.props;
    const {posts} = this.props.posts;
    let data = [];

    // if user is in a group
    if (group != null) {
      const groupHeader = {
        ...group,
        id: 'group ' + group.id,
        isGroup: true,
      };

      data = [groupHeader];

      // if user auth in group
      if (group.visibility || group.auth) {
        if (selectedPostCategory == 'rewards') {
          data = data.concat([{id: 'category'}]);
          data = data.concat({id: 'rewardRecent'});
          data = data.concat(rewards.map(r => ({...r, type: 'reward'})));
        } else {
          data = data.concat([{id: 'category'}]);
          data = data.concat(posts);
          if (posts.length == 0) {
            data = data.concat({id: 'null'});
          }
        }
      }
    } else {
      if (posts.length != 0) {
        data = data.concat(posts);
      } else {
        data = data.concat({id: 'null'});
      }
    }

    // if user is in homepage
    if (prevRoute == 'Home') {
      data = [];
      if (recommendedGroups) {
        if (recommendedGroups.length > 0) {
          data = [
            {
              id: 'recommendedGroups',
              data: recommendedGroups,
            },
          ];
        }
      }

      if (posts.length != 0) {
        data = data.concat(posts);
      } else {
        data = data.concat({id: 'null'});
      }
    }

    data = data.concat([{id: 'empty'}]);

    return (
      <FlatList
        style={styles.container}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        onEndReached={selectedPostCategory == 'rewards' ? null : onEndReached}
        onEndReachedThreshold={0.2}
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
  noPostStyle: {
    // marginBottom: 200,
    color: 'grey',
    fontStyle: 'italic',
  },
  placeholder: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 5,
  },
  postCategoryContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  empty: {
    width: '100%',
    height: 200,
  },
});
