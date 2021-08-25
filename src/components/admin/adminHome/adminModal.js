import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';

export default class AdminModal extends React.Component {
  state = {
    addComment: false,
    comment: '',
    action: 'activate',
    loading: false,
    changeAdmin: false,
    changeAdminProcess: 'changeSecurityClearanceStatus',
    securityClearanceLvl: 0,
    securityClearanceStatus: 'suspended',
    searchUserClearance: false,
    suspendUserClearance: false,
    searchGroupClearance: false,
    suspendGroupClearance: false,
    searchPostClearance: false,
    suspendPostClearance: false,
    searchCommentClearance: false,
    suspendCommentClearance: false,
  };

  securityClearanceCheck = type => {
    const {securityClearanceLvl, securityClearance, status} = this.props;
    const {
      suspendUserClearance,
      deleteUserClearance,
      suspendGroupClearance,
      deleteGroupClearance,
      suspendPostClearance,
      deletePostClearance,
      suspendCommentClearance,
      deleteCommentClearance,
    } = securityClearance;

    // if my security clearance level is greater than that of the user, poster, commentor
    if (securityClearanceLvl < securityClearance.securityClearanceLvl) {
      switch (type) {
        case 'suspendUser':
          return status != 'deleted' && status != 'suspended'
            ? suspendUserClearance &&
                securityClearance.securityClearanceLvl >= 2
            : false;
        case 'deleteUser':
          return status != 'deleted'
            ? deleteUserClearance && securityClearance.securityClearanceLvl >= 4
            : false;
        case 'activateUser':
          return status == 'suspended'
            ? suspendUserClearance &&
                securityClearance.securityClearanceLvl >= 2
            : status == 'deleted'
            ? deleteUserClearance && securityClearance.securityClearanceLvl >= 4
            : false;
        case 'suspendGroup':
          return status != 'deleted' && status != 'suspended'
            ? suspendGroupClearance &&
                securityClearance.securityClearanceLvl >= 2
            : false;
        case 'deleteGroup':
          return status != 'deleted'
            ? deleteGroupClearance &&
                securityClearance.securityClearanceLvl >= 4
            : false;
        case 'activateGroup':
          return status == 'suspended'
            ? suspendGroupClearance &&
                securityClearance.securityClearanceLvl >= 2
            : status == 'deleted'
            ? deleteGroupClearance &&
              securityClearance.securityClearanceLvl >= 4
            : false;
        case 'suspendPost':
          return status != 'deleted' && status != 'suspended'
            ? suspendPostClearance &&
                securityClearance.securityClearanceLvl >= 1
            : false;
        case 'deletePost':
          return status != 'deleted'
            ? deletePostClearance && securityClearance.securityClearanceLvl >= 2
            : false;
        case 'activatePost':
          return status == 'suspended'
            ? suspendPostClearance &&
                securityClearance.securityClearanceLvl >= 1
            : status == 'deleted'
            ? deletePostClearance && securityClearance.securityClearanceLvl >= 2
            : false;
        case 'suspendComment':
          return status != 'deleted' && status != 'suspended'
            ? suspendCommentClearance &&
                securityClearance.securityClearanceLvl >= 1
            : false;
        case 'deleteComment':
          return status != 'deleted'
            ? deleteCommentClearance &&
                securityClearance.securityClearanceLvl >= 2
            : false;
        case 'activateComment':
          return status == 'suspended'
            ? suspendCommentClearance &&
                securityClearance.securityClearanceLvl >= 1
            : status == 'deleted'
            ? deleteCommentClearance &&
              securityClearance.securityClearanceLvl >= 2
            : false;
        case 'changeAdmin':
          return (
            this.props.type == 'user' &&
            status == 'active' &&
            securityClearance.securityClearanceLvl >= 4
          );
        default:
          return false;
      }
    }
    return false;
  };

  onBackgroundPress = () => {
    this.setState({
      addComment: false,
      comment: '',
      action: 'activate',
      loading: false,
      changeAdmin: false,
      changeAdminProcess: 'changeSecurityClearanceStatus',
      securityClearanceLvl: 0,
      securityClearanceStatus: 'suspended',
      searchUserClearance: false,
      suspendUserClearance: false,
      searchGroupClearance: false,
      suspendGroupClearance: false,
      searchPostClearance: false,
      suspendPostClearance: false,
      searchCommentClearance: false,
      suspendCommentClearance: false,
    });
    this.props.onBackgroundPress();
  };

  onAction = async data => {
    this.setState({loading: true});
    await this.props.onAction(data);
    this.onBackgroundPress();
    this.setState({loading: false});
  };

  onPress = action => {
    const {type, onAction} = this.props;
    const {addComment, comment} = this.state;
    if (
      action == 'suspend' ||
      action == 'delete' ||
      action == 'submit' ||
      action == 'activate'
    ) {
      Alert.alert(
        action == 'submit'
          ? `${this.state.action} this ${type}`
          : `${action} this ${type}`,
        null,
        [
          {
            text: 'Confirm',
            style: action == 'submit' ? 'default' : 'destructive',
            onPress: () =>
              action == 'activate'
                ? this.onAction({type, action: this.state.action, comment})
                : this.onPress('confirm'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: this.onBackgroundPress,
          },
        ],
      );
      this.setState(prevState => ({
        action: action != 'submit' ? action : prevState.action,
      }));
    } else if (action == 'confirm') {
      if (addComment && comment.length > 0) {
        const data = {
          comment,
          type,
          action: this.state.action,
        };
        this.onAction(data);
      } else {
        this.setState({addComment: true, comment: ''});
      }
    } else if (action == 'changeAdmin') {
      this.setState({changeAdmin: true});
    }
  };

  updateSecurityClearance = () => {
    const input = {
      status: this.state.securityClearanceStatus,
      securityClearanceLvl: this.state.securityClearanceLvl,
      searchUserClearance: this.state.searchUserClearance,
      suspendUserClearance: this.state.suspendUserClearance,
      searchGroupClearance: this.state.searchGroupClearance,
      suspendGroupClearance: this.state.suspendGroupClearance,
      searchPostClearance: this.state.searchPostClearance,
      suspendPostClearance: this.state.suspendPostClearance,
      searchCommentClearance: this.state.searchCommentClearance,
      suspendCommentClearance: this.state.suspendCommentClearance,
    };
    this.props.updateSecurityClearance(input);
    this.onBackgroundPress();
  };

  onSecurityClearanceUpdate = value => {
    const {changeAdminProcess, securityClearanceLvl} = this.state;
    switch (changeAdminProcess) {
      case 'changeSecurityClearanceStatus':
        this.setState({
          changeAdminProcess: 'changeClearanceLevel',
          securityClearanceStatus: value,
        });
        if (value != 'active') {
          this.updateSecurityClearance();
        }
        break;
      case 'changeClearanceLevel':
        this.setState({
          changeAdminProcess: 'changeSearchUser',
          securityClearanceLvl: value,
        });
        break;
      case 'changeSearchUser':
        this.setState({
          changeAdminProcess:
            securityClearanceLvl >= 2
              ? 'changeSuspendUser'
              : 'changeSearchGroup',
          searchUserClearance: value,
        });
        break;
      case 'changeSuspendUser':
        this.setState({
          changeAdminProcess: 'changeSearchGroup',
          suspendUserClearance: securityClearanceLvl >= 2 ? value : false,
        });
        break;
      case 'changeSearchGroup':
        this.setState({
          changeAdminProcess:
            securityClearanceLvl >= 2
              ? 'changeSuspendGroup'
              : 'changeSearchPost',
          searchGroupClearance: value,
        });
        break;
      case 'changeSuspendGroup':
        this.setState({
          changeAdminProcess: 'changeSearchPost',
          suspendGroupClearance: securityClearanceLvl >= 2 ? value : false,
        });
        break;
      case 'changeSearchPost':
        this.setState({
          changeAdminProcess:
            securityClearanceLvl >= 1
              ? 'changeSuspendPost'
              : 'changeSuspendComment',
          searchPostClearance: value,
        });
        break;
      case 'changeSuspendPost':
        this.setState({
          changeAdminProcess: 'changeSearchComment',
          suspendPostClearance: securityClearanceLvl >= 1 ? value : false,
        });
        break;
      case 'changeSearchComment':
        this.setState({
          changeAdminProcess: 'changeSuspendComment',
          searchCommentClearance: value,
        });
        break;
      case 'changeSuspendComment':
        // alert to confirm
        this.setState({
          suspendCommentClearance: securityClearanceLvl >= 1 ? value : false,
        });

        Alert.alert(
          'Update clearance',
          'Are you sure to update clearance level of this user?',
          [
            {
              text: 'Confirm',
              style: 'default',
              onPress: this.updateSecurityClearance,
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: this.onBackgroundPress,
            },
          ],
        );
        break;
      default:
        this.onBackgroundPress();
        break;
    }
  };

  onInputChange = t => {
    const lineCount = t.split(/\r\n|\r|\n/).length;
    const valueSplit = t.substr(0, 255).split('\n');
    if (lineCount >= 15) {
      this.setState({report: valueSplit.slice(0, 15).join('\n')});
      return;
    }

    this.setState({comment: t});
  };

  displayModal = () => {
    const {type, theme} = this.props;
    const {
      addComment,
      comment,
      loading,
      changeAdmin,
      changeAdminProcess,
    } = this.state;
    const suspendable = this.securityClearanceCheck(
      'suspend' + type[0].toUpperCase() + type.substr(1, type.length),
    );
    const deletable = this.securityClearanceCheck(
      'delete' + type[0].toUpperCase() + type.substr(1, type.length),
    );
    const activatable = this.securityClearanceCheck(
      'activate' + type[0].toUpperCase() + type.substr(1, type.length),
    );

    const changeAdminEnable = this.securityClearanceCheck('changeAdmin');

    let modal = (
      <View
        style={[styles.modalView, theme.backgroundColor, theme.shadowColor]}>
        <TouchableOpacity onPress={this.onBackgroundPress}>
          <View style={styles.button}>
            <Text style={{color: 'red'}}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </View>
    );

    if (addComment) {
      modal = (
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView
            style={[
              styles.modalView,
              theme.backgroundColor,
              theme.shadowColor,
              {marginBottom: Platform.OS == 'ios' ? 250 : 150},
            ]}>
            <View style={styles.reportHeader}>
              <Text
                style={[{fontSize: 18, fontWeight: 'bold'}, theme.textColor]}>
                Report
              </Text>
            </View>
            <View style={styles.reportTextInput}>
              <TextInput
                placeholder={'Add comment ...'}
                placeholderTextColor={'#7f8fa6'}
                style={[{width: '100%'}, theme.textColor]}
                multiline={true}
                maxLength={255}
                value={comment}
                onChangeText={t => this.onInputChange(t)}
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
                disabled={comment.length == 0 || loading}
                onPress={() => this.onPress('submit')}>
                <Text
                  style={{
                    fontSize: 15,
                    color:
                      comment.length == 0 ? '#7f8fa6' : theme.textColor.color,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={this.onBackgroundPress}>
                <Text style={{color: 'red'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      );
    } else if (changeAdmin) {
      let title = 'Change Security Clearance Status';

      switch (changeAdminProcess) {
        case 'changeSecurityClearanceStatus':
          title = 'Update Status';
          break;
        case 'changeClearanceLevel':
          title = 'Clearance Level';
          break;
        case 'changeSearchUser':
          title = 'Allow search users';
          break;
        case 'changeSuspendUser':
          title = 'Allow suspend users';
          break;
        case 'changeSearchGroup':
          title = 'Allow search groups';
          break;
        case 'changeSuspendGroup':
          title = 'Allow suspend groups';
          break;
        case 'changeSearchPost':
          title = 'Allow search posts';
          break;
        case 'changeSuspendPost':
          title = 'Allow suspend posts';
          break;
        case 'changeSearchComment':
          title = 'Allow search comments';
          break;
        case 'changeSuspendComment':
          title = 'Allow suspend comments';
          break;
        default:
          title = 'Change Security Clearance Status';
          break;
      }

      modal = (
        <View
          style={[styles.modalView, theme.backgroundColor, theme.shadowColor]}>
          <View style={[styles.reportHeader, theme.underLineColor]}>
            <Text style={[{fontSize: 18, fontWeight: 'bold'}, theme.textColor]}>
              {title}
            </Text>
          </View>
          {changeAdminProcess == 'changeClearanceLevel' ? (
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate(0)}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Level 0</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate(1)}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Level 1</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate(2)}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Level 2</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate(3)}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Level 3</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
            </View>
          ) : changeAdminProcess == 'changeSecurityClearanceStatus' ? (
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate('active')}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Active</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate('suspended')}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Suspended</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
            </View>
          ) : (
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate(true)}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Allow</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => this.onSecurityClearanceUpdate(false)}>
                  <View style={styles.button}>
                    <Text style={theme.textColor}>Don't allow</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.underline, theme.underLineColor]} />
              </View>
            </View>
          )}
          <TouchableOpacity onPress={this.onBackgroundPress}>
            <View style={styles.button}>
              <Text style={{color: 'red'}}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      modal = (
        <View
          style={[styles.modalView, theme.backgroundColor, theme.shadowColor]}>
          {suspendable ? (
            <View>
              <TouchableOpacity onPress={() => this.onPress('suspend')}>
                <View style={styles.button}>
                  <Text style={theme.textColor}>Suspend</Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.underline, theme.underLineColor]} />
            </View>
          ) : null}
          {deletable ? (
            <View>
              <TouchableOpacity onPress={() => this.onPress('delete')}>
                <View style={styles.button}>
                  <Text style={theme.textColor}>Delete</Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.underline, theme.underLineColor]} />
            </View>
          ) : null}
          {activatable ? (
            <View>
              <TouchableOpacity onPress={() => this.onPress('activate')}>
                <View style={styles.button}>
                  <Text style={theme.textColor}>Activate</Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.underline, theme.underLineColor]} />
            </View>
          ) : null}
          {changeAdminEnable ? (
            <View>
              <TouchableOpacity onPress={() => this.onPress('changeAdmin')}>
                <View style={styles.button}>
                  <Text style={theme.textColor}>Update Clearance</Text>
                </View>
              </TouchableOpacity>
              <View style={[styles.underline, theme.underLineColor]} />
            </View>
          ) : null}
          <TouchableOpacity onPress={this.onBackgroundPress}>
            <View style={styles.button}>
              <Text style={{color: 'red'}}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return modal;
  };

  render() {
    const {modalVisible, theme, type, addComment, comment} = this.props;
    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={this.onBackgroundPress}>
            <View style={[styles.centeredView]}>{this.displayModal()}</View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    zIndex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    width: 300,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  underline: {
    width: 300,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  button: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
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
});
