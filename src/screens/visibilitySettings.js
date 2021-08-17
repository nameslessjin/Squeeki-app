import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import ToggleSetting from '../components/userSetting/toggleSetting';
import {updateVisibilities} from '../actions/auth';
import {getTheme} from '../utils/theme';

class VisibilitySettings extends React.Component {
  state = {
    visibility_all: false,
    visibility_group_search: false,
    visibility_chat_search: false,
    visibility_post_at: false,
    visibility_chat_at: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation, auth} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Visibility',
      headerStyle: theme.backgroundColor,
      headerTintColor: theme.textColor.color,
    });
    this.setState({
      ...auth.user.visibilities,
    });
  }


  componentWillUnmount() {
    if (this.checkUpdates()) {
      this.updateVisibility();
    }
  }

  checkUpdates = () => {
    const {
      visibility_all,
      visibility_group_search,
      visibility_chat_search,
      visibility_post_at,
      visibility_chat_at,
    } = this.props.auth.user.visibilities;

    // check if visibility settings updated
    if (visibility_all != this.state.visibility_all) {
      return true;
    }
    if (visibility_group_search != this.state.visibility_group_search) {
      return true;
    }
    if (visibility_chat_search != this.state.visibility_chat_search) {
      return true;
    }
    if (visibility_post_at != this.state.visibility_post_at) {
      return true;
    }
    if (visibility_chat_at != this.state.visibility_chat_at) {
      return true;
    }

    return false;
  };

  updateVisibility = async () => {
    const {updateVisibilities, auth} = this.props;
    const request = {
      token: auth.token,
      ...this.state,
    };

    const req = await updateVisibilities(request);
    if (req.errors) {
      console.log(req.errors[0]);
      alert('Update notifications failed, please try again later.');
      return;
    }
  };

  onToggle = type => {
    if (type == 'visibility_all') {
      this.setState(prevState => ({visibility_all: !prevState.visibility_all}));
    } else if (type == 'visibility_chat_search') {
      this.setState(prevState => ({
        visibility_chat_search: !prevState.visibility_chat_search,
      }));
    } else if (type == 'visibility_group_search') {
      this.setState(prevState => ({
        visibility_group_search: !prevState.visibility_group_search,
      }));
    } else if (type == 'visibility_post_at') {
      this.setState(prevState => ({
        visibility_post_at: !prevState.visibility_post_at,
      }));
    } else if (type == 'visibility_chat_at') {
      this.setState(prevState => ({
        visibility_chat_at: !prevState.visibility_chat_at,
      }));
    }
  };

  render() {
    const {
      visibility_all,
      visibility_chat_search,
      visibility_group_search,
      visibility_post_at,
      visibility_chat_at,
      theme,
    } = this.state;

    return (
      <TouchableWithoutFeedback>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={[styles.container, theme.greyArea]}>
          <ToggleSetting
            on={visibility_all}
            disabled={false}
            onToggle={this.onToggle}
            type={'visibility_all'}
            theme={theme}
          />
          <ToggleSetting
            on={visibility_chat_search}
            disabled={!visibility_all}
            onToggle={this.onToggle}
            type={'visibility_chat_search'}
            theme={theme}
          />
          <ToggleSetting
            on={visibility_group_search}
            disabled={!visibility_all}
            onToggle={this.onToggle}
            type={'visibility_group_search'}
            theme={theme}
          />
          {/* <ToggleSetting
            on={visibility_chat_at}
            disabled={!visibility_all}
            onToggle={this.onToggle}
            type={'visibility_chat_at'}
          />
          <ToggleSetting
            on={visibility_post_at}
            disabled={!visibility_all}
            onToggle={this.onToggle}
            type={'visibility_post_at'}
          /> */}
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
    updateVisibilities: data => dispatch(updateVisibilities(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisibilitySettings);
