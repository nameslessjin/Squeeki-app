import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ActivityIndicator,
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

class NominationSetting extends React.Component {
  state = {
    nomination_name: '',
    period: 7,
    points: 0,
    moddleToggled: false,
    backdrop: false,
    create: true,
    loading: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    let headerTitle = 'Create nomination';
    if (!this.props.route.params.create) {
      const {
        id,
        name,
        points,
        period,
        groupId,
      } = this.props.route.params.nomination;
      this.setState({
        nomination_name: name,
        id: id,
        points: points,
        period: period,
        groupId: groupId,
        create: this.props.route.params.create,
      });
      headerTitle = 'Edit nomination';
    } else {
      this.setState({groupId: this.props.route.params.groupId});
    }

    navigation.setOptions({
      headerTitle: headerTitle,
      headerRight: () => (
        <HeaderRightButton
          update={false}
          loading={false}
          onPress={this.onCreateUpdateNomination}
        />
      ),
      headerBackTitleVisible: false
    });
  }

  componentWillUnmount() {
    const {auth, getGroupNominations, navigation, userLogout} = this.props;
    const {groupId} = this.state;
    const input = {
      token: auth.token,
      getGroupNominations: getGroupNominations,
      navigation: navigation,
      userLogout: userLogout,
      lastIndexId: null,
      groupId: groupId,
    };

    getGroupNominationsFunc(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState != this.state) {
      let update = false;
      update = this.extractData().update;
      const {navigation} = this.props;
      navigation.setOptions({
        headerRight: () => (
          <HeaderRightButton
            update={update}
            loading={this.state.loading}
            onPress={this.onCreateUpdateNomination}
          />
        ),
      });
    }
  }

  onInputChange = (type, text) => {
    if (type == 'name') {
      this.setState({nomination_name: text});
    } else if (type == 'point') {
      this.setState({points: parseInt(text) || 0});
    } else if (type == 'period') {
      this.setState({period: parseInt(text) || 0});
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
    let {nomination_name, period, points} = this.state;

    if (
      nomination_name.trim().length < 6 ||
      nomination_name.trim().length > 30
    ) {
      return false;
    }
    if (period != 0 && period != 7 && period != 14 && period != 30) {
      return false;
    }

    if (points < 0 || points > 1000000) {
      return false;
    }

    return true;
  };

  extractData = () => {
    let {nomination_name, period, points, create, id, groupId} = this.state;
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
    }

    if (nomination_name != null || points != null || period != null) {
      let {nomination_name, period, points} = this.state;
      const updateData = {
        id: create ? null : id,
        groupId: groupId,
        name: nomination_name,
        points: points,
        period: period,
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
      alert(nomination.errors[0].message);
      if (nomination.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

    navigation.goBack();
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
      alert(nomination.errors[0].message);
      if (nomination.errors[0].message == 'Not authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
    }

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
    } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.container}>
          <Input
            type={'name'}
            value={nomination_name}
            onInputChange={this.onInputChange}
          />
          <Input
            type={'period'}
            value={period}
            onInputChange={this.onInputChange}
            moddleToggled={this.onPeriodPress}
            onBackdropPress={this.onBackdropPress}
            backdrop={backdrop}
          />
          {/* <Input type={'point'} value={points.toString()} onInputChange={this.onInputChange}  /> */}
          {!create ? (
            <TouchableOpacity style={{marginTop: 10}} onPress={this.onDeleteNomination}>
              <Text style={{color: 'red'}}>Delete</Text>
            </TouchableOpacity>
          ) : null}
          {loading ? (
            <ActivityIndicator style={{marginTop: 10}} animating={true} />
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
