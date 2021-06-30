import React from 'react';
import {
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import InputContent from '../components/postSetting/inputContent';
import InputImage from '../components/postSetting/inputImage';
import ImageModal from '../components/postSetting/postSettingModal';

class TaskVerify extends React.Component {
  state = {
    content: '',
    image: null,
    contentKeyboard: false,
    create: true,
    postId: '',
    ...this.props.route.params,
  };

  modifyInput = (value, type) => {
    if (type == ' content') {
      this.setState({
        contentKeyboard: true,
        content: value,
      });
    } else if (type == 'image') {
      this.setState({
        contentKeyboard: false,
        modalVisible: false,
        image: {...value},
      });
    }
  };

  render() {
    return <TouchableWithoutFeedback />;
  }
}

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskVerify);
