import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import ToggleSetting from '../components/userSetting/toggleSetting';
import {connect} from 'react-redux';
import {updateNotifications} from '../actions/auth';

class NotificationSettings extends React.Component {
  state = {
    ...this.props.auth.user.notifications,
    notification_all: false,
    notification_group: false,
    notification_post_like: false,
    notification_post_comment: false,
    notification_comment_like: false,
    notification_comment_reply: false,
    notification_chat: false,
  };

  componentDidMount() {
    const {navigation, auth} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Notifications',
    });
    this.setState({
      ...auth.user.notifications,
    });
  }

  componentWillUnmount() {
    // if updates occurs, update on server
    if (this.checkUpdates()) {
        this.updateNotifications();
    }
  }

  checkUpdates = () => {
    const {
      notification_all,
      notification_group,
      notification_post_like,
      notification_post_comment,
      notification_comment_like,
      notification_comment_reply,
      notification_chat,
    } = this.props.auth.user.notifications;

    // check if notification settings updated
    if (notification_all != this.state.notification_all) {
      return true;
    }
    if (notification_group != this.state.notification_group) {
      return true;
    }
    if (notification_post_like != this.state.notification_post_like) {
      return true;
    }
    if (notification_post_comment != this.state.notification_post_comment) {
      return true;
    }
    if (notification_comment_like != this.state.notification_comment_like) {
      return true;
    }
    if (notification_comment_reply != this.state.notification_comment_reply) {
      return true;
    }
    if (notification_chat != this.state.notification_chat) {
      return true;
    }

    return false;
  };

  updateNotifications = async () => {
    const {updateNotifications, auth} = this.props;
    const request = {
      token: auth.token,
      ...this.state,
    };

    const req = await updateNotifications(request);
    if (req.errors) {
      console.log(req.errors[0]);
      alert('Update notifications failed, please try again later.');
      return;
    }
  };

  onToggle = type => {
    if (type == 'all') {
      this.setState(prevState => ({
        notification_all: !prevState.notification_all,
      }));
    } else if (type == 'groups') {
      this.setState(prevState => ({
        notification_group: !prevState.notification_group,
      }));
    } else if (type == 'post_like') {
      this.setState(prevState => ({
        notification_post_like: !prevState.notification_post_like,
      }));
    } else if (type == 'post_comment') {
      this.setState(prevState => ({
        notification_post_comment: !prevState.notification_post_comment,
      }));
    } else if (type == 'comment_like') {
      this.setState(prevState => ({
        notification_comment_like: !prevState.notification_comment_like,
      }));
    } else if (type == 'comment_reply') {
      this.setState(prevState => ({
        notification_comment_reply: !prevState.notification_comment_reply,
      }));
    } else if (type == 'chats') {
      this.setState(prevState => ({
        notification_chat: !prevState.notification_chat,
      }));
    }
  };

  render() {
    const {
      notification_all,
      notification_group,
      notification_post_like,
      notification_post_comment,
      notification_comment_like,
      notification_comment_reply,
      notification_chat,
    } = this.state;

    return (
      <TouchableWithoutFeedback>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          <ToggleSetting
            on={notification_all}
            disabled={false}
            onToggle={this.onToggle}
            type={'all'}
          />
          <ToggleSetting
            on={notification_group}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'groups'}
          />
          <ToggleSetting
            on={notification_post_like}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'post_like'}
          />
          <ToggleSetting
            on={notification_post_comment}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'post_comment'}
          />
          <ToggleSetting
            on={notification_comment_like}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'comment_like'}
          />
          <ToggleSetting
            on={notification_comment_reply}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'comment_reply'}
          />
          <ToggleSetting
            on={notification_chat}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'chats'}
          />
          <View style={styles.textViewContainer}>
            <Text style={styles.text}>
              Having trouble receiving notifications? Check if notifications are
              enabled in the settings app.
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  textViewContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 3,
  },
  text: {
    fontSize: 12,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    updateNotifications: data => dispatch(updateNotifications(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettings);
