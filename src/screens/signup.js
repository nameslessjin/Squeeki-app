import React from 'react';
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {signup, signin, getDefaultIcon} from '../actions/auth';
import validator from 'validator';
import SignUpTextInput from '../components/signup/textinput';
import SignUpButton from '../components/signup/button';
import {singleDefaultIcon} from '../utils/defaultIcon';
import SignUpModal from '../components/signup/signupModal'

const {height} = Dimensions.get('screen');

class SignUp extends React.Component {
  state = {
    email: '',
    password: '',
    rePassword: '',
    referCode: '',
    username: '',
    errorText: '',
    icon: {
      uri: 'https://storage.googleapis.com/squeeki-imgs/defaultIcons/p1.png',
    },
    loading: false,
    modalVisible: false,
    defaultIcons: [],
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Sign Up',
    });
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
      this.setState({email: text.toLowerCase()});
    } else if (type == 'RePassword') {
      this.setState({rePassword: text});
    } else if (type == 'Username') {
      this.setState({username: text.trim()});
    } else {
      this.setState({referCode: text});
    }
  };

  validation = () => {
    const {email, password, rePassword, username} = this.state;
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
          'Username must only contain alphabet, numbers and underscore.  It must be at least 4 characters long and up tp 30 characters.',
      });
      return false;
    }

    if (!validator.equals(password, rePassword)) {
      this.setState({errorText: 'Password mismatch'});
      return false;
    }
    return true;
  };

  setIcon = (data, type) => {
    this.setState({icon: data, modalVisible: false});
  };

  onPress = async () => {
    const {email, password, referCode, username, icon} = this.state;

    if (!this.validation()) {
      return;
    }

    const data = {
      email: email,
      password: password,
      username: username,
      icon: icon,
      refer_code: referCode,
    };

    this.setState({loading: true});
    const signUpResult = await this.props.signUp(data);
    this.setState({loading: false});
    if (signUpResult.errors) {
      this.setState({errorText: signUpResult.errors[0].message});
      return;
    }

    setTimeout(() => {
      this.props.navigation.reset({
        index: 0,
        routes: [{name: 'HomeTabNavigator'}],
      });
    }, 500);
  };

  onTermsPressed = () => {
    const {navigation} = this.props;
    navigation.navigate('Terms');
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onDefaultIconPress = url => {
    this.setState({icon: {uri: url}});
    this.onBackdropPress();
  };

  render() {
    const {
      email,
      password,
      rePassword,
      referCode,
      errorText,
      username,
      icon,
      loading,
      modalVisible,
      defaultIcons
    } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{width: '100%', height: '100%', backgroundColor: 'white'}}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <Text style={{color: 'red', marginVertical: 5}}>{errorText}</Text>
            <TouchableOpacity
              style={styles.imageStyle}
              onPress={() => this.setState({modalVisible: true})}>
              <Image
                source={icon ? {uri: icon.uri} : singleDefaultIcon()}
                style={styles.imageStyle}
              />
            </TouchableOpacity>
            <SignUpTextInput
              type={'Email'}
              onChangeText={this.onChangeText}
              value={email}
            />
            <SignUpTextInput
              type={'Username'}
              onChangeText={this.onChangeText}
              value={username}
            />
            <SignUpTextInput
              type={'Password'}
              onChangeText={this.onChangeText}
              value={password}
            />
            <SignUpTextInput
              type={'RePassword'}
              onChangeText={this.onChangeText}
              value={rePassword}
            />
            {loading ? (
              <ActivityIndicator
                animating={true}
                style={{marginTop: 20}}
                color={'grey'}
              />
            ) : (
              <SignUpButton onPress={this.onPress} />
            )}
            <View style={styles.term}>
              <Text>By signning up, you agree to</Text>
              <TouchableOpacity
                style={styles.termButton}
                onPress={this.onTermsPressed}>
                <Text style={styles.text}>Terms and Conditions</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <SignUpModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onChangeMedia={this.setIcon}
            defaultIcons={defaultIcons}
            onDefaultIconPress={this.onDefaultIconPress}
          />
          <View style={styles.empty}/>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 5,
    height: height,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
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
  empty: {
    width: '100%',
    height: 200
  }
});

const mapDispatchToProps = dispatch => {
  return {
    signUp: data => dispatch(signup(data)),
    signin: data => dispatch(signin(data)),
    getDefaultIcon: () => dispatch(getDefaultIcon()),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(SignUp);
