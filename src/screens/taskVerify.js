import React from 'react';
import {
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import InputContent from '../components/postSetting/inputContent';
import InputImage from '../components/postSetting/inputImage';
import ImageModal from '../components/postSetting/postSettingModal';
import AddOrModify from '../components/postSetting/addOrModifyPost';
import {createUpdateTaskVerify, manageUserTaskResponse} from '../actions/post';

class TaskVerify extends React.Component {
  state = {
    content: '',
    image: null,
    contentKeyboard: true,
    create: true,
    postId: '',
    modalVisible: false,
    loading: false,
    change: null,
    ...this.props.route.params,
  };

  componentDidMount() {
    const {navigation, auth} = this.props;
    const {respondentId, taskResponse} = this.state;
    const isSelf = respondentId == auth.user.id;
    const disabled = taskResponse == 'completed' || !isSelf;

    navigation.setOptions({
      headerTitle: 'Verification',
      headerRight: disabled
        ? null
        : () => (
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
      const {navigation, auth} = this.props;
      const {respondentId, taskResponse} = this.state;
      const isSelf = respondentId == auth.user.id;
      const disabled = taskResponse == 'completed' || !isSelf;

      navigation.setOptions({
        headerRight: disabled
          ? null
          : () => (
              <AddOrModify
                update={this.validation(prevState)}
                onPress={this.createOrUpdate}
                loading={this.state.loading}
              />
            ),
      });
    }
  }

  componentWillUnmount() {
    const {prevRoute} = this.state;

    if (prevRoute == 'TaskManagement') {
      // reload the list
      this.props.navigation.navigate('TaskManagement', {
        change: this.state.change,
      });
    }
  }

  validation = prevState => {
    const {image, content, create} = this.state;

    if (content.length > 255 || content.length == 0) {
      return false;
    }

    if (!create) {
      if (content != prevState.content || image != prevState.image) {
        return true;
      }
      return false;
    }

    return true;
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

  onPress = async type => {
    const {respondentId, postId} = this.state;
    const {auth, manageUserTaskResponse} = this.props;
    const request = {
      postId,
      token: auth.token,
      respondentId,
      type,
    };

    const req = await manageUserTaskResponse(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Verify error');
      return;
    }

    // update task response on user or reload the list
    this.setState({
      taskResponse: type,
      change: {respondentId, taskResponse: type},
    });
  };

  render() {
    const {
      image,
      contentKeyboard,
      content,
      modalVisible,
      respondentId,
      taskResponse,
    } = this.state;
    const isSelf = respondentId == this.props.auth.user.id;
    const disabled = taskResponse == 'completed' || !isSelf;
    console.log(image)

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

            {isSelf ||
            taskResponse == 'completed' ||
            taskResponse == 'deny' ? null : (
              <View style={[styles.button, {marginTop: 30}]}>
                <TouchableOpacity onPress={() => this.onPress('completed')}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}

            {isSelf ||
            taskResponse == 'completed' ||
            taskResponse == 'deny' ? null : (
              <View style={styles.button}>
                <TouchableOpacity onPress={() => this.onPress('deny')}>
                  <Text style={[styles.buttonText, {color: '#EA2027'}]}>
                    Deny
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {taskResponse == 'completed' || taskResponse == 'deny' ? (
              <View style={[styles.button, {marginTop: 30}]}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        taskResponse == 'completed' ? '#1e90ff' : '#EA2027',
                    },
                  ]}>
                  {taskResponse == 'completed'
                    ? 'Completed'
                    : taskResponse == 'deny'
                    ? 'Denied'
                    : null}
                </Text>
              </View>
            ) : null}

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
  buttonText: {
    fontSize: 18,
    color: '#1e90ff',
  },
  button: {
    height: 20,
    marginTop: 15,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    createUpdateTaskVerify: data => dispatch(createUpdateTaskVerify(data)),
    manageUserTaskResponse: data => dispatch(manageUserTaskResponse(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskVerify);
