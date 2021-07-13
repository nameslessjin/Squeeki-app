import React from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

const extractKey = ({id}) => id;
export default class rewardContentList extends React.Component {
  state = {
    ...this.props.route.params,
  };

  componentDidMount(){
    this.props.navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Content List'
    })
  }

  componentWillUnmount(){
    this.props.navigation.navigate('RewardSetting', {
      contentList: this.state.contentList
    })
  }

  onInputChange = (value, index) => {

    let updatedContentList = [...this.state.contentList];
    updatedContentList[index].content = value;
    this.setState({contentList: updatedContentList});
  };

  renderItem = ({index, item}) => {
    const {id, content} = item;

    if (id == 'empty') {
      return <View style={styles.empty} />;
    }

    return (
      <View style={styles.contentContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: StyleSheet.hairlineWidth,
            paddingRight: 10,
          }}>
          <Text style={{color: 'grey'}}>Content</Text>
          <Text style={{color: 'grey'}} multiline={true}>
            {index + 1}
          </Text>
        </View>

        <TextInput
          style={[styles.textInputStyle]}
          value={content}
          keyboardType={'default'}
          onChangeText={t => this.onInputChange(t, index)}
          maxLength={200}
          multiline={true}
          placeholderTextColor={'#7f8fa6'}
        />
      </View>
    );
  };

  render() {
    const {contentList} = this.state;

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
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  textInputStyle: {
    width: '81%',
    marginLeft: 10,
    color: 'black',
    paddingRight: 2
  },
});
