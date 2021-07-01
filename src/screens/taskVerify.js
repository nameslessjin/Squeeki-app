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

    if (content != prevState.content || image != prevState) {
      return true;
    }
  };

  createOrUpdate = async() => {
    const {auth, navigation} = this.props
    const {content, image, postId} = this.state
    

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
    const {image, contentKeyboard, content, create, modalVisible} = this.state;
    console.log(this.state.postId);
    return (
      <TouchableWithoutFeedback onPress={this.onBackdropPress}>
        <ScrollView style={styles.scroll} bounces={false}>
          <KeyboardAvoidingView style={styles.container}>
            <InputImage
              image={image}
              contentKeyboard={contentKeyboard}
              onPress={this.onAddMediaPress}
              create={create}
            />
            <InputContent
              content={content}
              modifyInput={this.modifyInput}
              onKeyboardInputFocus={this.onKeyboardInputFocus}
              type={'verify'}
            />

            <View style={styles.emptySpace} />

            <ImageModal
              modalVisible={modalVisible}
              onBackdropPress={this.onBackdropPress}
              onChangeMedia={this.modifyInput}
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
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskVerify);
