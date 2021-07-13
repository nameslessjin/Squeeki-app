import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {onGroupRulesUpdate, getGroupRules} from '../actions/group';
import {userLogout} from '../actions/auth';
import HeaderButton from '../components/groupRules/headerButton';

class GroupRules extends React.Component {
  state = {
    rules: '',
    loading: false,
    rules_duplicate: '',
  };

  componentDidMount() {
    // also if group auth is not there then don't put the button there
    const {navigation} = this.props;
    navigation.setOptions({
      headerTitle: 'Rules',
      headerBackTitleVisible: false,
    });
    this.getGroupRule();
  }

  componentWillUnmount() {
    // update rules if it changes
    const {rules, rules_duplicate} = this.state;
    if (rules_duplicate != rules && rules_duplicate.length != 0) {
      const {auth, rank_setting} = this.props.group.group;
      if (auth.rank <= rank_setting.group_setting_rank_required) {
        console.log('here')
        this.onUpdate();
      }
    }
  }

  getGroupRule = async () => {
    const {auth, group, userLogout, navigation, getGroupRules} = this.props;
    const request = {
      token: auth.token,
      groupId: group.group.id,
    };

    this.setState({loading: true});
    const req = await getGroupRules(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot get group rules at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.setState({
      loading: false,
      rules: req == 0 ? '' : req,
      rules_duplicate: req == 0 ? '' : req,
    });
  };

  onUpdate = async () => {
    const {
      auth,
      group,
      userLogout,
      navigation,
      onGroupRulesUpdate,
    } = this.props;
    const {rules} = this.state;
    const request = {
      token: auth.token,
      groupId: group.group.id,
      rules: rules.trim(),
    };

    this.setState({loading: true});
    const req = await onGroupRulesUpdate(request);
    if (req.errors) {
      // alert(req.errors[0].message);
      alert('Cannot update group rules at this time, please try again later');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }

    this.setState({loading: false});
  };

  render() {
    const {rules} = this.state;
    const {auth, rank_setting} = this.props.group.group;

    // if there is no rules and user auth in group is greater than group setting rank requirement. Show no rules
    const value =
      auth.rank > rank_setting.group_setting_rank_required && rules.length == 0
        ? 'This group has no rules'
        : rules;

    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <ScrollView style={styles.scrollView}>
            <TextInput
              placeholder={'Write about rules for this group...'}
              placeholderTextColor={'grey'}
              onChangeText={v => this.setState({rules: v})}
              value={value}
              multiline={true}
              maxLength={5000}
              editable={auth.rank <= rank_setting.group_setting_rank_required}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    padding: 10,
  },
  scrollView: {
    width: '100%',
    height: '100%',
    padding: 5,
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    onGroupRulesUpdate: data => dispatch(onGroupRulesUpdate(data)),
    getGroupRules: data => dispatch(getGroupRules(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupRules);
