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
} from 'react-native';

import SignInTextInput from '../components/signin/textinput';
import SignInButton from '../components/signin/button';
import validator from 'validator';
import {connect} from 'react-redux';
import {signin} from '../actions/auth';

const {height} = Dimensions.get('screen');

class SignIn extends React.Component {
  state = {
    email: '',
    password: '',
    errorText: '',
    loading: false,
  };

  componentDidMount() {
    const {auth} = this.props;
    if (auth.token) {
      this.setState({loading: true});
      this.login(false);
    }
  }

  onChangeText = (type, text) => {
    if (type == 'Password') {
      this.setState({password: text});
    } else {
      this.setState({email: text.toLowerCase()});
    }
  };

  validation = () => {
    const {email, password} = this.state;
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
    return true;
  };

  onPress = async type => {
    Keyboard.dismiss();
    this.setState({errorText: ''});
    if (type == 'signin') {
      if (!this.validation()) {
        return;
      }
      this.login(true);
    } else if (type == 'forget_password') {
      this.props.navigation.navigate('ForgetPassword');
    } else {
      this.props.navigation.navigate('SignUp');
    }
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
        signInResult.errors[0].message == 'Username and password do not match'
      ) {
        this.setState({errorText: 'Username and password do not match'});
      } else {
        this.setState({
          errorText: 'Please update to the lastest version of Squeeki',
        });
      }

      return;
    }
    this.setState({errorText: ''});
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  render() {
    const {email, password, errorText, loading} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <StatusBar barStyle={'dark-content'} />
          <Text style={styles.squeekiTitle}>Squeeki</Text>
          <Text style={{color: 'red'}}>{errorText}</Text>

          <SignInTextInput
            type={'Email'}
            onChangeText={this.onChangeText}
            value={email}
          />
          <SignInTextInput
            type={'Password'}
            onChangeText={this.onChangeText}
            value={password}
          />

          {loading ? (
            <View style={{marginTop: 15}}>
              <ActivityIndicator animating={true} color={'grey'}/>
              <Text>Connecting ...</Text>
            </View>
          ) : (
            <SignInButton type={'signin'} onPress={this.onPress} />
          )}
          <SignInButton type={'signup'} onPress={this.onPress} />
          <SignInButton type={'forget_password'} onPress={this.onPress} />
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
    marginTop: height * 0.25,
    color: '#EA2027',
    marginBottom: 10,
  },
  textDisplay: {
    color: '#c8d6e5',
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    signIn: data => dispatch(signin(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
