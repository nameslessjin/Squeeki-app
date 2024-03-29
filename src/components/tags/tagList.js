import React from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';

const extractKey = ({id}) => id;

export default class TagList extends React.Component {
  renderItem = ({item}) => {
    const {isSearch, onPress, isGroupHeader, theme, isGroupCard} = this.props;

    let disabled = false;

    if (
      item.tag_name.toLowerCase().search('squeeki') != -1 ||
      item.tag_name.toLowerCase().search('admin') != -1
    ) {
      disabled = true;
    }

    const style = isSearch
      ? [
          styles.tag,
          {backgroundColor: disabled ? 'grey' : styles.tag.backgroundColor},
        ]
      : isGroupHeader
      ? styles.groupHeaderTag
      : isGroupCard
      ? styles.groupCardTag
      : styles.groupTag;
    const textStyle = isGroupHeader
      ? styles.groupHeaderText
      : isGroupCard
      ? styles.groupCardText
      : styles.tagText;

    return (
      <TouchableOpacity
        onPress={() => (isGroupHeader || isGroupCard ? null : onPress(item))}
        disabled={disabled}>
        <View style={style}>
          <Text style={textStyle}>{item.tag_name}</Text>
          {isGroupHeader || isGroupCard ? null : (
            <View style={styles.use_count}>
              <Text style={[textStyle, {fontSize: 15}]}>{item.use_count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  renderHorizontalList = ({item}) => {
    return (
      <FlatList
        data={item.tags}
        keyExtractKey={extractKey}
        renderItem={this.renderItem}
        horizontal={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  reformat = (tags, groupTags) => {
    let array = tags.filter(t => {
      const a = groupTags.find(g => g.id == t.id);
      return a ? false : true;
    });

    let tag_character_len = 0;
    let new_tags_list = [];
    let list = [];
    let list_id = '';

    array.forEach(t => {
      const length = t.tag_name.length + t.use_count.toString().length + 2;
      tag_character_len = tag_character_len + length;

      if (tag_character_len > 40) {
        new_tags_list.push({id: list_id, tags: list});
        list = [t];
        list_id = 't' + t.id.toString();
        tag_character_len = length;
      } else {
        list.push(t);
        list_id = list_id + 't' + t.id.toString();
      }
    });

    if (array.length != 0 && list.length != 0) {
      new_tags_list.push({id: list_id, tags: list});
    }

    return new_tags_list;
  };

  render() {
    const {tags, onEndReached, isSearch, groupTags} = this.props;
    // reformat the data based on tag_name length
    const tag_list = this.reformat(tags || [], groupTags);

    return isSearch ? (
      <FlatList
        style={styles.container}
        data={tag_list}
        keyExtractKey={extractKey}
        renderItem={this.renderHorizontalList}
        alwaysBounceHorizontal={false}
        keyboardShouldPersistTaps={'handled'}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
      />
    ) : (
      <FlatList
        data={groupTags}
        keyExtractKey={extractKey}
        renderItem={this.renderItem}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps={'handled'}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{flexDirection: 'row'}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#00cec9',
    padding: 7,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    flexDirection: 'row',
    height: 40,
  },
  tagText: {
    color: 'white',
    fontSize: 17,
  },
  groupHeaderText: {
    color: 'white',
    fontSize: 13,
  },
  groupCardText: {
    color: 'white',
    fontSize: 11,
  },
  use_count: {
    borderRadius: 10,
    backgroundColor: '#2980b9',
    marginLeft: 3,
    padding: 1,
  },
  groupHeaderTag: {
    backgroundColor: '#74b9ff',
    padding: 7,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    flexDirection: 'row',
    height: 30,
  },
  groupCardTag: {
    backgroundColor: '#74b9ff',
    padding: 3,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    marginLeft: 0,
    flexDirection: 'row',
    height: 20,
  },
  groupTag: {
    backgroundColor: '#74b9ff',
    padding: 7,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    flexDirection: 'row',
    height: 40,
  },
});
