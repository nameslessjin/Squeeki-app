import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SignInTextInput from '../components/signin/textinput';
import SignInButton from '../components/signin/button';
import validator from 'validator';
import {connect} from 'react-redux';
import {signin, getDefaultIcon, signup} from '../actions/auth';
import {singleDefaultIcon} from '../utils/defaultIcon';
import SignUpModal from '../components/signup/signupModal';

const {height} = Dimensions.get('screen');

class SignIn extends React.Component {
  state = {
    email: '',
    password: '',
    errorText: '',
    loading: false,
    haveAccount: false,
    username: '',
    icon: {
      uri: 'https://storage.googleapis.com/squeeki-imgs/defaultIcons/p1.png',
    },
    modalVisible: false,
    defaultIcons: [],
  };

  componentDidMount() {
    // this.getDeviceId();
    this.getDefaultIcon();
  }

  getDefaultIcon = () => {
    this.props
      .getDefaultIcon()
      .then(defaultIcons => {
        this.setState({defaultIcons});
      })
      .catch(err => console.log(err));
  };

  onChangeText = (type, text) => {
    if (type == 'Password') {
      this.setState({password: text});
    } else if (type == 'Email') {
      this.setState({email: text.trim().toLowerCase()});
    } else if (type == 'username') {
      this.setState({username: text.trim()});
    } else if (type == 'haveAccount' || type == 'haveNoAccount') {
      console.log('here');
      this.setState(prevState => ({
        haveAccount: !prevState.haveAccount,
        username: '',
        email: '',
        password: '',
        errorText: '',
      }));
    }
  };

  validation = () => {
    const {email, password, username, haveAccount} = this.state;

    if (haveAccount) {
      if (!validator.isEmail(email)) {
        this.setState({errorText: 'Invalid email address'});
        return false;
      }

      if (!validator.isLength(password, {min: 8})) {
        this.setState({
          errorText:
            'Password must be at least 8 character long and contains numbers and characters',
        });
        return false;
      }
    } else {
      // username must only include characters besides a-z, A-Z, 0-9 and _
      // username must include at least one character
      // username must not include keyboard admin and squeeki
      // username length must be at least 4 and no greater than 30
      if (
        username.search(/^[a-zA-Z0-9_]+$/) === -1 ||
        username.search(/[a-zA-Z]+/) === -1 ||
        username.toLowerCase().search('admin') != -1 ||
        username.toLowerCase().search('squeeki') != -1 ||
        username.length < 4 ||
        username.length > 30
      ) {
        this.setState({
          errorText:
            'Username must only contain alphabet, numbers and underscore.  It must be at least 4 characters long and up tp 30 characters.  Squeeki or admin cannot be used in username',
        });
        return false;
      }
    }
    return true;
  };

  onPress = async type => {
    Keyboard.dismiss();
    this.setState({errorText: ''});
    const {haveAccount} = this.state;
    if (type == 'signin') {
      if (!this.validation()) {
        return;
      }
      if (haveAccount) {
        this.login(true);
      } else {
        this.signup();
      }
    } else if (type == 'forget_password') {
      this.props.navigation.navigate('ForgetPassword');
    }
    // else {
    //   this.props.navigation.navigate('SignUp');
    // }
  };

  login = async init => {
    const {email, password} = this.state;
    const data = {
      email: init ? email : null,
      password: init ? password : null,
      token: init ? null : this.props.auth.token,
    };

    let signInResult = 0;
    try {
      this.setState({loading: true});
      signInResult = await this.props.signIn(data);
      this.setState({loading: false});
    } catch (err) {
      this.setState({
        errorText: 'Timed out.  Please try again later.',
        loading: false,
      });
      return;
    }

    if (signInResult.errors) {
      console.log({errorText: signInResult.errors[0].message});
      if (
        signInResult.errors[0].message ==
          'Username/Email and password do not match' ||
        signInResult.errors[0].message == 'User not found'
      ) {
        this.setState({errorText: signInResult.errors[0].message});
      } else {
        this.setState({
          errorText: 'Cannot login please check your email and password',
        });
      }

      return;
    }
    this.setState({errorText: ''});
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'HomeTabNavigator'}],
    });
  };

  signup = async () => {
    const {username, icon} = this.state;
    const {signup, navigation} = this.props;
    if (!this.validation()) {
      return;
    }

    const deviceId = await DeviceInfo.getUniqueId();

    const request = {
      username,
      icon,
      deviceId,
    };

    this.setState({loading: true});
    const req = await signup(request);
    this.setState({loading: false});

    if (req.errors) {
      console.log(req.errors);
      this.setState({errorText: req.errors[0].message});
      return;
    }

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeTabNavigator'}],
      });
    });
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onDefaultIconPress = url => {
    this.setState({icon: {uri: url}});
    this.onBackdropPress();
  };

  onTermsPressed = () => {
    const {navigation} = this.props;
    navigation.navigate('Terms');
  };

  render() {
    const {
      email,
      password,
      errorText,
      loading,
      haveAccount,
      username,
      modalVisible,
      icon,
      defaultIcons,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <Text style={styles.squeekiTitle}>Squeeki</Text>
          <Text style={{color: 'red', padding: 5}}>{errorText}</Text>

          {haveAccount ? (
            <SignInTextInput
              type={'Email'}
              onChangeText={this.onChangeText}
              value={email}
            />
          ) : (
            <TouchableOpacity
              style={styles.imageStyle}
              onPress={() => this.setState({modalVisible: true})}>
              <Image
                source={icon ? {uri: icon.uri} : singleDefaultIcon()}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
          )}

          {haveAccount ? (
            <SignInTextInput
              type={'Password'}
              onChangeText={this.onChangeText}
              value={password}
            />
          ) : (
            <SignInTextInput
              type={'username'}
              onChangeText={this.onChangeText}
              value={username}
            />
          )}

          {loading ? (
            <View style={{marginTop: 15}}>
              <ActivityIndicator animating={true} color={'grey'} />
              <Text>Connecting ...</Text>
            </View>
          ) : (
            <SignInButton type={'signin'} onPress={this.onPress} />
          )}
          {/* <SignInButton type={'signup'} onPress={this.onPress} /> */}

          <SignInButton
            type={haveAccount ? 'haveAccount' : 'haveNoAccount'}
            onPress={this.onChangeText}
          />

          {haveAccount ? (
            <SignInButton type={'forget_password'} onPress={this.onPress} />
          ) : (
            <View style={styles.term}>
              <Text style={styles.text}>By signning up, you agree to</Text>
              <TouchableOpacity
                style={styles.termButton}
                onPress={this.onTermsPressed}>
                <Text style={styles.text}>Terms and Conditions</Text>
              </TouchableOpacity>
            </View>
          )}

          <SignUpModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onChangeMedia={this.setIcon}
            defaultIcons={defaultIcons}
            onDefaultIconPress={this.onDefaultIconPress}
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
    height: height,
    width: '100%',
    backgroundColor: '#ffffff',
  },

  squeekiTitle: {
    fontSize: 60,
    fontFamily: 'Jellee-Roman',
    marginTop: height * 0.2,
    color: '#EA2027',
    marginBottom: 10,
  },
  textDisplay: {
    color: '#c8d6e5',
  },
  imageStyle: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    alignItems: 'center',
    justifyContent: 'center',
  },
  term: {
    marginTop: 30,
    alignItems: 'center',
  },
  text: {
    color: '#b2bec3',
  },
  termButton: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#b2bec3',
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: data => dispatch(signin(data)),
    getDefaultIcon: data => dispatch(getDefaultIcon()),
    signup: data => dispatch(signup(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
