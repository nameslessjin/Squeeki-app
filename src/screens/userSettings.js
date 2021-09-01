import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {userLogout} from '../actions/auth';
import {getTheme} from '../utils/theme';

const extractKey = ({id}) => id;
class UserSettings extends React.Component {
  state = {
    options: [
      {id: 'Theme'},
      {id: 'Visibility'},
      {id: 'Notifications'},
      {id: 'Terms'},
      {id: 'Logout'},
    ],
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Settings',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentDidUpdate(prevProps) {
    const {auth, navigation} = this.props;
    if (prevProps.auth != auth) {
      const theme = getTheme(auth.user.theme);
      this.setState({theme});
      navigation.setOptions({
        headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
        headerTintColor: theme.textColor.color,
      });
    }
  }

  renderItem = i => {
    const {item} = i;
    const {id} = item;
    const {theme} = this.state;

    return (
      <TouchableOpacity onPress={() => this.loadTerm(id)}>
        <View
          style={[
            styles.card,
            {marginTop: id == 'Logout' ? 30 : 0},
            theme.backgroundColor,
            theme.borderColor
          ]}>
          <Text
            style={[
              styles.text,
              {color: id == 'Logout' ? 'red' : theme.textColor.color},
            ]}>
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
    const {options, theme} = this.state;
    return (
      <TouchableWithoutFeedback>
        <View style={[styles.container, theme.greyArea]}>
          <FlatList
            data={options}
            alwaysBounceHorizontal={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={extractKey}
            renderItem={this.renderItem}
            extraData={theme}
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

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettings);
