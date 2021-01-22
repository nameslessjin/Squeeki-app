import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Keyboard} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {getSingleGroupById} from '../../actions/group';
import {userLogout} from '../../actions/auth'

class GroupCard extends React.Component {

  state = {
    icon_option: 'emoticon-cool-outline'
  }

  componentDidMount() {
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    this.setState({icon_option: icon_options[random]})
  }

  onPress = async () => {
    const {id} = this.props.item;
    const {navigation, getSingleGroupById, userLogout} = this.props;
    const {token} = this.props.auth;
    const groupData = await getSingleGroupById({id: id, token: token});
    if (groupData.errors) {
      // alert(groupData.errors[0].message);
      alert('Cannot load group at this time, please try again later')
      if (groupData.errors[0].message == "Not Authenticated"){
        userLogout()
            navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    })
      }
      return;
    } else {
      Keyboard.dismiss()
      navigation.navigate('GroupNavigator');
    }
  };

  render() {
    const {
      id,
      groupname,
      shortDescription,
      memberCount,
      icon,
    } = this.props.item;
    const {
      groupContainer,
      imgHolder,
      informationContainer,
      nameMemberCountContainer,
      nameStyle,
      descriptionStyle,
      memberCountStyle,
      peopleIconStyle,
      imageStyle,
    } = styles;
    const { icon_option } = this.state
    const random = Math.floor(Math.random() * 5);
    const icon_options = [
      'emoticon-cool-outline',
      'emoticon-poop',
      'emoticon-kiss-outline',
      'emoticon-wink-outline',
      'emoticon-tongue-outline',
    ];
    return (
      <TouchableOpacity style={groupContainer} onPress={this.onPress}>
        <View style={imgHolder}>
          {icon != null ?
          <Image
            source={{
              uri: icon.uri,
            }}
            style={[imageStyle]}
          /> : <MaterialIcons name={icon_option} size={90} />}
        </View>
        <View style={informationContainer}>
          <View style={nameMemberCountContainer}>
            <Text numberOfLines={2} style={nameStyle}>
              {groupname}
            </Text>
            <View style={memberCountStyle}>
              <MaterialIcons
                style={peopleIconStyle}
                name="account-multiple"
                size={17}
              />
              <Text>{memberCount}</Text>
            </View>
          </View>
          <Text numberOfLines={3} style={descriptionStyle}>
            {shortDescription}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  groupContainer: {
    height: 130,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imgHolder: {
    aspectRatio: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginRight: 3,
  },
  imageStyle: {
    height: 90,
    aspectRatio: 1,
    borderRadius: 20,
  },
  informationContainer: {
    // backgroundColor: 'grey',
    height: 100,
    width: '70%',
    marginRight: 20,
    marginLeft: 7,
  },
  nameMemberCountContainer: {
    width: '100%',
    height: 40,
    // backgroundColor: '#74b9ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  descriptionStyle: {
    color: '#718093',
    textAlign: 'left',
  },
  memberCountStyle: {
    flexDirection: 'row',
    height: 25,
  },
  peopleIconStyle: {
    marginRight: 1,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
    userLogout: () => dispatch(userLogout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupCard);
