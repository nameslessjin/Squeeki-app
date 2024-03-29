import React from 'react';
import {
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import RankFunction from '../components/rankSetting/rankFunction';
import RankSettingModal from '../components/rankSetting/rankSettingModal';
import {updateRankFeatures} from '../actions/group';
import {userLogout} from '../actions/auth';
import {getTheme} from '../utils/theme';

class RankSetting extends React.Component {
  state = {
    ...this.props.group.group.rank_setting,
    loading: false,
    modalVisible: false,
    type: 'post',
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerTitle: 'Rank Settings',
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentWillUnmount() {
    const {rank} = this.props.group.group.auth;
    // if the auth in group is correct and rank features changed
    if (rank <= 1 && this.validation()) {
      this.updateRankFeatures();
    }
  }

  updateRankFeatures = async () => {
    const {auth, group, updateRankFeatures} = this.props;
    const {
      post_rank_required,
      priority_1_rank_required,
      priority_2_rank_required,
      priority_3_rank_required,
      manage_member_rank_required,
      nominate_rank_required,
      group_setting_rank_required,
      manage_post_rank_required,
      manage_comment_rank_required,
      manage_check_in_rank_required,
      manage_chat_rank_required,
      manage_task_rank_required,
      manage_event_rank_required,
      manage_reward_rank_required,
    } = this.state;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      rank_setting: {
        post_rank_required,
        priority_1_rank_required,
        priority_2_rank_required,
        priority_3_rank_required,
        manage_member_rank_required,
        nominate_rank_required,
        group_setting_rank_required,
        manage_post_rank_required,
        manage_comment_rank_required,
        manage_check_in_rank_required,
        manage_chat_rank_required,
        manage_task_rank_required,
        manage_event_rank_required,
        manage_reward_rank_required,
      },
    };
    const req = await updateRankFeatures(request);
  };

  validation = () => {
    const {
      post_rank_required,
      priority_1_rank_required,
      priority_2_rank_required,
      priority_3_rank_required,
      manage_member_rank_required,
      nominate_rank_required,
      group_setting_rank_required,
      manage_post_rank_required,
      manage_comment_rank_required,
      manage_check_in_rank_required,
      manage_chat_rank_required,
      manage_task_rank_required,
      manage_event_rank_required,
      manage_reward_rank_required,
    } = this.state;
    const {rank_setting} = this.props.group.group;

    if (
      rank_setting.post_rank_required == post_rank_required &&
      rank_setting.priority_1_rank_required == priority_1_rank_required &&
      rank_setting.priority_2_rank_required == priority_2_rank_required &&
      rank_setting.priority_3_rank_required == priority_3_rank_required &&
      rank_setting.manage_member_rank_required == manage_member_rank_required &&
      rank_setting.nominate_rank_required == nominate_rank_required &&
      rank_setting.group_setting_rank_required == group_setting_rank_required &&
      rank_setting.manage_post_rank_required == manage_post_rank_required &&
      rank_setting.manage_comment_rank_required ==
        manage_comment_rank_required &&
      rank_setting.manage_check_in_rank_required ==
        manage_check_in_rank_required &&
      rank_setting.manage_chat_rank_required == manage_chat_rank_required &&
      rank_setting.manage_task_rank_required == manage_task_rank_required &&
      rank_setting.manage_reward_rank_required == manage_reward_rank_required &&
      rank_setting.manage_event_rank_required == manage_event_rank_required
    ) {
      return false;
    }

    return true;
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onPress = type => {
    const {rank} = this.props.group.group.auth;
    if (rank > 1) {
      return null;
    } else {
      this.setState({modalVisible: true, type: type});
    }
  };

  onRankChange = (type, value) => {
    if (type == 'post') {
      this.setState({post_rank_required: value});
    } else if (type == 'priority1') {
      this.setState({priority_1_rank_required: value});
    } else if (type == 'priority2') {
      this.setState({priority_2_rank_required: value});
    } else if (type == 'priority3') {
      this.setState({priority_3_rank_required: value});
    } else if (type == 'member') {
      this.setState({manage_member_rank_required: value});
    } else if (type == 'nominate') {
      this.setState({nominate_rank_required: value});
    } else if (type == 'group') {
      this.setState({group_setting_rank_required: value});
    } else if (type == 'manage_post') {
      this.setState({manage_post_rank_required: value});
    } else if (type == 'manage_comment') {
      this.setState({manage_comment_rank_required: value});
    } else if (type == 'manage_check_in') {
      this.setState({manage_check_in_rank_required: value});
    } else if (type == 'manage_chat') {
      this.setState({manage_chat_rank_required: value});
    } else if (type == 'manage_task') {
      this.setState({manage_task_rank_required: value});
    } else if (type == 'manage_reward') {
      this.setState({manage_reward_rank_required: value});
    } else if (type == 'manage_event') {
      this.setState({manage_event_rank_required: value});
    }
  };

  render() {
    const {
      post_rank_required,
      priority_1_rank_required,
      priority_2_rank_required,
      priority_3_rank_required,
      manage_member_rank_required,
      nominate_rank_required,
      group_setting_rank_required,
      manage_post_rank_required,
      manage_comment_rank_required,
      manage_check_in_rank_required,
      manage_chat_rank_required,
      manage_task_rank_required,
      manage_event_rank_required,
      manage_reward_rank_required,
      modalVisible,
      type,
      theme,
    } = this.state;
    const {rankName} = this.props.group;
    return (
      <TouchableWithoutFeedback>
        <ScrollView
          style={theme.backgroundColor}
          alwaysBounceVertical={false}
          alwaysBounceHorizontal={false}
          showsVerticalScrollIndicator={false}>
          <RankFunction
            type={'group'}
            value={group_setting_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'post'}
            value={post_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'priority1'}
            value={priority_1_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'priority2'}
            value={priority_2_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'priority3'}
            value={priority_3_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'manage_post'}
            value={manage_post_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'manage_reward'}
            value={manage_reward_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'manage_check_in'}
            value={manage_check_in_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'manage_task'}
            value={manage_task_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'manage_event'}
            value={manage_event_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'manage_comment'}
            value={manage_comment_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'manage_chat'}
            value={manage_chat_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'member'}
            value={manage_member_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />
          <RankFunction
            type={'nominate'}
            value={nominate_rank_required}
            onPress={this.onPress}
            rankName={rankName}
            theme={theme}
          />

          <RankSettingModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onRankChange={this.onRankChange}
            type={type}
            rankName={rankName}
            prevRoute={'rankSetting'}
            theme={theme}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    updateRankFeatures: data => dispatch(updateRankFeatures(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RankSetting);
