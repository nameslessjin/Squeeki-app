import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedbackBase,
  View,
} from 'react-native';
import {connect} from 'react-redux';

class AdminHome extends React.Component {
  render() {
    return <View />;
  }
}

const mapStateToProps = state => {
  const {auth, metadata} = state;
  return {auth, metadata};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminHome);
