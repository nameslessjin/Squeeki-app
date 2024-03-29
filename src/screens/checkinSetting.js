import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/checkin/headerRightButton';
import Input from '../components/checkin/settingInput';
import validator from 'validator';
import {userLogout} from '../actions/auth';
import {calculateTimeAddition} from '../utils/time';
import {getGroupCheckIn, cleanCheckIn, createCheckIn} from '../actions/checkin';
import {getTheme} from '../utils/theme';

class CheckInSetting extends React.Component {
  state = {
    name: '',
    post: {},
    isLocal: false,
    password: '',
    duration: '5',
    point: 100,
    loading: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightButton
          onPress={this.onCreateCheckIn}
          type={'done'}
          disabled={true}
          theme={theme}
        />
      ),
      headerBackTitleVisible: false,
      headerTitle: 'Check-in Setting',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  validation = () => {
    let {name, post, isLocal, password, duration} = this.state;
    name = name.trim();
    // duration = parseInt(duration);

    if (name.length == 0) {
      return false;
    }

    if (password.length != 0) {
      if (!validator.isAlphanumeric(password)) {
        return false;
      }
    }

    if (!post.id) {
      return false;
    }

    if (validator.isNumeric(duration)) {
      if (duration <= 0 || duration > 3000) {
        return false;
      }
    } else {
      return false;
    }

    if (isLocal) {
      if (post.lat == null || post.lng == null) {
        return false;
      }
    }

    return true;
  };

  componentWillUnmount() {
    this.props.cleanCheckIn();
    this.loadCheckIn();
  }

  loadCheckIn = async () => {
    const {group, auth, getGroupCheckIn, navigation, userLogout} = this.props;
    const request = {
      groupId: group.group.id,
      token: auth.token,
      count: 0,
    };

    const req = await getGroupCheckIn(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load check in at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {route, navigation} = this.props;
    const prevParams = prevProps.route.params;
    const {isLocal, theme} = this.state;
    const previsLocal = prevState.isLocal;
    if (route.params != prevParams) {
      this.setState({post: route.params.post, isLocal: false});
    }

    if (prevState != this.state) {
      const disable = !this.validation();
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            onPress={this.onCreateCheckIn}
            type={'done'}
            disabled={disable}
            theme={theme}
          />
        ),
      });
    }
  }

  onCreateCheckIn = async () => {
    const {name, post, isLocal, password, duration} = this.state;
    const {group, navigation, auth, createCheckIn, userLogout} = this.props;

    const request = {
      groupId: group.group.id,
      postId: post.id,
      point: 100,
      name: name.trim(),
      isLocal: isLocal,
      password: password.trim(),
      endAt: calculateTimeAddition(parseInt(duration)),
      token: auth.token,
    };

    this.setState({loading: true});
    const req = await createCheckIn(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot create check in at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.setState({loading: false});
    navigation.navigate('CheckIn');
  };

  onInputChange = (type, value) => {
    if (type == 'name') {
      this.setState({name: value});
    } else if (type == 'post') {
      this.props.navigation.navigate('Post');
    } else if (type == 'local') {
      this.setState(prevState => {
        return {
          ...prevState,
          isLocal: !prevState.isLocal,
        };
      });
      // get location here
    } else if (type == 'password') {
      this.setState({password: value.trim()});
    } else if (type == 'duration') {
      this.setState({duration: value.trim()});
    }
  };

  render() {
    const {
      name,
      isLocal,
      password,
      duration,
      point,
      post,
      loading,
      theme,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.greyArea]}>
          <Input
            type={'name'}
            value={name}
            onInputChange={this.onInputChange}
            theme={theme}
          />
          <Input
            type={'post'}
            value={post}
            onInputChange={this.onInputChange}
            theme={theme}
          />

          {post.place_id ? (
            <Input
              type={'local'}
              value={isLocal}
              onInputChange={this.onInputChange}
              theme={theme}
            />
          ) : null}
          <Input
            type={'password'}
            value={password}
            onInputChange={this.onInputChange}
            theme={theme}
          />
          <Input
            type={'duration'}
            value={duration}
            onInputChange={this.onInputChange}
            theme={theme}
          />
          <ActivityIndicator animating={loading} color={'grey'} />
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
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    createCheckIn: data => dispatch(createCheckIn(data)),
    userLogout: () => dispatch(userLogout()),
    getGroupCheckIn: data => dispatch(getGroupCheckIn(data)),
    cleanCheckIn: () => dispatch(cleanCheckIn()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckInSetting);
