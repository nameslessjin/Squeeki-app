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
  KeyboardAvoidingView
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

export default class PostHeader extends React.Component {
  state = {
    modalToggled: false,
    icon_option: 'emoticon-cool-outline'
  };

  componentDidMount(){
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];

    this.setState({icon_option: icon_options[random]})
  }

  render() {
    const {
      icon,
      username,
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
      notificationId,
      onPostReport,
      is_report_toggled,
      report,
      onReportInput,
      onSubmitReport,
      onReport
    } = this.props;

    const {icon_option} = this.state

    let options = (
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.option} onPress={onPostNotification}>
          <Text style={{color: notificationId != null ? null : 'red'}}>
            {notificationId != null ? 'Notification: On' : 'Notification: Off'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={onPostReport}>
          <Text>Report</Text>
        </TouchableOpacity>
      </View>
    );

    let currentUserAuthQualified = false;

    if (currentUserAuth && groupAuth) {
      if (currentUserAuth.rank < groupAuth.rank && currentUserAuth.rank <= 2) {
        currentUserAuthQualified = true;
      }
    }

    if (auth || currentUserAuthQualified) {
      options = (
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.option} onPress={onPostNotification}>
            <Text style={{color: notificationId != null ? null : 'red'}}>
              {notificationId != null
                ? 'Notification: On'
                : 'Notification: Off'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onPostUpdate}>
            <Text>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onPostDelete}>
            <Text style={{color: 'red'}}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onPostReport}>
            <Text>Report</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (is_report_toggled) {

      options = (
        <KeyboardAvoidingView style={styles.reportView}>
          <View style={styles.reportHeader}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Report</Text>
          </View>
          <View style={styles.reportTextInput}>
            <TextInput
              placeholder={'Reason to report ...'}
              style={{width: '100%'}}
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
              disabled={(report.length == 0 || onReport)}
              onPress={onSubmitReport}>
              <Text style={{fontSize: 15, color: report.length == 0 ? '#7f8fa6' : null}}>Submit</Text>
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
    if (type == 'request') {
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

    let displayNameSize = 14;
    if (displayName.length > 20) {
      displayNameSize = 13;
    }
    if (displayName.length > 25) {
      displayNameSize = 10;
    }

    let userNameSize = 11;
    if (username.length > 25) {
      userNameSize = 10;
    }

    let titleSize = 14;
    if (groupAuth){
      if (groupAuth.title.length > 20){
        titleSize = 13;
      }
      if (groupAuth.title.length > 25){
        titleSize = 10;
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.userHolder}>
          {icon != null ? (
            <Image source={{uri: icon.uri}} style={styles.userIconStyle} />
          ) : (
            <MaterialIcons name={icon_option} size={50} />
          )}
          <View style={styles.nameStyle}>
            <Text
              style={[styles.displayNameStyle, {fontSize: displayNameSize}]}>
              {displayName}
            </Text>
            {groupAuth != null ? null : (
              <Text style={[styles.usernameStyle, {fontSize: userNameSize}]}>
                {username}
              </Text>
            )}
            {groupAuth == null ? null : (
              <Text style={{fontSize: titleSize, color: "#4a69bd"}}>
                {'<' + groupAuth.title + '>'}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.typeContainer,
              {backgroundColor: typeBackgroundColor},
            ]}>
            {type == 'post' ? null : (
              <Text style={styles.typeStyle}>{type}</Text>
            )}
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center',}}>
          {priority !== 0 ? (
            <View style={{flexDirection: 'row', marginRight: 5}}>
              <MaterialIcons name={'feather'} size={20} color={priorityColor} />
              <Text style={{fontSize: 10, color: priorityColor}}>
                {priority}
              </Text>
            </View>
          ) : null}
          <Text style={styles.timeStyle}>{date}</Text>
          {option ? (
            <TouchableOpacity
              onPress={toggleModal}
              style={styles.verticalDotStyle}>
              <MaterialIcons size={25} name={'dots-vertical'} />
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
  },
  typeStyle: {
    color: 'white',
    padding: 3,
  },
  nameStyle: {
    marginLeft: 5,
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
    paddingRight: 3
  },
  userHolder: {
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 7,
  },
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  reportView: {
    backgroundColor: 'white',
    width: '100%',
    height: 130,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: Platform.OS == 'ios' ? 500 : 250,
  },
  reportHeader: {
    height: 35,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reportTextInput: {
    height: 60,
    width: '100%',
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  reportFooter: {
    height: 35,
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
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDotStyle: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: Platform.OS == 'ios' ? 5 : 0
  },
});
