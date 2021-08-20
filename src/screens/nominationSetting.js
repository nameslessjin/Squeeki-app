import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/nominationSetting/headerRightButton';
import Input from '../components/nominationSetting/input';
import {userLogout} from '../actions/auth';
import {
  createNomination,
  updateNomination,
  getGroupNominations,
  deleteNomination,
} from '../actions/nomination';
import {getGroupNominationsFunc} from '../functions/nomination';
import {getTheme} from '../utils/theme';

class NominationSetting extends React.Component {
  state = {
    nomination_name: '',
    period: 7,
    points: 100,
    type: 'reward',
    moddleToggled: false,
    backdrop: false,
    create: true,
    loading: false,
    id: null,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation} = this.props;
    const {theme} = this.state;
    let headerTitle = 'Create nomination';
    if (!this.props.route.params.create) {
      const {
        id,
        name,
        points,
        period,
        groupId,
        type,
      } = this.props.route.params.nomination;
      this.setState({
        nomination_name: name,
        id: id,
        points: points,
        period: period,
        groupId: groupId,
        type: type,
        create: this.props.route.params.create,
      });
      headerTitle = 'Edit nomination';
    } else {
      this.setState({groupId: this.props.route.params.groupId});
    }

    navigation.setOptions({
      headerTitle: headerTitle,
      headerRight: () =>
        this.props.route.params.create ? (
          <HeaderRightButton
            update={false}
            loading={false}
            onPress={this.onCreateUpdateNomination}
            theme={theme}
          />
        ) : null,
      headerBackTitleVisible: false,
      headerStyle: theme.backgroundColor,
      headerTintColor: theme.textColor.color,
    });
  }

  componentWillUnmount() {
    if (this.extractData().update && !this.props.route.params.create) {
      this.onCreateUpdateNomination();
    }
  }

  loadNomination = () => {
    const {auth, getGroupNominations, navigation, userLogout} = this.props;
    const {groupId} = this.state;
    const input = {
      token: auth.token,
      getGroupNominations: getGroupNominations,
      navigation: navigation,
      userLogout: userLogout,
      groupId: groupId,
    };

    getGroupNominationsFunc(input);
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      const {id, theme} = this.state;
      let update = false;
      update = this.extractData().update;
      const {navigation} = this.props;
      navigation.setOptions({
        headerRight: () =>
          this.props.route.params.create ? (
            <HeaderRightButton
              update={update}
              loading={this.state.loading}
              onPress={this.onCreateUpdateNomination}
              theme={theme}
            />
          ) : null,
      });
    }
  }

  onInputChange = (type, text) => {
    if (type == 'name') {
      this.setState({nomination_name: text});
    } else if (type == 'point') {
      this.setState({points: parseInt(text) || 0});
    } else if (type == 'period') {
      // this.setState({period: parseInt(text) || 0});
    } else if (type == 'type') {
      const {type} = this.state;
      let value = 'reward';
      if (type == 'reward') {
        value = 'neutral';
      } else if (type == 'neutral') {
        value = 'penalty';
      } else if (type == 'penalty') {
        value = 'reward';
      }
      this.setState({type: value});
    }
  };

  onPeriodPress = () => {
    Keyboard.dismiss();
    this.setState({backdrop: true});
  };

  onBackdropPress = () => {
    this.setState({backdrop: false});
  };

  validation = () => {
    let {nomination_name, period, points, type} = this.state;

    if (
      nomination_name.trim().length < 6 ||
      nomination_name.trim().length > 30
    ) {
      return false;
    }
    if (period != 0 && period != 7 && period != 14 && period != 30) {
      return false;
    }

    return true;
  };

  extractData = () => {
    let {
      nomination_name,
      period,
      points,
      create,
      id,
      groupId,
      type,
    } = this.state;
    nomination_name = nomination_name.trim();
    let origin = null;
    if (!create) {
      origin = {
        ...this.props.route.params.nomination,
      };
      if (origin.name == nomination_name) {
        nomination_name = null;
      }
      if (origin.points == points) {
        points = null;
      }
      if (origin.period == period) {
        period = null;
      }
      if (origin.type == type) {
        type = null;
      }
    }

    if (
      nomination_name != null ||
      points != null ||
      period != null ||
      type != null
    ) {
      let reward_point = 100;
      let {nomination_name, period, points, type} = this.state;
      if (type == 'neutral') {
        reward_point = 0;
      } else if (type == 'penalty') {
        reward_point = -100;
      }
      const updateData = {
        id: create ? null : id,
        groupId: groupId,
        name: nomination_name,
        points: reward_point,
        period: period,
        type: type,
        token: this.props.auth.token,
      };

      return {
        updateData: updateData,
        update: this.validation(),
        origin: origin,
      };
    } else {
      return {update: false};
    }
  };

  onCreateUpdateNomination = async () => {
    const {
      userLogout,
      navigation,
      createNomination,
      updateNomination,
    } = this.props;
    const {create} = this.state;

    const {updateData, origin} = this.extractData();
    let nomination = 0;

    if (create) {
      this.setState({loading: true});
      nomination = await createNomination(updateData);
    } else {
      nomination = await updateNomination(updateData);
    }
    this.setState({loading: false});

    if (nomination.errors) {
      console(nomination.errors[0].message);
      alert(
        'Cannot create/update nomination at this time, please try again later',
      );
      if (nomination.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    this.loadNomination();

    if (this.props.route.params.create) {
      navigation.goBack();
    }
  };

  onDeleteNomination = async () => {
    const {id} = this.state;
    const {deleteNomination, auth, navigation, userLogout} = this.props;

    const data = {
      id: id,
      token: auth.token,
    };

    this.setState({loading: true});
    const nomination = await deleteNomination(data);
    this.setState({loading: false});

    if (nomination.errors) {
      // alert(nomination.errors[0].message);
      alert('Cannot delete nomination at this time, please try again later');
      if (nomination.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    this.loadNomination();

    navigation.goBack();
  };

  render() {
    const {
      nomination_name,
      points,
      period,
      backdrop,
      loading,
      create,
      type,
      theme,
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={[styles.container, theme.greyArea]}>
          <StatusBar barStyle={'dark-content'} />
          <Input
            type={'name'}
            value={nomination_name}
            onInputChange={this.onInputChange}
            theme={theme}
          />
          <Input
            type={'period'}
            value={period}
            onInputChange={this.onInputChange}
            moddleToggled={this.onPeriodPress}
            onBackdropPress={this.onBackdropPress}
            backdrop={backdrop}
            theme={theme}
          />
          {/* <Input
            type={'type'}
            value={type}
            onInputChange={this.onInputChange}
            theme={theme}
          /> */}
          {/* <Input type={'point'} value={points.toString()} onInputChange={this.onInputChange}  /> */}
          {!create ? (
            <TouchableOpacity
              style={{marginTop: 10}}
              onPress={this.onDeleteNomination}>
              <Text style={{color: 'red'}}>Delete</Text>
            </TouchableOpacity>
          ) : null}
          {loading ? (
            <ActivityIndicator
              style={{marginTop: 10}}
              animating={true}
              color={'grey'}
            />
          ) : null}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    createNomination: data => dispatch(createNomination(data)),
    updateNomination: data => dispatch(updateNomination(data)),
    getGroupNominations: data => dispatch(getGroupNominations(data)),
    deleteNomination: data => dispatch(deleteNomination(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NominationSetting);
