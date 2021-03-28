import React from 'react';
import {Image, View, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class CommentProfile extends React.Component {
  state = {
    icon_option: 'emoticon-cool-outline',
  };

  componentDidMount() {
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]});
  }


  render(){
    const {icon} = this.props
    const {icon_option} = this.state

    return (
        <View style={styles.container}>
        {icon != null ? (
          <Image source={{uri: icon.uri}} style={styles.userIcon} />
        ) : (
          <MaterialIcons name={icon_option} size={40} />
        )}
      </View>
    )
  }

}

const styles = StyleSheet.create({
    container: {
        width: '15%',
        alignItems: 'flex-start',
    },
    userIcon: {
        height: 40,
        aspectRatio: 1,
        borderRadius: 20,
      },
})