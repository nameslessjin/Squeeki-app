import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import GroupHeader from '../group/groupHeader';
import PostCard from './postCard';
import RecommendedGroupCard from '../groups/recommendedGroupCard';

const extractKey = ({id}) => id;

export default class PostList extends React.Component {
  renderItem = ({item}) => {
    const {
      navigation,
      onAddPost,
      onPostSelect,
      prevRoute,
      group,
      theme,
    } = this.props;

    if (item.groupname) {
      return (
        <GroupHeader
          item={item}
          navigation={navigation}
          onAddPost={onAddPost}
        />
      );
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
    } = this.props;
    const {posts} = this.props.posts;
    let data = [];

    // if user is not in a group
    if (group != null) {
      const groupHeader = {
        ...group,
        id: 'group ' + group.id,
      };

      data = [groupHeader];

      if (group.visibility || group.auth) {
        data = data.concat(posts);
        if (posts.length == 0) {
          data = data.concat({id: 'null'});
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

    return (
      <FlatList
        style={styles.container}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        onEndReached={onEndReached}
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
});
