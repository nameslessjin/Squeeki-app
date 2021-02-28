import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Modal,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

export default class CommentModal extends React.Component {
  state = {
    is_report_toggled: false,
    report_content: '',
    onReport: false,
  };

  onPress = type => {
    const {onCommentDelete} = this.props;

    if (type == 'delete') {
      onCommentDelete();
    } else {
      this.setState({is_report_toggled: true});
    }
  };

  onBackdropPress = () => {
    const {onBackdropPress} = this.props;
    this.setState({is_report_toggled: false, report_content: ''});
    onBackdropPress();
  };

  onReportInput = content => {
    this.setState({report_content: content});
  };

  onSubmitReport = async () => {
    const {report_content} = this.state;
    const {onCommentReport} = this.props;
    this.setState({onReport: true});
    await onCommentReport(report_content);
    this.setState({onReport: false});
    this.onBackdropPress();
  };

  render() {
    const {
      modalVisible,
      comment_uid,
      userId,
      postOwner,
      rank_in_group,
      rank_required,
    } = this.props;
    const {is_report_toggled, report_content, onReport} = this.state;

    // comment owner and post owner and people with proper rank can deletet comment
    const owner = comment_uid == userId;
    const post_owner = postOwner.id == userId;
    const rank_permitted = rank_in_group
      ? rank_in_group <= rank_required
      : false;

    const report_interface = (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.reportView}>
          <View style={styles.reportHeader}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Report</Text>
          </View>
          <View style={styles.reportTextInput}>
            <TextInput
              placeholder={'Reason to report ...'}
              placeholderTextColor={'#7f8fa6'}
              style={{width: '100%', height: '100%'}}
              multiline={true}
              maxLength={100}
              value={report_content}
              onChangeText={t => this.onReportInput(t)}
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
              disabled={report_content.length == 0 || onReport}
              onPress={this.onSubmitReport}>
              <Text
                style={{
                  fontSize: 15,
                  color: report_content.length == 0 ? '#7f8fa6' : null,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={this.onBackdropPress}>
              <Text style={{color: 'red'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );

    return (
      <View style={[styles.centeredView]}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <TouchableWithoutFeedback onPress={this.onBackdropPress}>
            <View style={[styles.centeredView]}>
              {is_report_toggled ? (
                report_interface
              ) : (
                <View style={[styles.modalView]}>
                  {owner ? null : (
                    <TouchableOpacity onPress={() => this.onPress('report')}>
                      <View style={styles.button}>
                        <Text>Report</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {(post_owner || rank_permitted ) && !owner ? <View style={styles.underline} /> : null}
                  {owner || post_owner || rank_permitted ? (
                    <TouchableOpacity onPress={() => this.onPress('delete')}>
                      <View style={styles.button}>
                        <Text>Delete</Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  <View style={styles.underline} />
                  <TouchableOpacity onPress={this.onBackdropPress}>
                    <View style={styles.button}>
                      <Text style={{color: 'red'}}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
    elevation: 5,
    height: 120,
    width: 300,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  underline: {
    width: 300,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'silver',
  },
  button: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  reportView: {
    backgroundColor: 'white',
    width: '95%',
    height: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 100,
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
    padding: 5,
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
