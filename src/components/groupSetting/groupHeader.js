import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {dateConversion} from '../../utils/time';
import HeaderImageBackground from './ImageBackground';
import {connect} from 'react-redux';
import {userLogout} from '../../actions/auth';
import GroupSettingModal from './groupSettingModal';
import {getTheme} from '../../utils/theme';

const {height, width} = Dimensions.get('screen');

class GroupSettingsHeader extends React.Component {
  state = {
    icon: null,
    backgroundImg: null,
    groupname: '',
    display_name: '',
    shortDescription: '',
    initialize: true,
    loading: false,
    modalVisible: false,
    isBackground: true,
    groupId: null,
    theme: getTheme(this.props.auth.user.theme),
    location: null,
    ...this.props.data,
    groupId: this.props.data.id,
  };

  setImage = (source, type) => {
    if (type == 'background') {
      this.setState({backgroundImg: source, modalVisible: false});
    } else {
      this.setState({icon: source, modalVisible: false});
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {loading} = this.props
    if (prevState != this.state && !loading) {
      this.props.setGroupHeader(this.state);
    }

    if (this.props.data.location != prevProps.data.location) {
      this.setState({location: this.props.data.location});
    }
  }

  updateShortDescription = descritpion => {
    // make sure the numer of lines and length of content is limited
    const lineCount = descritpion.split(/\r\n|\r|\n/).length;
    const valueSplit = descritpion.substr(0, 255).split('\n');
    if (lineCount >= 10) {
      this.setState({shortDescription: valueSplit.slice(0, 8).join('\n')});
      return;
    }

    this.setState({shortDescription: descritpion.substr(0, 255)});
  };

  updateGroupName = (type, name) => {
    if (type == 'display_name') {
      this.setState({display_name: name.substr(0, 50)});
    } else if (type == 'groupname') {
      this.setState({groupname: name.replace(/ /g, '').substr(0, 30)});
    }
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
      display_name,
      initialize,
      createdAt,
      memberCount,
      modalVisible,
      isBackground,
      groupId,
      theme,
      location,
    } = this.state;

    const {auth_rank, required_rank, navigation, prevRoute} = this.props;

    let date = new Date();

    if (initialize) {
      (memberCount = 1), (date = date.getTime());
      date = dateConversion(date, 'group');
    } else {
      date = dateConversion(createdAt, 'timeDisplay');
    }

    const {container, underImageStyle, component} = styles;

    return (
      <View style={container}>
        <HeaderImageBackground
          initialize={initialize}
          auth={this.props.data.auth}
          backgroundImg={backgroundImg}
          icon={icon}
          auth_rank={auth_rank}
          onMediaPress={this.onMediaPress}
          required_rank={required_rank}
          theme={theme}
        />
        <View style={underImageStyle}>
          <View style={component}>
            <TextInput
              style={[styles.displayName, theme.textColor]}
              maxLength={50}
              multiline={true}
              placeholder={'Group Display Name'}
              placeholderTextColor={'#7f8fa6'}
              onChangeText={text => this.updateGroupName('display_name', text)}
              value={display_name}
              editable={auth_rank <= required_rank}
              blurOnSubmit={true}
            />
          </View>

          <View style={[component, {marginTop: 1}]}>
            <Text style={{color: '#95a5a6'}}>g@{groupId ? groupname : ''}</Text>
            {groupId ? null : (
              <TextInput
                style={[styles.groupname, theme.textColor]}
                onChangeText={text =>
                  this.updateGroupName('groupname', text.trim())
                }
                placeholder={'Pick an unique groupname'}
                placeholderTextColor={'#7f8fa6'}
                value={groupname.replace(/ /g, '')}
                maxLength={30}
              />
            )}
          </View>

          <View style={[component, {marginTop: 1}]}>
            <Text style={{color: '#95a5a6'}}>Since {date}</Text>
          </View>
          <View style={[component, {marginTop: 1}]}>
            <Text style={{color: '#95a5a6'}}>Member: {memberCount}</Text>
          </View>
          <View style={[component, {marginTop: 5}]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchLocation', {
                  prevRoute,
                })
              }>
              <Text style={{color: '#95a5a6'}}>
                {location ? location.locationDescription : 'Set Location'}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[component, {paddingTop: 1, marginTop: 5, marginBottom: 5}]}>
            <TextInput
              multiline={true}
              maxLength={255}
              placeholder={'Short description (min 20 chars) ...'}
              placeholderTextColor={'#7f8fa6'}
              onChangeText={text => this.updateShortDescription(text)}
              value={shortDescription}
              style={[styles.description, theme.textColor]}
              editable={auth_rank <= required_rank}
              scrollEnabled={false}
            />
          </View>
        </View>

        <GroupSettingModal
          modalVisible={modalVisible}
          onBackdropPress={this.onBackdropPress}
          onChangeMedia={this.setImage}
          isBackground={isBackground}
          theme={theme}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 600,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#576889',
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
  },
  displayName: {
    fontWeight: 'bold',
    fontSize: 20,
    width: '100%',
    paddingVertical: 0,
    paddingLeft: -1,
    justifyContent: 'center',
  },
  description: {
    width: '100%',
    paddingLeft: -1,
    padding: 0,
    maxHeight: height * 0.185,
    color: '#95a5a6',
  },
  groupname: {
    width: '100%',
    marginLeft: 1,
    padding: 0,
    color: '#95a5a6',
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, group};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSettingsHeader);
