import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  TouchableOpacity,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import {getTheme} from '../utils/theme';
import {searchLocation, getLocation} from '../actions/location';
import LocationSearchBar from '../components/location/locationSearchBar';
import LocationList from '../components/location/locationList';
import {hasLocationPermission} from '../functions/permission';
import Geolocation from 'react-native-geolocation-service';
import LocationHeaderRight from '../components/location/headerRight';

class SearchLocation extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
    searchTerm: '',
    locations: [],
    position: null,
    prevRoute: 'PostSetting',
    ...this.props.route.params,
  };

  componentDidMount() {
    this.getUserLocation();
    const {theme} = this.state;
    const {navigation, prevRoute} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
      title: 'Search Location',
      headerRight: () => (
        <LocationHeaderRight theme={theme} onPress={this.onSetNull} />
      ),
    });
  }

  onSetNull = () => {
    const {prevRoute} = this.state;
    const {navigation} = this.props;
    navigation.navigate(prevRoute, {
      location: null,
      setLocationNull: true,
      prevRoute: 'SearchLocation',
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchTerm != prevState.searchTerm) {
      this.searchLocation();
    }
  }

  getUserLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        this.setState({position});
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        distanceFilter: 0,
      },
    );
  };

  searchLocation = async () => {
    const {searchTerm, position} = this.state;
    const {searchLocation, auth, metadata} = this.props;

    const request = {
      token: auth.token,
      searchTerm,
      lat: position ? position.coords.latitude : metadata.IP ? metadata.IP.latitude : null,
      lng: position ? position.coords.longitude : metadata.IP ? metadata.IP.longitude : null,
    };

    const req = await searchLocation(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Search location error, please try again later');
      return;
    }

    this.setState({locations: req});
  };

  getLocation = async location => {
    const {getLocation, navigation} = this.props;
    const {prevRoute} = this.state;
    const request = {
      place_id: location.place_id,
    };

    const req = await getLocation(request);
    if (req.errors) {
      console.log(req.errors);
      alert('get location error, please try again later');
      return;
    }

    navigation.navigate(prevRoute, {
      location: {
        ...req,
        locationDescription: location.description,
        place_id: location.place_id,
      },
      prevRoute: 'SearchLocation',
    });
  };

  render() {
    const {theme, searchTerm, locations} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.greyArea]}>
          <View style={styles.searchBarArea}>
            <LocationSearchBar
              onInputChange={searchTerm => this.setState({searchTerm})}
              value={searchTerm}
              theme={theme}
            />
          </View>
          <LocationList
            locations={locations}
            onPress={this.getLocation}
            theme={theme}
            isWhite={this.props.auth.user.theme == 'default'}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  searchBarArea: {
    width: '100%',
    height: 70,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const {auth, metadata} = state;
  return {auth, metadata};
};

const mapDispatchToProps = dispatch => {
  return {
    searchLocation: data => dispatch(searchLocation(data)),
    getLocation: data => dispatch(getLocation(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchLocation);
