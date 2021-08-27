import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {dateConversion} from '../../utils/time';
import HeaderImageBackground from './imageBackground';
import Leaderboard from './leaderboard';
import {connect} from 'react-redux';
import {joinGroup} from '../../actions/group';
import {changeGroupNotification} from '../../actions/user';
import {userLogout} from '../../actions/auth';
import TagList from '../tags/tagList';
import {pointFormat} from '../../utils/point';
import {getGroupPointLeaderBoard, cleanLeaderboard} from '../../actions/point';
import {loadLeaderBoardFunc} from '../../functions/point';
import {getMonth} from '../../utils/time';
import {getTheme} from '../../utils/theme';

const extractKey = ({key}) => key;
class GroupHeader extends React.Component {
  state = {
    loading: false,
    notificationToggled: false,
    theme: getTheme(this.props.auth.user.theme),
  };

  // join button method / setting method
  groupMethod = async () => {
    const {auth} = this.props.item;
    if (auth == null) {
      this.setState({loading: true});
      await this.joinGroup();
      this.setState({loading: false});
    }
  };

  changeNotification = async notificationPriority => {
    const {auth, changeGroupNotification} = this.props;
    const {id} = this.props.group.group;
    const data = {
      token: auth.token,
      groupId: id,
      notificationPriority: notificationPriority,
    };

    this.onBackdropPress();
    const result = await changeGroupNotification(data);
    if (result.errors) {
      // alert(result.errors[0].message);
      alert('Cannot change notification at this time, please try again later');
      if (result.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }
  };

  notificationSettingOptions = [
    {key: '0', label: '0', value: 0},
    {key: '1', label: '1', value: 1},
    {key: '2', label: '2', value: 2},
    {key: '3', label: '3', value: 3},
    {key: '-1', label: 'Turn Off', value: -1},
  ];

  joinGroup = async () => {
    // check if group is private or not.  If not join right away.  If yes, request to join
    const {id} = this.props.group.group;
    const {token} = this.props.auth;
    const {joinGroup, navigation} = this.props;
    const data = {
      groupId: id,
      token: token,
    };

    const result = await joinGroup(data);
    if (result.errors) {
      // alert(result.errors[0].message);
      alert('Cannot join group at this time, please try again later');
      if (result.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    // if joined result is true then navigate to group page or change button to requested
    if (result) {
      navigation.navigate('GroupNavigator', {
        prevRoute: 'GroupSearch',
      });
    }
  };

  onBackdropPress = () => {
    this.setState({notificationToggled: false});
  };

  onNotificationPress = () => {
    this.setState({notificationToggled: true});
  };

  renderItem = ({item}) => {
    const {theme} = this.state;
    return (
      <TouchableOpacity
        style={[
          styles.notificationSettingOptions,
          {
            borderBottomWidth: item.key == '-1' ? 0 : StyleSheet.hairlineWidth,
          },
          theme.borderColor,
        ]}
        onPress={() => this.changeNotification(item.value)}>
        <Text style={{color: item.key == '-1' ? 'red' : theme.textColor.color}}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  onLeaderboardPress = () => {
    const {cleanLeaderboard, navigation} = this.props;
    cleanLeaderboard();
    navigation.navigate('Leaderboard');
  };

  loadLeaderBoard = period => {
    const {
      userLogout,
      auth,
      getGroupPointLeaderBoard,
      navigation,
      group,
    } = this.props;
    const data = {
      userLogout: userLogout,
      auth: auth,
      getGroupPointLeaderBoard: getGroupPointLeaderBoard,
      navigation: navigation,
      group: group,
      count: 0,
      limit: 20,
      period: period,
    };

    loadLeaderBoardFunc(data);
  };

  render() {
    const {
      icon,
      groupname,
      display_name,
      shortDescription,
      createdAt,
      memberCount,
      backgroundImg,
      auth,
      visibility,
      tags,
      join_requested,
      rank_setting,
      status,
      location,
    } = this.props.item;
    const {point, onAddPost} = this.props;
    let {total_point, base_point_time, leaderboard} = point;
    const {users} = leaderboard;
    const {container, underImageStyle, component} = styles;
    const {notificationToggled, theme} = this.state;
    const date = dateConversion(createdAt, 'timeDisplay');

    const total_point_display = pointFormat(total_point);
    const base_point_time_display = pointFormat(base_point_time);
    const {month} = getMonth();

    return (
      <TouchableWithoutFeedback>
        <View>
          <View style={container}>
            <HeaderImageBackground
              icon={icon}
              backgroundImg={backgroundImg}
              auth={auth}
              groupMethod={this.groupMethod}
              loading={this.state.loading}
              onBackdropPress={this.onBackdropPress}
              onNotificationPress={this.onNotificationPress}
              user={this.props.auth.user}
              onAddPost={onAddPost}
              visibility={visibility}
              join_requested={join_requested}
              rank_setting={rank_setting}
              theme={theme}
              status={status}
            />

            <View style={underImageStyle}>
              <View style={{width: '70%'}}>
                <View style={[component]}>
                  <Text
                    style={[
                      {fontWeight: 'bold', fontSize: 20},
                      theme.textColor,
                    ]}
                    numberOfLines={2}>
                    {display_name}
                  </Text>
                </View>
                <Text style={{color: '#95a5a6'}} numberOfLines={2}>
                  g@{groupname}
                </Text>
                <View style={[component, {marginTop: 1}]}>
                  <Text style={{color: '#95a5a6'}}>Since {date}</Text>
                </View>
                <View style={[component, {marginTop: 1}]}>
                  <Text style={{color: '#95a5a6'}}>Member: {memberCount}</Text>
                </View>
                {location ? (
                  <View style={[component, {marginTop: 5}]}>
                    <TouchableOpacity>
                      <Text style={{color: '#95a5a6'}}>
                        {location.locationDescription}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              {auth ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '30%',
                  }}>
                  <Text
                    style={[
                      {fontSize: 19, fontWeight: '600'},
                      theme.groupPointColor,
                    ]}>
                    {total_point_display}
                  </Text>
                  <Text style={{fontSize: 9, color: 'grey'}}>
                    {`Monthly base points`}: {base_point_time_display}
                  </Text>
                  {/* <Text style={{fontSize: 9, color: 'grey'}}>
                    {begin_month +
                      '/' +
                      begin_date +
                      '-' +
                      end_month +
                      '/' +
                      end_date}
                  </Text> */}
                </View>
              ) : null}
            </View>

            <View
              style={[
                component,
                {
                  paddingTop: 1,
                  marginTop: 5,
                  marginBottom: 3,
                  width: '95%',
                  paddingHorizontal: 10,
                },
              ]}>
              <Text numberOfLines={8} style={theme.textColor}>
                {shortDescription}
              </Text>
            </View>

            {tags.length == 0 ? null : (
              <View
                style={[
                  component,
                  {
                    paddingTop: 1,
                    marginTop: 1,
                    marginBottom: 5,
                    paddingHorizontal: 5,
                  },
                ]}>
                <TagList
                  groupTags={tags || []}
                  isSearch={false}
                  isGroupHeader={true}
                />
              </View>
            )}

            <Modal
              isVisible={notificationToggled}
              style={styles.modal}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
              onBackdropPress={this.onBackdropPress}>
              <View style={[styles.notificationSetting, theme.backgroundColor]}>
                <Text style={theme.textColor}>
                  Receive Notification only on and above priority
                </Text>
                <FlatList
                  style={{width: '100%', marginTop: 20}}
                  data={this.notificationSettingOptions}
                  keyExtractor={extractKey}
                  alwaysBounceHorizontal={false}
                  alwaysBounceVertical={false}
                  scrollEnabled={false}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </Modal>
          </View>
          {!visibility && auth == null ? (
            <View style={styles.privateGroupTextView}>
              <Text style={styles.privateGroupText}>This group is private</Text>
              <Text style={styles.privateGroupSubText}>
                Join the group to see posts and activities
              </Text>
            </View>
          ) : null}
          {auth && users.length > 0 && status == 'active' ? (
            <TouchableWithoutFeedback onPress={this.onLeaderboardPress}>
              <View style={[styles.leaderboard, theme.groupLeaderBoard]}>
                <View style={{height: 20}}>
                  <Text
                    style={[
                      {fontWeight: 'bold', fontSize: 15},
                      theme.textColor,
                    ]}>
                    Monthly Leaderboard:
                  </Text>
                </View>
                <Leaderboard users={users} theme={theme} />
              </View>
            </TouchableWithoutFeedback>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 650,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#576889',
  },
  underImageStyle: {
    width: '100%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 30 : 0,
  },
  component: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationSetting: {
    width: 350,
    height: 350,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  notificationSettingOptions: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privateGroupTextView: {
    width: '100%',
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privateGroupText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'grey',
  },
  privateGroupSubText: {
    marginTop: 10,
    color: 'grey',
  },
  leaderboard: {
    padding: 7,
    width: '100%',
    maxHeight: 140,
    backgroundColor: '#ecf0f1',
  },
});

const mapStateToProps = state => {
  const {group, auth, point} = state;
  return {group, auth, point};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    joinGroup: data => dispatch(joinGroup(data)),
    changeGroupNotification: data => dispatch(changeGroupNotification(data)),
    cleanLeaderboard: () => dispatch(cleanLeaderboard()),
    getGroupPointLeaderBoard: data => dispatch(getGroupPointLeaderBoard(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupHeader);
