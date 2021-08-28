import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {getGroupRankName, updateRankNames} from '../actions/group';
import {getTheme} from '../utils/theme';

class GroupRankNameSetting extends React.Component {
  state = {
    rank1Name: 'Grand',
    rank2Name: 'Pride',
    rank3Name: 'Virtue',
    rank4Name: 'Star',
    rank5Name: 'Phantom',
    rank6Name: 'Kin',
    rank7Name: 'Brave',
    ...this.props.group.rankName,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    // this.getGroupRankName();
    const {navigation, group} = this.props;
    const {theme} = this.state;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Rank Names',
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  componentWillUnmount() {
    if (this.validation()) {
      this.updateRankNames();
    }
  }

  updateRankNames = async () => {
    const {auth, group, updateRankNames} = this.props;
    const {
      rank1Name,
      rank2Name,
      rank3Name,
      rank4Name,
      rank5Name,
      rank6Name,
      rank7Name,
    } = this.state;
    const request = {
      token: auth.token,
      GroupRankNameInput: {
        rank1Name: rank1Name.trim(),
        rank2Name: rank2Name.trim(),
        rank3Name: rank3Name.trim(),
        rank4Name: rank4Name.trim(),
        rank5Name: rank5Name.trim(),
        rank6Name: rank6Name.trim(),
        rank7Name: rank7Name.trim(),
        groupId: group.group.id,
      },
    };

    const req = await updateRankNames(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot update ranks names at this time, please try again later');
      return;
    }
  };

  validation = () => {
    const {rankName} = this.props.group;

    if (
      this.state.rank1Name == rankName.rank1Name &&
      this.state.rank2Name == rankName.rank2Name &&
      this.state.rank3Name == rankName.rank3Name &&
      this.state.rank4Name == rankName.rank4Name &&
      this.state.rank5Name == rankName.rank5Name &&
      this.state.rank6Name == rankName.rank6Name &&
      this.state.rank7Name == rankName.rank7Name
    ) {
      return false;
    }

    return true;
  };

  // componentDidUpdate(prevProps, prevState) {
  //   const {rankName} = this.props.group;

  //   // if rank name is updated then set rank name to state
  //   if (prevProps.group.rankName != rankName) {
  //     this.setState({...rankName});
  //   }
  // }

  getGroupRankName = async () => {
    const {getGroupRankName, auth, group} = this.props;
    const request = {
      groupId: group.group.id,
      token: auth.token,
    };

    const req = await getGroupRankName(request);
    if (req.errors) {
      console.log(req.errors);
      alert('Cannot get rank names at this time, please try again later');
      return;
    }
  };

  onChange = (type, value) => {
    let name = value.substr(0, 30);
    if (type == 'rank1') {
      this.setState({rank1Name: name});
    } else if (type == 'rank2') {
      this.setState({rank2Name: name});
    } else if (type == 'rank3') {
      this.setState({rank3Name: name});
    } else if (type == 'rank4') {
      this.setState({rank4Name: name});
    } else if (type == 'rank5') {
      this.setState({rank5Name: name});
    } else if (type == 'rank6') {
      this.setState({rank6Name: name});
    } else if (type == 'rank7') {
      this.setState({rank7Name: name});
    }
  };

  Input = type => {
    const {
      rank1Name,
      rank2Name,
      rank3Name,
      rank4Name,
      rank5Name,
      rank6Name,
      rank7Name,
      theme,
    } = this.state;
    let title = 'Rank 1 Name';
    let value = rank1Name;
    if (type == 'rank1') {
      title = 'Rank 1 Name';
      value = rank1Name;
    } else if (type == 'rank2') {
      title = 'Rank 2 Name';
      value = rank2Name;
    } else if (type == 'rank3') {
      title = 'Rank 3 Name';
      value = rank3Name;
    } else if (type == 'rank4') {
      title = 'Rank 4 Name';
      value = rank4Name;
    } else if (type == 'rank5') {
      title = 'Rank 5 Name';
      value = rank5Name;
    } else if (type == 'rank6') {
      title = 'Rank 6 Name';
      value = rank6Name;
    } else if (type == 'rank7') {
      title = 'Rank 7 Name';
      value = rank7Name;
    }

    return (
      <View
        style={[
          styles.inputContainer,
          theme.backgroundColor,
          theme.underLineColor,
        ]}>
        <Text style={{color: 'grey'}}>{title}</Text>
        <TextInput
          style={[styles.textInputStyle, theme.textColor]}
          value={value}
          maxLength={30}
          onChangeText={t => this.onChange(type, t)}
        />
      </View>
    );
  };

  render() {
    const {theme} = this.state;
    return (
      <TouchableWithoutFeedback>
        <ScrollView style={[styles.container, theme.greyArea]}>
          {this.Input('rank1')}
          {this.Input('rank2')}
          {this.Input('rank3')}
          {this.Input('rank4')}
          {this.Input('rank5')}
          {this.Input('rank6')}
          {this.Input('rank7')}
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: 'white',
    height: 45,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
  },
  textInputStyle: {
    width: '70%',
    marginLeft: 10,
    color: 'black',
    height: 45,
  },
});

const mapStateToProps = state => {
  const {group, auth} = state;
  return {group, auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getGroupRankName: data => dispatch(getGroupRankName(data)),
    updateRankNames: data => dispatch(updateRankNames(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupRankNameSetting);
