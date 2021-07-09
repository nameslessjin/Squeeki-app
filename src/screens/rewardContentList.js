import React from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

const extractKey = ({id}) => id;
export default class rewardContentList extends React.Component {
  renderItem = ({item}) => {
    const {id, content} = item;

    if (id == 'empty') {
      return <View style={styles.empty} />;
    }

    

    return;
  };

  render() {
    const {contentList} = this.props;

    let contentListWithEmptySpace = contentList.concat([{id: 'empty'}]);

    return (
      <FlatList
        style={styles.container}
        data={contentListWithEmptySpace}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        keyboardShouldPersistTaps={'handled'}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  empty: {
    width: '100%',
    height: 400,
  },
  contentContainer: {
    width: '100%',
    height: 80,
    marginTop: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  }
});
