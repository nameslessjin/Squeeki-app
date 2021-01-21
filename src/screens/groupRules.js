import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';

class GroupRules extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 10
    }
})

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupRules);
