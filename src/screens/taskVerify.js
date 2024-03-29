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
import {getTheme} from '../utils/theme';

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
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation, auth} = this.props;
    const {respondentId, taskResponse, theme} = this.state;
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
              theme={theme}
            />
          ),
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      const {navigation, auth} = this.props;
      const {respondentId, taskResponse, theme} = this.state;
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
                theme={theme}
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
      const lineCount = value.split(/\r\n|\r|\n/).length;
      const valueSplit = value.substr(0, 255).split('\n');
      if (lineCount >= 15) {
        this.setState({
          contentKeyboard: true,
          content: valueSplit.slice(0, 15).join('\n'),
        });
        return;
      }
      this.setState({
        contentKeyboard: true,
        content: value.substr(0, 255),
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
      theme,
    } = this.state;
    const isSelf = respondentId == this.props.auth.user.id;
    const disabled = taskResponse == 'completed' || !isSelf;

    return (
      <TouchableWithoutFeedback onPress={this.onBackdropPress}>
        <ScrollView
          style={[styles.scroll, theme.backgroundColor]}
          bounces={false}>
          <KeyboardAvoidingView style={[styles.container]}>
            <InputImage
              image={image}
              contentKeyboard={contentKeyboard}
              onPress={this.onAddMediaPress}
              disabled={disabled}
              theme={theme}
            />
            <InputContent
              content={content}
              modifyInput={this.modifyInput}
              onKeyboardInputFocus={this.onKeyboardInputFocus}
              type={'verify'}
              disabled={disabled}
              theme={theme}
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
              theme={theme}
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
