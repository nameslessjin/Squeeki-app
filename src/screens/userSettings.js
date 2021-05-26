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
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';

const extractKey = ({id}) => id;
class UserSettings extends React.Component {
  state = {
    options: [
      // {id: 'Theme'},
      {id: 'Visibility'},
      {id: 'Notifications'},
      {id: 'Terms'},
      {id: 'Logout'},
    ],
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Settings',
    });
  }

  renderItem = i => {
    const {item} = i;
    const {id} = item;

    return (
      <TouchableOpacity onPress={() => this.loadTerm(id)}>
        <View style={[styles.card, {marginTop: id == 'Logout' ? 30 : 0}]}>
          <Text
            style={[styles.text, {color: id == 'Logout' ? 'red' : 'black'}]}>
            {id}
          </Text>
          {id == 'Logout' ? null : (
            <MaterialIcons name={'chevron-right'} size={30} color={'silver'} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  loadTerm = name => {
    const {navigation, logout} = this.props;
    if (name == 'Terms') {
      navigation.navigate('Terms');
    } else if (name == 'Notifications') {
      navigation.navigate('NotificationSettings');
    } else if (name == 'Visibility') {
      navigation.navigate('VisibilitySettings');
    } else if (name == 'Theme') {
      navigation.navigate('ThemeSettings');
    } else if (name == 'Logout') {
      logout();
      navigation.reset({index: 0, routes: [{name: 'SignIn'}]});
    }
  };

  render() {
    const {options} = this.state;
    return (
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <FlatList
            data={options}
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
    borderBottomColor: 'silver',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(userLogout()),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(UserSettings);
