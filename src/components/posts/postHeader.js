import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {singleDefaultIcon} from '../../utils/defaultIcon';

const {width} = Dimensions.get('screen');

export default class PostHeader extends React.Component {
  state = {
    modalToggled: false,
  };

  render() {
    const {
      icon,
      username,
      group_username,
      displayName,
      date,
      auth,
      onPostDelete,
      onPostUpdate,
      onPostNotification,
      modalToggled,
      toggleModal,
      onBackDropPress,
      option,
      type,
      priority,
      currentUserAuth,
      groupAuth,
      notification,
      onPostReport,
      is_report_toggled,
      report,
      onReportInput,
      onSubmitReport,
      onReport,
      selectionMode,
      rank_required_manage,
      rank_required_task,
      onTaskManagementPress,
      theme,
    } = this.props;

    let currentUserAuthPostManagementQualified = false;
    let currentUserAuthTaskManagementQualified = false;

    // groupAuth: post owner auth in group, currentUserAuth: current user in group
    // check if user is qualified to manage post in a group
    if (currentUserAuth && groupAuth) {
      // if post owner is not group owner and if current user rank meets requirement or the current user is
      // global moderator
      if (
        (groupAuth.rank > 1 && currentUserAuth.rank <= rank_required_manage) ||
        currentUserAuth.rank == 0
      ) {
        currentUserAuthPostManagementQualified = true;
      }
    }

    // check if user is qualified to manage task in a group
    if (currentUserAuth) {
      if (currentUserAuth.rank <= rank_required_task) {
        currentUserAuthTaskManagementQualified = true;
      }
    }

    // post options based on user's authority
    let options = (
      <View style={[styles.modalView, theme.backgroundColor]}>
        {auth ? (
          <TouchableOpacity style={styles.option} onPress={onPostNotification}>
            <Text style={{color: notification ? 'red' : 'grey'}}>
              {notification ? 'Notification: On' : 'Notification: Off'}
            </Text>
          </TouchableOpacity>
        ) : null}
        {(auth || currentUserAuthTaskManagementQualified) && type == 'task' ? (
          <TouchableOpacity
            style={styles.option}
            onPress={onTaskManagementPress}>
            <Text style={theme.textColor}>Task Management</Text>
          </TouchableOpacity>
        ) : null}
        {auth || currentUserAuthPostManagementQualified ? (
          <View style={{width: '100%'}}>
            <TouchableOpacity style={styles.option} onPress={onPostUpdate}>
              <Text style={theme.textColor}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={onPostDelete}>
              <Text style={theme.textColor}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity style={styles.option} onPress={onPostReport}>
          <Text style={theme.textColor}>Report</Text>
        </TouchableOpacity>
      </View>
    );

    // this is for report input
    if (is_report_toggled) {
      options = (
        <KeyboardAvoidingView
          style={[styles.reportView, theme.backgroundColor]}>
          <View style={styles.reportHeader}>
            <Text style={[{fontSize: 18, fontWeight: 'bold'}, theme.textColor]}>
              Report
            </Text>
          </View>
          <View style={styles.reportTextInput}>
            <TextInput
              placeholder={'Reason to report ...'}
              placeholderTextColor={'#7f8fa6'}
              style={[{width: '100%'}, theme.textColor]}
              multiline={true}
              maxLength={100}
              value={report}
              onChangeText={t => onReportInput(t)}
            />
          </View>
          <View style={styles.reportFooter}>
            <TouchableOpacity
              style={[
                styles.reportButton,
                {
                  borderRightWidth: StyleSheet.hairlineWidth,
                },
              ]}
              disabled={report.length == 0 || onReport}
              onPress={onSubmitReport}>
              <Text
                style={{
                  fontSize: 15,
                  color: report.length == 0 ? '#7f8fa6' : theme.textColor.color,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={onBackDropPress}>
              <Text style={{color: 'red'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      );
    }

    let typeBackgroundColor = 'white';
    if (type == 'task') {
      typeBackgroundColor = '#e84118';
    } else if (type == 'event') {
      typeBackgroundColor = '#273c75';
    }

    let priorityColor = '#44bd32';
    if (priority == 2) {
      priorityColor = '#273c75';
    } else if (priority == 3) {
      priorityColor = '#e84118';
    }

    // sizing displayNmae
    let displayNameSize = 14;
    if (displayName.length > 30) {
      displayNameSize = 13;
    }
    if (displayName.length > 40) {
      displayNameSize = 12;
    }

    let group_username_size = 14;
    if (group_username) {
      if (group_username.length > 30) {
        group_username_size = 13;
      }
      if (group_username.length > 40) {
        group_username_size = 12;
      }
    }

    // sizing username
    let userNameSize = 13;
    if (username.length > 25) {
      userNameSize = 12;
    }

    // sizing title in group
    let titleSize = 14;
    if (groupAuth) {
      if (groupAuth.title.length > 20) {
        titleSize = 13;
      }
      if (groupAuth.title.length > 25) {
        titleSize = 10;
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.userHolder}>
          <Image
            source={icon ? {uri: icon.uri} : singleDefaultIcon()}
            style={styles.userIconStyle}
          />
          <View style={styles.nameStyle}>
            <Text
              style={[
                styles.displayNameStyle,
                {
                  fontSize:
                    group_username != null
                      ? group_username_size
                      : displayNameSize,
                  color: priority > 0 ? 'black' : theme.textColor.color,
                },
              ]}
              numberOfLines={2}
              multiline={true}>
              {group_username != null ? group_username : displayName}
            </Text>
            {groupAuth != null ? null : (
              <Text
                style={[styles.usernameStyle, {fontSize: userNameSize}]}
                multiline={true}
                numberOfLines={2}>
                @{username}
              </Text>
            )}
            {groupAuth == null ? null : (
              <Text
                style={[
                  {fontSize: titleSize, color: '#4a69bd'},
                  theme.groupMemberTitle,
                ]}>
                {'<' + groupAuth.title + '>'}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 85,
            justifyContent: selectionMode ? 'center' : 'space-between',
          }}>
          <Text style={[styles.timeStyle]}>{date}</Text>
          {!selectionMode ? (
            <TouchableOpacity
              onPress={toggleModal}
              style={styles.verticalDotStyle}>
              <MaterialIcons
                size={25}
                name={'dots-vertical'}
                color={priority > 0 ? 'black' : theme.iconColor.color}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <Modal
          isVisible={modalToggled}
          style={styles.modal}
          onBackdropPress={onBackDropPress}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}>
          {options}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userIconStyle: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 25,
  },
  typeContainer: {
    marginLeft: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    width: 40,
  },
  typeStyle: {
    color: 'white',
    padding: 3,
  },
  nameStyle: {
    marginLeft: 5,
    width: width - 150,
  },
  displayNameStyle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  usernameStyle: {
    fontSize: 11,
    color: '#95a5a6',
  },
  timeStyle: {
    color: '#95a5a6',
    fontSize: 12,
    paddingRight: 3,
  },
  userHolder: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: 250,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  reportView: {
    backgroundColor: 'white',
    width: '100%',
    height: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: Platform.OS == 'ios' ? 350 : 200,
  },
  reportHeader: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reportTextInput: {
    height: 110,
    width: '100%',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reportFooter: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  reportButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  option: {
    height: 50,
    width: '100%',
    borderColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDotStyle: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: Platform.OS == 'ios' ? 5 : 0,
  },
});
