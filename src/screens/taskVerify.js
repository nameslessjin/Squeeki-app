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
import AddOrModify from '../components/postSetting/addOrModifyPost';
import {createUpdateTaskVerify} from '../actions/post';

class TaskVerify extends React.Component {
  state = {
    content: '',
    image: null,
    contentKeyboard: true,
    create: true,
    postId: '',
    modalVisible: false,
    loading: false,
    ...this.props.route.params,
  };

  componentDidMount() {
    const {navigation, route} = this.props;
    navigation.setOptions({
      headerTitle: 'Verify Completion',
      headerRight: () => (
        <AddOrModify
          update={false}
          onPress={this.createOrUpdate}
          loading={this.state.loading}
        />
      ),
      headerBackTitleVisible: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      this.props.navigation.setOptions({
        headerRight: () => (
          <AddOrModify
            update={this.validation(prevState)}
            onPress={this.createOrUpdate}
            loading={this.state.loading}
          />
        ),
      });
    }
  }

  validation = prevState => {
    const {image, content} = this.state;

    if (content.length > 255 || content.length == 0) {
      return false;
    }

    if (content != prevState.content || image != prevState.image) {
      return true;
    }
  };

  createOrUpdate = async () => {
    const {auth, navigation, createUpdateTaskVerify} = this.props;
    const {content, image, postId} = this.state;

    const request = {
      token: auth.token,
      content,
      postId,
      image,
    };

    this.setState({loading: true});
    const req = await createUpdateTaskVerify(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot upload verification at this time, please try again later');
      this.setState({loading: false});
      return;
    }

    navigation.goBack();
  };

  onAddMediaPress = () => {
    this.setState({modalVisible: true});
  };

  modifyInput = (value, type) => {
    if (type == 'content') {
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

  onKeyboardInputFocus = () => {
    this.setState({contentKeyboard: true});
  };

  onBackdropPress = () => {
    this.setState({contentKeyboard: false, modalVisible: false});
    Keyboard.dismiss();
  };

  render() {
    const {
      image,
      contentKeyboard,
      content,
      modalVisible,
      respondentId,
      taskResponse
    } = this.state;
    const isSelf = respondentId == this.props.auth.user.id;
    const disabled = taskResponse == 'verified' || !isSelf

    return (
      <TouchableWithoutFeedback onPress={this.onBackdropPress}>
        <ScrollView style={styles.scroll} bounces={false}>
          <KeyboardAvoidingView style={styles.container}>
            <InputImage
              image={image}
              contentKeyboard={contentKeyboard}
              onPress={this.onAddMediaPress}
              disabled={disabled}
            />
            <InputContent
              content={content}
              modifyInput={this.modifyInput}
              onKeyboardInputFocus={this.onKeyboardInputFocus}
              type={'verify'}
              disabled={disabled}
            />

            <View style={styles.emptySpace} />

            <ImageModal
              modalVisible={modalVisible}
              onBackdropPress={this.onBackdropPress}
              onChangeMedia={this.modifyInput}
              type={'image'}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
  },
  emptySpace: {
    width: '100%',
    height: 350,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    createUpdateTaskVerify: data => dispatch(createUpdateTaskVerify(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskVerify);
