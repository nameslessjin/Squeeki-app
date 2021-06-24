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
    notification_all: true,
    notification_group: true,
    notification_post_like: true,
    notification_post_comment: true,
    notification_post_mention: true,
    notification_comment_like: true,
    notification_comment_reply: true,
    notification_comment_mention: true,
    notification_chat: true,
    notification_chat_message: true,
    notification_chat_mention: true,
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
      notification_post_mention,
      notification_comment_like,
      notification_comment_reply,
      notification_comment_mention,
      notification_chat,
      notification_chat_message,
      notification_chat_mention,
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
    if (notification_post_mention != this.state.notification_post_mention) {
      return true;
    }
    if (notification_comment_like != this.state.notification_comment_like) {
      return true;
    }
    if (notification_comment_reply != this.state.notification_comment_reply) {
      return true;
    }
    if (
      notification_comment_mention != this.state.notification_comment_mention
    ) {
      return true;
    }
    if (notification_chat != this.state.notification_chat) {
      return true;
    }
    if (notification_chat_message != this.state.notification_chat_message) {
      return true;
    }
    if (notification_chat_mention != this.state.notification_chat_mention) {
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
    if (type == 'notification_all') {
      this.setState(prevState => ({
        notification_all: !prevState.notification_all,
      }));
    } else if (type == 'notification_group') {
      this.setState(prevState => ({
        notification_group: !prevState.notification_group,
      }));
    } else if (type == 'notification_post_like') {
      this.setState(prevState => ({
        notification_post_like: !prevState.notification_post_like,
      }));
    } else if (type == 'notification_post_comment') {
      this.setState(prevState => ({
        notification_post_comment: !prevState.notification_post_comment,
      }));
    } else if (type == 'notification_post_mention') {
      this.setState(prevState => ({
        notification_post_mention: !prevState.notification_post_mention,
      }));
    } else if (type == 'notification_comment_like') {
      this.setState(prevState => ({
        notification_comment_like: !prevState.notification_comment_like,
      }));
    } else if (type == 'notification_comment_reply') {
      this.setState(prevState => ({
        notification_comment_reply: !prevState.notification_comment_reply,
      }));
    } else if (type == 'notification_comment_mention') {
      this.setState(prevState => ({
        notification_comment_mention: !prevState.notification_comment_mention,
      }));
    } else if (type == 'notification_chat') {
      this.setState(prevState => ({
        notification_chat: !prevState.notification_chat,
      }));
    } else if (type == 'notification_chat_message') {
      this.setState(prevState => ({
        notification_chat_message: !prevState.notification_chat_message,
      }));
    } else if (type == 'notification_chat_mention') {
      this.setState(prevState => ({
        notification_chat_mention: !prevState.notification_chat_mention,
      }));
    }
  };

  render() {
    const {
      notification_all,
      notification_group,
      notification_post_like,
      notification_post_comment,
      notification_post_mention,
      notification_comment_like,
      notification_comment_reply,
      notification_comment_mention,
      notification_chat,
      notification_chat_message,
      notification_chat_mention,
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
            type={'notification_all'}
          />
          <ToggleSetting
            on={notification_group}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_group'}
          />
          <ToggleSetting
            on={notification_post_like}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_post_like'}
          />
          <ToggleSetting
            on={notification_post_comment}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_post_comment'}
          />
          <ToggleSetting
            on={notification_post_mention}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_post_mention'}
          />
          <ToggleSetting
            on={notification_comment_like}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_comment_like'}
          />
          <ToggleSetting
            on={notification_comment_reply}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_comment_reply'}
          />
          {/* <ToggleSetting
            on={notification_comment_mention}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_comment_mention'}
          /> */}
          <ToggleSetting
            on={notification_chat}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_chat'}
          />
          <ToggleSetting
            on={notification_chat_message}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_chat_message'}
          />
          <ToggleSetting
            on={notification_chat_mention}
            disabled={!notification_all}
            onToggle={this.onToggle}
            type={'notification_chat_mention'}
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
