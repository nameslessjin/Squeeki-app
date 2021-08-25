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
        default:
          return false;
      }
    }
    return false;
  };

  onBackgroundPress = () => {
    this.setState({comment: '', addComment: false});
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
            style: 'destructive',
            onPress: () =>
              action == 'activate'
                ? this.onAction({type, action: this.state.action, comment})
                : this.onPress('confirm'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
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
    const {addComment, comment, loading} = this.state;
    const suspendable = this.securityClearanceCheck(
      'suspend' + type[0].toUpperCase() + type.substr(1, type.length),
    );
    const deletable = this.securityClearanceCheck(
      'delete' + type[0].toUpperCase() + type.substr(1, type.length),
    );
    const activatable = this.securityClearanceCheck(
      'activate' + type[0].toUpperCase() + type.substr(1, type.length),
    );

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
