import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Keyboard,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {getSingleGroupById} from '../../actions/group';
import {userLogout} from '../../actions/auth';
import {singleDefaultIcon} from '../../utils/defaultIcon';

class GroupCard extends React.Component {
  onPress = async () => {
    const {
      prevRoute,
      item,
      auth,
      navigation,
      getSingleGroupById,
      userLogout,
    } = this.props;

    // if prevRoute is rewardSetting, go back and pass the group data backward.  Used in search group to gift to
    if (prevRoute == 'rewardSetting') {
      const {id, groupname, display_name} = item;
      navigation.navigate('RewardSetting', {
        giftTo: {
          id,
          groupname,
          display_name
        },
      });

      return;
    }

    // the default is to load group and navigate to group page
    const groupData = await getSingleGroupById({
      id: item.id,
      token: auth.token,
    });
    if (groupData.errors) {
      console.log(groupData.errors[0].message);
      alert('Cannot load group at this time, please try again later');
      if (groupData.errors[0].message == 'Not Authenticated') {
        userLogout();
        navigation.reset({
          index: 0,
          routes: [{name: 'SignIn'}],
        });
      }
      return;
    } else {
      Keyboard.dismiss();
      // direct to group page after search
      navigation.navigate('GroupNavigator', {
        prevRoute: 'GroupGeneral'
      });
    }
  };

  render() {
    const {route, item} = this.props;
    const {
      id,
      groupname,
      shortDescription,
      display_name,
      memberCount,
      icon,
    } = item;
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

    return (
      <TouchableOpacity style={groupContainer} onPress={this.onPress}>
        <View style={imgHolder}>
          <Image
            source={icon ? {uri: icon.uri} : singleDefaultIcon()}
            style={imageStyle}
          />
        </View>
        <View style={informationContainer}>
          <View style={nameMemberCountContainer}>
            <View style={{width: '85%'}}>
              <Text numberOfLines={2} style={nameStyle}>
                {display_name}
              </Text>
              {route == 'search' ? (
                <Text
                  numberOfLines={2}
                  style={[nameStyle, {color: 'grey', fontSize: 13}]}>
                  g@{groupname}
                </Text>
              ) : null}
            </View>
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
    minHeight: 130,
    maxHeight: 140,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  imgHolder: {
    aspectRatio: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 5,
    marginRight: 3,
  },
  imageStyle: {
    height: 90,
    aspectRatio: 1,
    borderRadius: 20,
  },
  informationContainer: {
    minHeight: 100,
    maxHeight: 110,
    width: '70%',
    marginRight: 20,
    marginLeft: 7,
  },
  nameMemberCountContainer: {
    width: '100%',
    // minHeight: 40,
    maxHeight: 40,
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
    width: '90%',
    marginTop: 5,
  },
  memberCountStyle: {
    flexDirection: 'row',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center'
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
    userLogout: () => dispatch(userLogout()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupCard);
