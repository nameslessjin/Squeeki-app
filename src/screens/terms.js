import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getTheme} from '../utils/theme';
import {connect} from 'react-redux';

const extractKey = ({id}) => id;
class Terms extends React.Component {
  state = {
    terms: [{id: '1', name: 'Privacy Policy'}, {id: '2', name: 'EULA'}],
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  renderItem = i => {
    const {item} = i;
    const {id, name} = item;
    const {theme} = this.state;
    return (
      <TouchableOpacity onPress={() => this.loadTerm(name)}>
        <View style={[styles.card, theme.backgroundColor, theme.borderColor]}>
          <Text style={[styles.text, theme.textColor]}>{name}</Text>
          <MaterialIcons name={'chevron-right'} size={30} color={'silver'} />
        </View>
      </TouchableOpacity>
    );
  };

  loadTerm = name => {
    const {navigation} = this.props;
    navigation.navigate('TermDisplay', {
      name: name,
    });
  };

  render() {
    const {terms, theme} = this.state;
    return (
      <TouchableWithoutFeedback>
        <View style={[styles.container, theme.greyArea]}>
          <StatusBar barStyle={'dark-content'} />
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
    borderColor: 'silver',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

export default connect(mapStateToProps)(Terms);
