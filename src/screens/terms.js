import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const extractKey = ({id}) => id;
export default class Terms extends React.Component {
  state = {
    terms: [{id: '1', name: 'Privacy Policy'}, {id: '2', name: 'EULA'}],
  };

  componentDidMount() {
    const {navigation} = this.props
    navigation.setOptions({
      headerBackTitleVisible: false
    })
  }

  renderItem = i => {
    const {item} = i;
    const {id, name} = item;

    return (
      <TouchableWithoutFeedback onPress={() => this.loadTerm(name)}>
        <View style={styles.card}>
          <Text style={styles.text}>{name}</Text>
          <MaterialIcons name={'chevron-right'} size={30} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  loadTerm = (name) => {
    const {navigation} = this.props
    navigation.navigate("TermDisplay", {
        name: name
    })
  }

  render() {
    const {terms} = this.state;
    return (
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <FlatList
            data={terms}
            alwaysBounceHorizontal={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={extractKey}
            renderItem={this.renderItem}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 50,
    alignItems: 'center',
    borderBottomColor: 'silver'
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
});
