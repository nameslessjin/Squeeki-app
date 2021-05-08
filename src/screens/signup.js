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
} from 'react-native';
import {connect} from 'react-redux';
import {signup, signin} from '../actions/auth';
import validator from 'validator';
import SignUpTextInput from '../components/signup/textinput';
import SignUpButton from '../components/signup/button';

const {height} = Dimensions.get('screen');

class SignUp extends React.Component {
  state = {
    email: '',
    password: '',
    rePassword: '',
    referCode: '',
    username: '',
    errorText: '',
    icon: null,
    loading: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Sign Up',
    });
  }

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

    const regexp = /^[a-zA-Z0-9_]+$/;
    if (
      username.search(regexp) === -1 ||
      username.substring(username.length - 1) == '_' ||
      !validator.isLength(username.trim(), {min: 6, max: 30})
    ) {
      this.setState({
        errorText:
          'Invalid username.  Username needs to be least 6 characters long and cannot contains forbidden characaters',
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
    this.setState({icon: data});
  };

  onPress = async () => {
    const {email, password, referCode, username, icon} = this.state;

    if (!this.validation()) {
      return;
    }
    console.log('Here');

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
        routes: [{name: 'Home'}],
      });
    }, 500);
  };

  onTermsPressed = () => {
    const {navigation} = this.props;
    navigation.navigate('Terms');
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
            <Text style={{color: 'red'}}>{errorText}</Text>
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
    borderBottomColor: '#b2bec3',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    signUp: data => dispatch(signup(data)),
    signin: data => dispatch(signin(data)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(SignUp);
