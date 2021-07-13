import React from 'react';
import {FlatList, SectionList, View, Text, StyleSheet} from 'react-native';

const extractKey = ({id}) => id;

export default class rewardEntryList extends React.Component {
  renderItem = ({item}) => {
    const {name, count} = item;
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text>Remain: {count}</Text>
      </View>
    );
  };

  renderSectionHeader = ({section}) => {
    const {title, data, index} = section;

    if (data.length != 0) {
      let prefix = 'First Reward';

      switch (index) {
        case 0:
          prefix = 'First Reward';
          break
        case 1:
          prefix = 'Second Reward';
          break
        case 2:
          prefix = 'Third Reward';
          break
        case 3:
          prefix = 'Fourth Reward';
          break
        case 4:
          prefix = 'Fifth Reward';
          break
      }

      return (
        <Text style={styles.title}>
          {`${prefix}`}
          <Text style={styles.chance}>{`(${title}%)`}</Text>
        </Text>
      );
    }
  };

  render() {
    const {rewardEntryList} = this.props;

    return (
      <SectionList
        sections={rewardEntryList.map((r, index) => ({...r, index}))}
        keyExtractor={extractKey}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={this.renderSectionHeader}
        style={{width: '100%', height: '100%'}}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    marginTop: 15,
  },
  card: {
    maxHeight: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  chance: {
      fontSize: 14,
      fontWeight: 'normal',
  }
});
