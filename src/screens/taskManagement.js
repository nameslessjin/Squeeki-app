import React from 'react';
import {StyleSheet, KeyboardAvoidingView} from 'react-native';
import {connect} from 'react-redux';
import {
  getPostTaskResponse,
  getUserTaskVerification,
  manageUserTaskResponse,
} from '../actions/post';
import TaskResponseList from '../components/taskManagement/taskResponseList';
import {getTheme} from '../utils/theme';

class TaskManagement extends React.Component {
  state = {
    loading: false,
    taskResponse: [],
    count: 0,
    postId: '',
    type: 'pending',
    ...this.props.route.params,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Task Management',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
    // this.loadParticipants(true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps != this.props) {
      if (this.props.route.params.change) {
        this.loadParticipants(true, this.state.type);
      }
    }
  }

  componentWillUnmount() {
    const {group, navigation} = this.props;
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'TaskManagement'
      });
    }
  }

  onPress = async (respondentId, type) => {
    const {postId, taskResponse} = this.state;
    const {
      getUserTaskVerification,
      auth,
      navigation,
      manageUserTaskResponse,
    } = this.props;

    const request = {
      postId,
      token: auth.token,
      respondentId,
      type,
    };

    if (type == 'getVerification') {
      const req = await getUserTaskVerification(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Get verification error');
        return;
      }

      navigation.navigate('TaskVerify', {
        postId,
        ...req,
        respondentId: respondentId,
        taskResponse: taskResponse.filter(u => u.userId == respondentId)[0]
          .taskResponse,
        prevRoute: 'TaskManagement',
      });
    } else if (type == 'completed' || type == 'deny') {
      const req = await manageUserTaskResponse(request);
      if (req.errors) {
        console.log(req.errors);
        alert('Verify error');
        return;
      }

      // update task response on user
      this.setState({
        taskResponse: taskResponse.map(t => {
          if (t.userId == respondentId) {
            return {...t, taskResponse: type};
          }
          return t;
        }),
      });
    }
  };

  loadParticipants = async (init, type) => {
    const {auth, getPostTaskResponse} = this.props;
    const {postId, count} = this.state;

    const request = {
      token: auth.token,
      count: init ? 0 : count,
      postId,
      type: type == 'pending' ? 'confirm' : type == 'denied' ? 'deny' : type,
    };

    this.setState({type});

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
          : prevState.taskResponse.concat(req.response),
        count: req.count,
      };
    });
  };

  onEndReached = type => {
    this.setState({loading: true});
    this.loadParticipants(false, type);
    this.setState({loading: false});
  };

  render() {
    const {taskResponse, theme} = this.state;

    return (
      <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
        <TaskResponseList
          taskResponse={taskResponse}
          onPress={this.onPress}
          onEndReached={this.onEndReached}
          loadParticipants={this.loadParticipants}
          theme={theme}
        />
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
    manageUserTaskResponse: data => dispatch(manageUserTaskResponse(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskManagement);
