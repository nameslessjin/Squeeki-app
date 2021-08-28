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
import {getTheme} from '../utils/theme';

class GroupRules extends React.Component {
  state = {
    rules: '',
    loading: false,
    rules_duplicate: '',
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    // also if group auth is not there then don't put the button there
    const {navigation} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerTitle: 'Rules',
      headerBackTitleVisible: false,
      headerRight: () => (
        <HeaderButton
          loading={false}
          onPress={this.onUpdate}
          update={false}
          theme={theme}
        />
      ),
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
    this.getGroupRule();
  }

  componentDidUpdate(prevProps, prevState) {
    const {theme} = this.state;
    if (prevState != this.state) {
      const update = this.validation();
      this.props.navigation.setOptions({
        headerRight: () => (
          <HeaderButton
            loading={false}
            onPress={this.onUpdate}
            update={update}
            theme={theme}
          />
        ),
      });
    }
  }

  componentWillUnmount() {
    const {group, navigation} = this.props;
    if (group.group.id) {
      navigation.navigate('GroupNavigator', {
        refresh: true,
        prevRoute: 'GroupRules',
      });
    }
  }

  validation = () => {
    const {rules, rules_duplicate} = this.state;
    const {auth, rank_setting} = this.props.group.group;

    if (rules.length == 0) {
      return false;
    }

    if (rules == rules_duplicate) {
      return false;
    }

    if (auth.rank > rank_setting.group_setting_rank_required) {
      return false;
    }

    return true;
  };

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

    Keyboard.dismiss();

    this.setState({loading: false, rules_duplicate: rules});
  };

  render() {
    const {rules, theme} = this.state;
    const {auth, rank_setting} = this.props.group.group;

    // if there is no rules and user auth in group is greater than group setting rank requirement. Show no rules
    const value =
      auth.rank > rank_setting.group_setting_rank_required && rules.length == 0
        ? 'This group has no rules'
        : rules;

    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={[styles.container, theme.backgroundColor]}>
          <StatusBar barStyle={'dark-content'} />
          <ScrollView style={styles.scrollView}>
            <TextInput
              style={theme.textColor}
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
