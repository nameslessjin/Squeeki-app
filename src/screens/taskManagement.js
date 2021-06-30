import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {getPostTaskResponse} from '../actions/post';
import TaskResponseList from '../components/taskManagement/taskResponseList';

class TaskManagement extends React.Component {
  state = {
    loading: false,
    taskResponse: [],
    count: 0,
    postId: '',
    ...this.props.route.params,
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Task Management'
    });
    this.loadParticipants(true)
  }

  loadParticipants = async init => {
    const {auth, getPostTaskResponse} = this.props;
    const {postId, count} = this.state;

    const request = {
      token: auth.token,
      count,
      postId,
    };

    const req = await getPostTaskResponse(request);
    if (req.error) {
      console.log(req.errors[0]);
      alert('load response error, please try again later');
      return;
    }

    this.setState(prevState => {
      return {
        taskResponse: init
          ? req.response
          : prevState.taskResponse.concat(req.taskResponse),
        count: req.count,
      };
    });
  };

  onEndReached = () => {
    this.setState({loading: true});

    this.setState({loading: false});
  };

  render() {
    const {taskResponse} = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <TaskResponseList taskResponse={taskResponse} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    padding: 10,
    backgroundColor: 'white'
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getPostTaskResponse: data => dispatch(getPostTaskResponse(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskManagement);
