import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import OptionButton from './optionButton';
import Card from './leaderboardCard';

const extractKey = ({user}) => user.id;
export default class Leaderboard extends React.Component {
  state = {
    option: 'month',
  };

  onOptionPress = option => {
    const {loadLeaderBoard} = this.props;
    this.setState({option: option});

    loadLeaderBoard(true, option);
  };

  optionButtons = () => {
    const {option} = this.state;
    const {theme} = this.props;
    return (
      <View style={styles.options}>
        <OptionButton
          option={option}
          type={'month'}
          onPress={this.onOptionPress}
          theme={theme}
        />
        <OptionButton
          option={option}
          type={'week'}
          onPress={this.onOptionPress}
          theme={theme}
        />
        {/* <OptionButton option={option} type={'semester'} onPress={this.onOptionPress}/> */}
      </View>
    );
  };

  renderItem = i => {
    const {theme} = this.props;
    const {index, item} = i;
    const {id} = item.user;
    if (id == 'options') {
      return this.optionButtons();
    }
    return <Card i={i} theme={theme} />;
  };

  render() {
    const {option} = this.state;
    const {users, onEndReached} = this.props;
    const list = [{user: {id: 'options'}}].concat(users);

    return (
      <FlatList
        data={list}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        onEndReached={() => onEndReached(option)}
        onEndReachedThreshold={0.1}
      />
    );
  }
}

const styles = StyleSheet.create({
  options: {
    height: 40,
    marginHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
