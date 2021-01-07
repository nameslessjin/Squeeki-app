import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import GroupHeader from '../group/groupHeader';
import PostCard from './postCard';

const extractKey = ({id}) => id;

export default class PostList extends React.Component {
  renderItem = ({item}) => {
    const {navigation, onAddPost, onPostSelect, selectionMode} = this.props;
    if (item.groupname) {
      return (
        <GroupHeader
          item={item}
          navigation={navigation}
          onAddPost={onAddPost}
        />
      );
    }

    return (
      <PostCard
        item={item}
        navigation={navigation}
        // commentTouchable={true}
        // option={true}
        onPostSelect={onPostSelect}
        selectionMode={selectionMode}
      />
    );
  };

  render() {
    const {group, onEndReached, onRefresh, refreshing} = this.props;
    const {posts, count} = this.props.posts;
    let data = [];

    if (group != null) {
      const groupHeader = {
        ...group,
        id: 'group ' + group.id,
      };

      data = [groupHeader];

      if (group.visibility == 'public' || group.auth != null) {
        data = data.concat(posts);
      }
    } else {
      data = posts;
    }
    const scrollable = count != 0;

    return (
      <FlatList
        style={styles.container}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        scrollEnabled={scrollable}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        onEndReached={() => onEndReached()}
        onEndReachedThreshold={0.1}
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
