import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {updateTheme} from '../actions/auth';
import {getTheme} from '../utils/theme';

const extractKey = ({id}) => id;
class ThemeSettings extends React.Component {
  state = {
    options: [
      {id: 'default', name: 'Default', selected: true},
      {id: 'darkMode', name: 'Dark Mode', selected: false},
    ],
  };

  componentDidMount() {
    const {navigation, auth} = this.props;
    const {theme} = auth.user;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Theme',
      headerStyle: getTheme(theme).backgroundColor,
      headerTintStyle: getTheme(theme).textColor,
    });

    this.setState(prevState => {
      return {
        options: prevState.options.map(p => {
          if (theme == p.id) {
            return {
              ...p,
              selected: true,
            };
          }
          return {
            ...p,
            selected: false,
          };
        }),
      };
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state != prevState) {
      const {navigation} = this.props;
      const {options} = this.state;
      const newTheme = options.filter(p => p.selected)[0].id;
      navigation.setOptions({
        headerStyle: getTheme(newTheme).backgroundColor,
        headerTintColor: getTheme(newTheme).textColor.color,
      });
    }
  }

  componentWillUnmount() {
    const {theme} = this.props.auth.user;
    const {options} = this.state;
    const newTheme = options.filter(p => p.selected)[0].id;
    if (theme != newTheme) {
      this.updateTheme();
    }
  }

  updateTheme = async () => {
    const {options} = this.state;
    const {auth, updateTheme} = this.props;
    const theme = options.filter(p => p.selected)[0].id;
    const request = {
      token: auth.token,
      theme,
    };

    const req = await updateTheme(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot update theme at this moment, please try again later');
    }
  };

  renderItem = i => {
    const {id, name, selected} = i.item;

    const theme = getTheme(id);

    return (
      <TouchableOpacity onPress={() => this.onPress(id)}>
        <View style={[styles.card, theme.backgroundColor, theme.borderColor]}>
          <Text style={[styles.text, theme.textColor]}>{name}</Text>
          {selected ? (
            <MaterialIcons name={'check'} size={30} color={'#44bd32'} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  onPress = id => {
    this.setState(prevState => {
      return {
        options: prevState.options.map(p => {
          if (id == p.id) {
            return {
              ...p,
              selected: true,
            };
          }
          return {
            ...p,
            selected: false,
          };
        }),
      };
    });
  };

  render() {
    const {options} = this.state;
    const theme = options.filter(p => p.selected)[0].id;
    return (
      <TouchableWithoutFeedback>
        <View style={[styles.container, getTheme(theme).greyArea]}>
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
    updateTheme: data => dispatch(updateTheme(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThemeSettings);
