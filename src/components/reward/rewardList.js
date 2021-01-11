import React from 'react';
import {
  StyleSheet,
  SectionList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {extractReward} from '../../functions/reward';
import RewardCard from './rewardCard';

const extractKey = ({id}) => id;

export default class RewardList extends React.Component {
  state = {
    option: 'unredeemed',
  };

  onOptionPress = () => {
    const {option} = this.state;
    const {loadGroupReward} = this.props;
    if (option == 'unredeemed') {
      this.setState({option: 'redeemed'});
      loadGroupReward(true, true);
    } else {
      this.setState({option: 'unredeemed'});
      loadGroupReward(true, false);
    }
  };

  renderSectionHeader = ({section}) => {
    if (section.id == '0') {
      const {option} = this.state;

      return (
        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: option == 'unredeemed' ? 'white' : '#dfe6e9',
              },
            ]}
            onPress={this.onOptionPress}
            disabled={option == 'unredeemed' ? true : false}>
            <Text>Unredeemed</Text>
          </TouchableOpacity>
          <View
            style={{height: '100%', borderRightWidth: 1.5, borderColor: 'grey'}}
          />
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                backgroundColor: option == 'redeemed' ? 'white' : '#dfe6e9',
              },
            ]}
            onPress={this.onOptionPress}
            disabled={option == 'redeemed' ? true : false}>
            <Text>Redeemed</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <Text style={styles.title}>{section.title}</Text>;
  };

  renderItem = i => {
    const {auth, onDeleteReward} = this.props;
    const {id} = i.item;

    if (id == '0') {
      const {option} = this.state;
      return (
        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: option == 'unredeemed' ? 'white' : '#dfe6e9',
              },
            ]}
            onPress={this.onOptionPress}
            disabled={option == 'unredeemed' ? true : false}>
            <Text>Unredeemed</Text>
          </TouchableOpacity>
          <View
            style={{height: '100%', borderRightWidth: 1.5, borderColor: 'grey'}}
          />
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                backgroundColor: option == 'redeemed' ? 'white' : '#dfe6e9',
              },
            ]}
            onPress={this.onOptionPress}
            disabled={option == 'redeemed' ? true : false}>
            <Text>Redeemed</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <RewardCard item={i.item} auth={auth} onDeleteReward={onDeleteReward} />
    );
  };

  render() {
    const {rewards, onEndReached} = this.props;
    const {option} = this.state;
    const redeemed = option == 'redeemed';
    let sections = extractReward(rewards);
    const options = {
      title: 'options',
      id: '0',
      data: [],
    };
    let list = [options];
    if (redeemed) {
      list = list.concat(rewards);
    } else {
      list = list.concat(sections);
    }

    return redeemed ? (
      <FlatList
        style={styles.container}
        keyExtractKey={extractKey}
        data={list}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        onEndReached={() => onEndReached(true)}
        onEndReachedThreshold={0.1}
      />
    ) : (
      <SectionList
        style={styles.container}
        keyExtractKey={extractKey}
        sections={list}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        stickySectionHeadersEnabled={false}
        onEndReached={() => onEndReached(false)}
        onEndReachedThreshold={0.1}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginVertical: 5,
  },
  button: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    height: 40,
    marginHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    marginTop: 10,
  },
});
