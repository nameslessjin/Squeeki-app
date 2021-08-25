import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import GroupHeader from '../group/groupHeader';
import PostCard from './postCard';

const extractKey = ({id}) => id;

export default class PostList extends React.Component {
  renderItem = ({item}) => {
    const {navigation, onAddPost, onPostSelect, prevRoute, group} = this.props;

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

    return (
      <PostCard
        item={item}
        navigation={navigation}
        // commentTouchable={true}
        // option={true}
        onPostSelect={onPostSelect}
        prevRoute={prevRoute}
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

      if (group.visibility || group.auth) {
        data = data.concat(posts);
        if (posts.length == 0) {
          data = data.concat({id: 'null'});
        }
      }
    } else {
      data = posts;
      if (posts.length == 0) {
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
        onEndReached={() => onEndReached()}
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
});
