import React from 'react';
import {
  SectionList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const extractKey = ({id}) => id;

export default class rewardEntryList extends React.Component {
  renderItem = ({item, index, section}) => {
    const {name, count} = item;
    const {onPress} = this.props
    
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text>{count} Remaining</Text>
        </View>
        <TouchableOpacity onPress={() => onPress(item)}>
          <View
            style={styles.button}>
            <Text style={{color: 'white'}}>View</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderSectionHeader = ({section}) => {
    const {title, data, index, id, chance} = section;

    if (data.length != 0) {
      return (
        <View style={styles.title}>
          <Text style={styles.titleText}>{`${title}`}</Text>
          <Text style={styles.chance}>{`(${chance}%)`}</Text>
        </View>
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
        stickySectionHeadersEnabled={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    justifyContent: 'center',
    width: '100%',
    minHeight: 45,
    maxHeight: 80,
    alignItems: 'center',
    marginVertical: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    maxHeight: 100,
    minHeight: 70,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // backgroundColor: 'yellow',
  },
  cardInfo: {
    height: '100%',
    width: '80%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'silver'
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
  },
  chance: {
    fontSize: 13,
    fontWeight: 'normal',
    color: 'grey'
  },
  button: {
    width: 60,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'silver',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
