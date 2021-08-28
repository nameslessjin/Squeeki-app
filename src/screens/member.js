import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import InputRankTitle from '../components/users/members/inputRankTitle';
import {updateMember, deleteMember, makeOwner} from '../actions/user';
import {getSingleGroupById} from '../actions/group';
import {userLogout} from '../actions/auth';
import {getGroupMembers} from '../actions/user';
import {getGroupMembersFunc} from '../functions/user';
import OptionButtons from '../components/users/members/optionButtons';
import InputText from '../components/users/members/inputText';
import {getSingleChat} from '../actions/chat';
import {singleDefaultIcon} from '../utils/defaultIcon';
import RankSettingModal from '../components/rankSetting/rankSettingModal';
import {getTheme} from '../utils/theme';

class Member extends React.Component {
  state = {
    toggled: false,
    keyboard: false,
    loading: false,
    ...this.props.route.params,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {theme} = this.state
    this.props.navigation.setOptions({
      // headerRight: () => (
      //   <ModifyButton
      //     update={false}
      //     onPress={this.modifyMemberStatus}
      //     loading={false}
      //   />
      // ),
      headerBackTitleVisible: false,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.auth != this.state.auth ||
      prevState.group_username != this.state.group_username
    ) {
      let update = false;
      update = this.extractData().update;
      // const {navigation} = this.props;
      // navigation.setOptions({
      //   headerRight: () => (
      //     <ModifyButton
      //       update={update}
      //       onPress={this.modifyMemberStatus}
      //       loading={this.state.loading}
      //     />
      //   ),
      // });
    }
  }

  componentWillUnmount() {
    // update member profile
    if (this.extractData().update) {
      this.modifyMemberStatus();
    }
  }

  getGroup = async () => {
    const {
      group,
      auth,
      userLogout,
      navigation,
      getSingleGroupById,
    } = this.props;
    const request = {
      token: auth.token,
      id: group.group.id,
    };

    const req = await getSingleGroupById(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot load group at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
  };

  loadGroupMembers = () => {
    const {navigation, getGroupMembers, auth, group, userLogout} = this.props;
    const {id} = group.group;
    const {token} = auth;
    const data = {
      token: token,
      groupId: id,
      getGroupMembers: getGroupMembers,
      navigation: navigation,
      userLogout: userLogout,
      count: 0,
    };
    getGroupMembersFunc(data);
  };

  onDeleteMember = async () => {
    const {deleteMember, auth, group, navigation, userLogout} = this.props;
    const {id} = this.state;

    const data = {
      memberId: id,
      token: auth.token,
      groupId: group.group.id,
    };

    const deletionResult = await deleteMember(data);
    if (deletionResult.errors) {
      // alert(deletionResult.errors[0].message);
      alert('Cannot delete member at this time, please try again later');
      if (deletionResult.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.getGroup();
    this.loadGroupMembers();
    navigation.goBack();
  };

  onMakeOwner = async () => {
    const {makeOwner, auth, group, navigation, userLogout} = this.props;
    const {id} = this.state;

    const data = {
      memberId: id,
      token: auth.token,
      groupId: group.group.id,
    };

    const result = await makeOwner(data);
    if (result.errors) {
      // alert(result.errors[0].message);
      alert('Cannot transfer ownership at this time, please try again later');
      if (result.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.getGroup();
    this.loadGroupMembers();
    navigation.goBack();
  };

  extractData = () => {
    let {id, auth, group_username} = this.state;
    let {rank, title} = auth;
    title = title.trim();
    group_username = group_username.trim();

    // compare with orign
    const origin = {
      ...this.props.route.params,
    };

    if (rank == origin.auth.rank) {
      rank = null;
    }
    if (title == origin.auth.title) {
      title = null;
    }

    if (group_username == origin.group_username) {
      group_username = null;
    }

    if (rank != null || title != null || group_username != null) {
      const updateData = {
        userId: id,
        groupId: this.props.group.group.id,
        auth: {
          rank: rank,
          title: title,
        },
        group_username: group_username,
        token: this.props.auth.token,
      };

      return {
        updateData: updateData,
        update: this.validation(),
        origin: origin,
      };
    } else {
      return {update: false};
    }
  };

  validation = () => {
    const {rank, title} = this.state.auth;
    const {group_username} = this.state;
    if (title.trim().length < 1 || title.trim().length > 30) {
      return false;
    }

    // group_username must not contain admin and squeeki
    // group_username must have length greater than 1 and no greather than 50
    if (
      group_username.toLowerCase().search('admin') != -1 ||
      group_username.toLowerCase().search('squeeki') != -1 ||
      group_username.trim().length < 1 ||
      group_username.trim().length > 50
    ) {
      return false;
    }

    if (rank < 0 || rank > 7) {
      return false;
    }

    return true;
  };

  modifyMemberStatus = async () => {
    const {prev_route} = this.state;
    this.setState({loading: true});
    // get function here
    const {userLogout, navigation} = this.props;

    const {updateData, origin} = this.extractData();

    const updateMember = await this.props.updateMember({updateData, origin});

    if (updateMember.errors) {
      console.log(updateMember.errors[0].message);
      alert('Cannot modify member status at this time, please try again later');
      if (updateMember.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    if (prev_route == 'Members') {
      this.loadGroupMembers();
    } else {
      // get group info when return to group setting page
      this.getGroup();
    }
  };

  onBackdropPress = () => {
    this.setState({toggled: false, keyboard: false});
  };

  onBackgroundPress = () => {
    this.setState({
      keyboard: false,
    });
    Keyboard.dismiss();
  };

  onRankInputFocus = () => {
    this.setState({toggled: true, keyboard: true});
    Keyboard.dismiss();
  };

  onTitleInputFocus = () => {
    this.setState({keyboard: true});
  };

  modifyInput = (type, value) => {
    if (type == 'rank') {
      this.setState(prevState => {
        return {
          auth: {
            ...prevState.auth,
            rank: value,
          },
        };
      });
    } else if (type == 'title') {
      this.setState(prevState => {
        return {
          auth: {
            ...prevState.auth,
            title: value,
          },
        };
      });
    } else if (type == 'group_username') {
      this.setState({group_username: value});
    }
  };

  getSingleChat = async () => {
    const {getSingleChat, auth, navigation} = this.props;
    const {id} = this.state;

    const request = {
      token: auth.token,
      second_userId: id,
    };

    const req = await getSingleChat(request);

    if (req.errors) {
      console.log(req.errors[0]);
      alert('load chat failed at this time, please try again later');
      return false;
    }

    if (req) {
      navigation.navigate('Chat', {second_userId: id});
    }
  };

  onButtonPress = type => {
    if (type == 'ownership') {
      Alert.alert(
        'Switch Ownership',
        'Do you want to make this user the new owner of this group?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Confirm', onPress: this.onMakeOwner},
        ],
      );
    }

    if (type == 'remove') {
      Alert.alert(
        'Remove user',
        'Do you want to remove this user from this group?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Confirm', onPress: this.onDeleteMember, style: 'destructive'},
        ],
      );
    }

    if (type == 'dm') {
      this.getSingleChat();
    }
  };

  render() {
    // here is selected member
    const {
      icon,
      id,
      username,
      displayName,
      auth,
      toggled,
      loading,
      group_username,
      theme
    } = this.state;

    // auth here is auth of group member
    const {group, rankName} = this.props.group;
    const {manage_member_rank_required} = group.rank_setting;

    const {user} = this.props.auth;

    const allowToModifyMember = group.auth.rank <= manage_member_rank_required;
    const allowToMakeOwner = group.auth.rank <= 1 && auth.rank > 1;
    const allowToChangeGroupUsername =
      user.id == id || group.auth.rank <= manage_member_rank_required;
    const isSelf = user.id == id;
    const allowToDeleteMember =
      !isSelf &&
      group.auth.rank <= manage_member_rank_required &&
      group.auth.rank <= auth.rank;

    const modalVisible = toggled && allowToModifyMember;
    return (
      <TouchableWithoutFeedback onPress={this.onBackgroundPress}>
        <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
          <StatusBar barStyle={'dark-content'} />
          <Image
            source={icon ? {uri: icon.uri} : singleDefaultIcon()}
            style={styles.imageStyle}
          />

          <Text style={[styles.displayName, theme.textColor]}>{displayName}</Text>
          <Text style={styles.username}>@{username}</Text>
          <InputRankTitle
            auth={auth}
            onRankInputFocus={this.onRankInputFocus}
            onTitleInputFocus={this.onTitleInputFocus}
            modifyInput={this.modifyInput}
            allowToModifyMember={allowToModifyMember}
            userAuth={group.auth}
            isSelf={isSelf}
            rankName={rankName}
            theme={theme}
          />
          <InputText
            modifyInput={this.modifyInput}
            value={group_username}
            editable={allowToChangeGroupUsername}
            theme={theme}
          />
          {loading ? (
            <ActivityIndicator
              style={{marginTop: 200}}
              animating={loading}
              color={'grey'}
            />
          ) : (
            <View style={{marginTop: 200}}>
              <OptionButtons
                isSelf={isSelf}
                allowToDeleteMember={allowToDeleteMember}
                allowToMakeOwner={allowToMakeOwner}
                onButtonPress={this.onButtonPress}
                // onMakeOwner={this.onMakeOwner}
              />
            </View>
          )}
          {modalVisible ? (
            <RankSettingModal
              type={'rank'}
              prevRoute={'member'}
              userRank={group.auth.rank}
              rankName={rankName}
              onRankChange={this.modifyInput}
              onBackdropPress={this.onBackdropPress}
              modalVisible={modalVisible}
              theme={theme}
            />
          ) : null}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#718093',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  displayName: {
    marginTop: 10,
  },
  username: {
    color: '#95a5a6',
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    updateMember: data => dispatch(updateMember(data)),
    getGroupMembers: data => dispatch(getGroupMembers(data)),
    userLogout: () => dispatch(userLogout()),
    deleteMember: data => dispatch(deleteMember(data)),
    makeOwner: data => dispatch(makeOwner(data)),
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
    searchUser: data => dispatch(searchUser(data)),
    getSingleChat: data => dispatch(getSingleChat(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Member);
