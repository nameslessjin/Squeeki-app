import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import HTML from 'react-native-render-html';
import {EULA, privacy_policy} from '../components/terms/terms';
import {connect} from 'react-redux';
import {getTheme} from '../utils/theme';

const {width} = Dimensions.get('window');

class TermDisplay extends React.Component {
  state = {
    content: EULA,
    theme: getTheme(this.props.auth.user.theme),
  };

  componentDidMount() {
    const {navigation, route} = this.props;
    const {theme} = this.state;
    const {name} = route.params;
    if (name == 'EULA') {
      this.setState({content: EULA});
    } else if (name == 'Privacy Policy') {
      this.setState({content: privacy_policy});
    }
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: name,
      headerStyle: [theme.backgroundColor, {shadowColor: 'transparent'}],
      headerTintColor: theme.textColor.color,
    });
  }

  render() {
    const {content, theme} = this.state;
    return (
      <ScrollView style={[styles.container, theme.greyArea]}>
        <HTML source={{html: content}} contentWidth={width}  baseFontStyle={theme.textColor} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

export default connect(mapStateToProps)(TermDisplay);
