import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {
  getPostTaskResponse,
  getUserTaskVerification,
  verifyUserTaskCompletion,
} from '../actions/post';
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
      headerTitle: 'Task Management',
    });
    this.loadParticipants(true);
  }

  onPress = async (respondentId, type) => {
    const {postId, taskResponse} = this.state;
    const {
      getUserTaskVerification,
      auth,
      navigation,
      verifyUserTaskCompletion,
    } = this.props;

    const request = {
      postId,
      token: auth.token,
      respondentId,
    };

    if (type == 'getVerification') {
      const req = await getUserTaskVerification(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Get verification error');
        return;
      }

      console.log(taskResponse.filter(u => u.userId == respondentId))

      navigation.navigate('TaskVerify', {
        postId,
        ...req,
        respondentId: respondentId,
        taskResponse: taskResponse.filter(u => u.userId == respondentId)[0].taskResponse,
      });
    } else if (type == 'verifyTaskCompletion') {
      const req = await verifyUserTaskCompletion(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Verify error');
        return;
      }

      // update task response on user
      this.setState({
        taskResponse: taskResponse.map(t => {
          if (t.userId == respondentId) {
            return {...t, taskResponse: 'verified'};
          }
          return t;
        }),
      });
    }
  };

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
    this.loadParticipants(false);
    this.setState({loading: false});
  };

  render() {
    const {taskResponse} = this.state;

    return (
      <KeyboardAvoidingView style={styles.container}>
        <TaskResponseList taskResponse={taskResponse} onPress={this.onPress} />
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
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getPostTaskResponse: data => dispatch(getPostTaskResponse(data)),
    getUserTaskVerification: data => dispatch(getUserTaskVerification(data)),
    verifyUserTaskCompletion: data => dispatch(verifyUserTaskCompletion(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskManagement);
