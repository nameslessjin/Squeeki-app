import React from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import Card from './responseCard';
import OptionButton from './optionButton';

const extractKey = ({userId}) => userId;
export default class TaskResponseList extends React.Component {
  state = {
    option: 'pending',
  };

  renderItem = ({item}) => {
    const {onPress} = this.props;

    if (item.userId == 'options') {
      // return this.optionButtons();
      return this.optionButtons();
    }
    return <Card {...item} onPress={onPress} />;
  };

  onOptionsPress = option => {
    const {loadParticipants} = this.props;
    this.setState({option});
    loadParticipants(true, option);
    // load task here
  };

  optionButtons = () => {
    const {option} = this.state;

    return (
      <View style={styles.options}>
        <OptionButton
          option={option}
          type={'pending'}
          onPress={this.onOptionsPress}
        />
        <OptionButton
          option={option}
          type={'completed'}
          onPress={this.onOptionsPress}
        />
        <OptionButton
          option={option}
          type={'denied'}
          onPress={this.onOptionsPress}
        />
      </View>
    );
  };

  render() {
    const {taskResponse, onEndReached} = this.props;
    const list = [{userId: 'options'}].concat(taskResponse);

    return (
      <FlatList
        data={list}
        keyExtractor={extractKey}
        alwaysBounceHorizontal={false}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        onEndReachedThreshold={0}
        onEndReached={() => onEndReached(this.state.option)}
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
