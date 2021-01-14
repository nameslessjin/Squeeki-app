import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import HTML from "react-native-render-html"
import { EULA, privacy_policy } from '../components/terms/terms'

const { width } = Dimensions.get('window')

export default class TermDisplay extends React.Component {

  state = {
      content: EULA
  }

  componentDidMount() {
      const {navigation, route} = this.props
      const {name} = route.params
      if (name == 'EULA'){
          this.setState({content: EULA})
      } else if (name == 'Privacy Policy'){
          this.setState({content: privacy_policy})
      }
      navigation.setOptions({
          headerBackTitleVisible: false,
          headerTitle: name
      })
  }

  render() {
      const {content} = this.state
    return <ScrollView style={styles.container}>
        <HTML source={{ html: content }} contentWidth={width}/>
    </ScrollView>;
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 10,
  },
});
