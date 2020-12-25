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
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import InputRankTitle from '../components/users/members/inputRankTitle';
import ModifyButton from '../components/users/members/modifyButton';
import {updateMember, deleteMember, makeOwner} from '../actions/user';
import {userLogout} from '../actions/auth';
import {getGroupMembers} from '../actions/user';
import {getGroupMembersFunc} from '../functions/user';
import OptionButtons from '../components/users/members/optionButtons';
import validator from 'validator';

class Member extends React.Component {
  state = {
    toggled: false,
    keyboard: false,
    loading: false,
    ...this.props.route.params,
    icon_option: 'emoticon-cool-outline',
  };

  componentDidMount() {
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]});
    this.props.navigation.setOptions({
      headerRight: () => (
        <ModifyButton
          update={false}
          onPress={this.modifyMemberStatus}
          loading={false}
        />
      ),
      headerBackTitleVisible: false
    });

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.auth != this.state.auth) {
      let update = false;
      update = this.extractData().update;
      const {navigation} = this.props;
      navigation.setOptions({
        headerRight: () => (
          <ModifyButton
            update={update}
            onPress={this.modifyMemberStatus}
            loading={this.state.loading}
          />
        ),
      });
    }
  }

  componentWillUnmount() {
    this.loadGroupMembers();
  }

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
      lastIndexId: null,
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
      alert(deletionResult.errors[0].message);
      if (deletionResult.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
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
      alert(result.errors[0].message);
      if (result.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    navigation.goBack();
  };

  extractData = () => {
    const {id, auth} = this.state;
    let {rank, title} = auth;
    title = title.trim();

    const origin = {
      ...this.props.route.params.auth,
    };

    if (rank == origin.rank) {
      rank = null;
    }
    if (title == origin.title) {
      title = null;
    }

    if (rank != null || title != null) {
      const updateData = {
        userId: id,
        groupId: this.props.group.group.id,
        auth: {
          rank: rank,
          title: title,
        },
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
    if (title.trim().length == 0) {
      return false;
    }

    // if (!validator.isAlphanumeric(title.trim())) {
    //   return false;
    // }

    if (rank < 1 || rank > 7) {
      return false;
    }
    return true;
  };

  modifyMemberStatus = async () => {
    this.setState({loading: true});
    // get function here
    const {userLogout, navigation} = this.props;

    const {updateData, origin} = this.extractData();

    const updateMember = await this.props.updateMember({updateData, origin});

    if (updateMember.errors) {
      alert(updateMember.errors[0].message);
      if (updateMember.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({loading: false, auth: updateData.auth});
    navigation.goBack();
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
    }
  };

  render() {
    const {
      icon,
      id,
      username,
      displayName,
      auth,
      toggled,
      loading,
      icon_option,
    } = this.state;

    //group auth is your auth in the group
    const {group} = this.props.group;

    // auth here is auth of group member
    const {user} = this.props.auth;
    const allowToChangeRank = group.auth.rank < auth.rank;
    const allowToChangeTitle = group.auth.rank < auth.rank || user.id == id;
    const allowToDeleteMember =
      auth.rank != 1 && group.auth.rank <= 2 && user.id != id;
    const allowToMakeOwner = group.auth.rank <= 1 && auth.rank > 1;

    return (
      <TouchableWithoutFeedback onPress={this.onBackgroundPress}>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          {icon != null ? (
            <Image source={{uri: icon.uri}} style={styles.imageStyle} />
          ) : (
            <MaterialIcons
              name={icon_option}
              size={100}
              style={{marginTop: 15, height: 100}}
            />
          )}

          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.username}>{username}</Text>
          <InputRankTitle
            auth={auth}
            onRankInputFocus={this.onRankInputFocus}
            onTitleInputFocus={this.onTitleInputFocus}
            onBackdropPress={this.onBackdropPress}
            toggled={toggled}
            modifyInput={this.modifyInput}
            allowToChangeRank={allowToChangeRank}
            allowToChangeTitle={allowToChangeTitle}
            userAuth={group.auth}
          />
          {loading ? (
            <ActivityIndicator style={{marginTop: 400}} animating={loading} />
          ) : (
            <View style={{marginTop: 400}}>
              <OptionButtons
                onDeleteMember={this.onDeleteMember}
                allowToDeleteMember={allowToDeleteMember}
                allowToMakeOwner={allowToMakeOwner}
                onMakeOwner={this.onMakeOwner}
              />
            </View>
          )}
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Member);
