import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderRightButton from '../components/nomination/headerRightButton';
import {getGroupNominations, turnNomination} from '../actions/nomination';
import {userLogout} from '../actions/auth';
import {getGroupNominationsFunc} from '../functions/nomination';
import NominationList from '../components/nomination/nominationList';

class Nomination extends React.Component {
  state = {
    chosenUser: {},
    nomination: {},
    loading: false,
  };

  componentDidMount() {
    const {navigation, auth, userLogout, getGroupNominations, group} = this.props;
    const {params} = this.props.route;
    if (params) {
      this.setState({
        chosenUser: params.chosenUser,
        prev_route: params.prev_route,
        groupId: params.groupId,
      });

      const input = {
        token: auth.token,
        getGroupNominations: getGroupNominations,
        navigation: navigation,
        userLogout: userLogout,
        groupId: params.groupId,
      };
      getGroupNominationsFunc(input);
    }

    let button = group.group.auth.rank > 2 ? null : (
      <HeaderRightButton
        type={'create'}
        disabled={false}
        onPress={this.onHeaderRightButtonPress}
      />
    );

    if (params.prev_route == 'PostSetting') {
      button = (
        <HeaderRightButton
          type={'submit'}
          disabled={true}
          onPress={this.onHeaderRightButtonPress}
        />
      );
    }
    
    navigation.setOptions({
      headerRight: () => button,
      headerBackTitleVisible: false
    });
  }

  componentDidUpdate() {
    const {prev_route, chosenUser, nomination} = this.state;
    const {navigation, group} = this.props;
    let disabled = false;

    let button = group.group.auth.rank > 2 ? null : (
      <HeaderRightButton
        type={'create'}
        disabled={false}
        onPress={this.onHeaderRightButtonPress}
      />
    );

    if (prev_route == 'PostSetting') {
    if (chosenUser.id == null || nomination.id == null) {
      disabled = true;
    }
      button = (
        <HeaderRightButton
          type={'submit'}
          disabled={disabled}
          onPress={this.onHeaderRightButtonPress}
        />
      );
    }
    navigation.setOptions({
      headerRight: () => button,
    });
  }

  onEditPressed = item => {
    const {navigation} = this.props;
    const {groupId} = this.state;
    navigation.navigate('NominationSetting', {
      create: false,
      nomination: item,
    });
  };

  onHeaderRightButtonPress = () => {
    const {navigation} = this.props;
    const {prev_route, groupId, chosenUser, nomination} = this.state;

    if (prev_route == 'PostSetting') {
      navigation.navigate(prev_route, {
        chosenUser: chosenUser,
        nomination: nomination
      });
    } else {
      navigation.navigate('NominationSetting', {
        create: true,
        groupId: groupId,
      });
    }
  };

  onNominationSelect = n => {
    const {nomination} = this.state;
   
    if (nomination != n) {
      this.setState({nomination: n});
    } else {
      this.setState({nomination: {}});
    }
  };

  render() {
    let {nominations} = this.props;
    const {prev_route} = this.state;

    nominations = nominations.map(n => {
      if (n.id == this.state.nomination.id){
        return {
          ...n,
          selected: true
        }
      }
      return {
        ...n,
        selected: false
      }
    })


    return (
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <StatusBar barStyle={'dark-content'} />
          <NominationList
            nominations={nominations}
            onEditPress={this.onEditPressed}
            prev_route={prev_route}
            onNominationSelect={this.onNominationSelect}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = state => {
  const {auth, group} = state;
  return {auth, nominations: group.group.nominations || [], group};
};

const mapDispatchToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    getGroupNominations: data => dispatch(getGroupNominations(data)),
    turnNomination: data => dispatch(turnNomination(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Nomination);
