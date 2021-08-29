import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {getSingleGroupById} from '../../actions/group';
import {singleDefaultIcon} from '../../utils/defaultIcon';
import {getTheme} from '../../utils/theme';
import TagList from '../tags/tagList';

const {width} = Dimensions.get('screen');

class RecommendedGroupCard extends React.Component {
  state = {
    theme: getTheme(this.props.auth.user.theme),
  };

  getGroup = async () => {
    const {getSingleGroupById, auth, item, navigation} = this.props;
    const request = {
        id: item.id,
        token: auth.token
    }
    const req = await getSingleGroupById(request)
    if (req.errors){
        console.log(req.errors)
        alert('Cannot load group at this time, please try again later')
        return
    }

    navigation.navigate('GroupNavigator', {
        prevRoute: 'Home'
    })
    

  };

  render() {
    const {item, navigation, prevRoute, position} = this.props;
    const {theme} = this.state;
    const {
      groupname,
      display_name,
      shortDescription,
      icon,
      tags,
      location,
      id,
    } = item;

    let isNearby = false;
    let distance = 0;
    if (position && location) {
      const {latitude, longitude} = position.coords;
      const {lat, lng} = location;
      const userLatRadians = (latitude * Math.PI) / 180;
      const userLngRadians = (longitude * Math.PI) / 180;
      const groupLatRadians = (lat * Math.PI) / 180;
      const groupLngRadians = (lng * Math.PI) / 180;

      distance =
        3959 *
        Math.acos(
          Math.cos(userLatRadians) *
            Math.cos(groupLatRadians) *
            Math.cos(groupLngRadians - userLngRadians) +
            Math.sin(userLatRadians) * Math.sin(groupLatRadians),
        );

      if (distance <= 5) {
        isNearby = true;
      }
      distance = distance.toFixed(2);
    }

    return (
      <View style={[styles.container]}>
        <TouchableOpacity onPress={this.getGroup}>
          <View style={[theme.greyArea, theme.shadowColor, styles.card]}>
            <View style={styles.group}>
              <View style={styles.imgHolder}>
                <Image
                  style={styles.icon}
                  source={icon ? {uri: icon.uri} : singleDefaultIcon()}
                />
              </View>
              <View style={styles.groupInfo}>
                <View style={[{width: '100%'}]}>
                  <Text style={[theme.textColor, styles.displayName]}>
                    {display_name}
                  </Text>
                  <Text numberOfLines={2} style={[styles.groupname]}>
                    g@{groupname}
                  </Text>
                  <Text numberOfLines={3} style={styles.descriptionStyle}>
                    {shortDescription}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tagContainer}>
              {tags.length != 0 ? (
                <TagList groupTags={tags} isGroupCard={true} />
              ) : null}
            </View>

            <View style={styles.locationContainer}>
              {isNearby ? (
                <Text style={theme.textColor}>{distance} miles away</Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    maxWidth: width,
    padding: 10,
    paddingLeft: 5,
    minHeight: 130,
  },
  card: {
    borderRadius: 10,
    padding: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 0.5,
    elevation: 5,
  },
  descriptionStyle: {
    color: '#718093',
    textAlign: 'left',
    marginTop: 2,
  },
  imgHolder: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  groupInfo: {
    maxWidth: width - 125,
    height: '100%',
    padding: 5,
    paddingTop: 0,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupname: {
    color: 'grey',
    fontSize: 13,
  },
  group: {
    width: '100%',
    padding: 5,
    flexDirection: 'row',
  },
  tagContainer: {
    width: '100%',
    height: 25,
    flexDirection: 'row',
  },
  locationContainer: {
    width: '100%',
    height: 20,
  },
});

const mapStateToProps = state => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = dispatch => {
  return {
    getSingleGroupById: data => dispatch(getSingleGroupById(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RecommendedGroupCard);
