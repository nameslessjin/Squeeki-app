import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import RankFunction from '../components/rankSetting/rankFunction';
import RankSettingModal from '../components/rankSetting/rankSettingModal';
import {updateRankFeatures} from '../actions/group';
import {userLogout} from '../actions/auth';

class RankSetting extends React.Component {
  state = {
    ...this.props.group.group.rank_setting,
    loading: false,
    modalVisible: false,
    type: 'post',
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerTitle: 'Rank Settings',
      headerBackTitleVisible: false,
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
      reward_rank_required,
      modify_member_rank_required
    } = this.state;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      rank_setting: {
        post_rank_required,
        priority_1_rank_required,
        priority_2_rank_required,
        priority_3_rank_required,
        reward_rank_required,
        modify_member_rank_required
      },
    };
    const req =  await updateRankFeatures(request);
    console.log(req)
  };

  validation = () => {
    const {
      post_rank_required,
      priority_1_rank_required,
      priority_2_rank_required,
      priority_3_rank_required,
      reward_rank_required,
      modify_member_rank_required
    } = this.state;
    const {rank_setting} = this.props.group.group;

    if (
      rank_setting.post_rank_required == post_rank_required &&
      rank_setting.priority_1_rank_required == priority_1_rank_required &&
      rank_setting.priority_2_rank_required == priority_2_rank_required &&
      rank_setting.priority_3_rank_required == priority_3_rank_required &&
      rank_setting.reward_rank_required == reward_rank_required &&
      rank_setting.modify_member_rank_required == modify_member_rank_required
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
    } else if (type == 'reward') {
      this.setState({reward_rank_required: value});
    } else if (type == 'member'){
      this.setState({modify_member_rank_required: value})
    }
  };

  render() {
    const {
      post_rank_required,
      priority_1_rank_required,
      priority_2_rank_required,
      priority_3_rank_required,
      reward_rank_required,
      modify_member_rank_required,
      modalVisible,
      type,
    } = this.state;
    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView>
          <StatusBar barStyle={'dark-content'} />
          <RankFunction
            type={'post'}
            value={post_rank_required}
            onPress={this.onPress}
          />
          <RankFunction
            type={'priority1'}
            value={priority_1_rank_required}
            onPress={this.onPress}
          />
          <RankFunction
            type={'priority2'}
            value={priority_2_rank_required}
            onPress={this.onPress}
          />
          <RankFunction
            type={'priority3'}
            value={priority_3_rank_required}
            onPress={this.onPress}
          />
          <RankFunction
            type={'reward'}
            value={reward_rank_required}
            onPress={this.onPress}
          />
          <RankFunction
            type={'member'}
            value={modify_member_rank_required}
            onPress={this.onPress}
          />
          <RankSettingModal
            modalVisible={modalVisible}
            onBackdropPress={this.onBackdropPress}
            onRankChange={this.onRankChange}
            type={type}
          />
        </KeyboardAvoidingView>
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
