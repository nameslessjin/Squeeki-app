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
  };

  componentDidMount() {
    // also if group auth is not there then don't put the button there
    const {auth} = this.props.group.group;
    const {navigation} = this.props;
    navigation.setOptions({
      headerTitle: 'Rules',
      headerBackTitleVisible: false,
      headerRight: () =>
        auth.rank <= 2 ? (
          <HeaderButton
            update={false}
            onPress={this.onUpdate}
            loading={false}
          />
        ) : null,
    });
    this.getGroupRule();
  }

  componentDidUpdate(prevProps, prevState) {
    // if rules updated the button will be pressable else disabled
    const {group, navigation} = this.props
    const update = (prevState.rules != this.state.rules) && prevState.rules.length != 0;
    console.log(prevState.rules)
    console.log(this.state.rules)
    console.log(update)
    const {auth} = group.group;
    navigation.setOptions({
      headerRight: () =>
        auth.rank <= 2 ? (
          <HeaderButton
            update={update}
            onPress={this.onUpdate}
            loading={this.state.loading}
          />
        ) : null,
    });
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
      console.log(req);
      // alert(req.errors[0].message);
      alert('Get group rules error');
      if (req.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    }
    this.setState({loading: false, rules: req == 0 ? '' : req});
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
      alert('Update error');
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
    const {auth} = this.props.group.group;

    const value =
      auth.rank > 2 && rules.length == 0 ? 'This group has no rules' : rules;

    // if there is no rules and user auth in group is greater than 2. Show no rules

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
              editable={auth.rank <= 2}
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
