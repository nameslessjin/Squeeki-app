import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {connect} from 'react-redux';
import {changeScreen} from '../actions/screen';

class Reward extends React.Component {
//   componentDidMount() {
//     const {navigation, changeScreen} = this.props;
//     changeScreen('reward')
//   }

  render() {
    return (
      <View>
          <StatusBar barStyle={'dark-content'} />
        <Text>First reward page</Text>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {group} = state;
  return {group};
};

const mapDispatchToProps = dispatch => {
  return {
    changeScreen: data => dispatch(changeScreen(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Reward);
