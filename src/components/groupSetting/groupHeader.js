import React from 'react';
import {StyleSheet, View, Text, TextInput, Platform} from 'react-native';
import {dateConversion} from '../../utils/time';
import HeaderImageBackground from './ImageBackground';
import {connect} from 'react-redux';
import {leaveGroup} from '../../actions/group';
import {userLogout} from '../../actions/auth';
import GroupSettingModal from './groupSettingModal';

class GroupSettingsHeader extends React.Component {
  state = {
    icon: null,
    backgroundImg: null,
    groupname: '',
    shortDescription: '',
    initialize: true,
    loading: false,
    modalVisible: false,
    isBackground: true,
  };

  componentDidMount() {
    let {
      icon,
      backgroundImg,
      shortDescription,
      groupname,
      initialize,
      createdAt,
      memberCount,
    } = this.props.data;

    this.setState({
      icon: icon,
      backgroundImg: backgroundImg,
      shortDescription: shortDescription,
      groupname: groupname,
      initialize: initialize,
      createdAt: createdAt,
      memberCount: memberCount,
    });
  }

  setImage = (source, type) => {
    if (type == 'background') {
      this.setState({backgroundImg: source, modalVisible: false});
    } else {
      this.setState({icon: source, modalVisible: false});
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      this.props.setGroupHeader(this.state);
    }
  }

  updateShortDescription = descritpion => {
    this.setState({shortDescription: descritpion});
  };

  updateGroupname = name => {
    this.setState({groupname: name});
  };

  leaveGroup = async () => {
    const {data, leaveGroup, navigation} = this.props;
    const {token} = this.props.auth;
    const {id, auth} = data;

    const input = {
      groupId: id,
      token: token,
    };

    const group = await leaveGroup(input);

    if (group.errors) {
      // alert(group.errors[0].message);
      alert('Cannot leave group at this time, please try again later')
      if (group.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    navigation.navigate('Groups');
  };

  onBackdropPress = () => {
    this.setState({modalVisible: false});
  };

  onMediaPress = type => {
    this.setState({
      modalVisible: true,
      isBackground: type == 'background' ? true : false,
    });
  };

  render() {
    let {
      icon,
      backgroundImg,
      shortDescription,
      groupname,
      initialize,
      createdAt,
      memberCount,
      modalVisible,
      isBackground,
    } = this.state;

    const {auth_rank} = this.props;

    let date = new Date();

    if (initialize) {
      (memberCount = 1), (date = date.getTime());
      date = dateConversion(date);
    } else {
      date = dateConversion(createdAt);
    }

    const {container, underImageStyle, component} = styles;

    return (
      <View style={container}>
        <HeaderImageBackground
          initialize={initialize}
          auth={this.props.data.auth}
          backgroundImg={backgroundImg}
          icon={icon}
          onLeave={this.leaveGroup}
          auth_rank={auth_rank}
          onMediaPress={this.onMediaPress}
        />
        <View style={underImageStyle}>
          <View style={component}>
            <TextInput
              style={{fontWeight: 'bold', fontSize: 20, width: '100%', paddingLeft: -1}}
              maxLength={60}
              multiline={true}
              placeholder={'group name (min 6 chars)'}
              placeholderTextColor={'#7f8fa6'}
              onChangeText={text => this.updateGroupname(text)}
              value={groupname}
              editable={auth_rank <= 1}
            />
          </View>
          <View style={[component, {marginTop: 1}]}>
            <Text style={{color: '#95a5a6'}}>Since {date}</Text>
          </View>
          <View style={[component, {marginTop: 1}]}>
            <Text style={{color: '#95a5a6'}}>
              Member: {memberCount}
            </Text>
          </View>
          <View
            style={[
              component,
              {paddingTop: 1, marginTop: 5, marginBottom: 5},
            ]}>
            <TextInput
              multiline={true}
              maxLength={150}
              placeholder={'Short description (min 20 chars) ...'}
              placeholderTextColor={'#7f8fa6'}
              onChangeText={text => this.updateShortDescription(text)}
              value={shortDescription}
              style={{width: '100%', paddingLeft: -1}}
              editable={auth_rank <= 1}
            />
          </View>
        </View>

        <GroupSettingModal
          modalVisible={modalVisible}
          onBackdropPress={this.onBackdropPress}
          onChangeMedia={this.setImage}
          isBackground={isBackground}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 400,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    borderBottomColor: '#576889',
  },
  underImageStyle: {
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 10 : 0,
  },
  component: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  }
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    leaveGroup: data => dispatch(leaveGroup(data)),
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSettingsHeader);
