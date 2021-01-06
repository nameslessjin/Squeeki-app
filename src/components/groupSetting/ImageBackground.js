import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LeaveButton from './leaveButton';


export default class HeaderImageBackground extends React.Component {

  state = {
    icon_option: 'emoticon-cool-outline'
  }

  componentDidMount(){
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

  render() {
    const {
      initialize,
      auth,
      backgroundImg,
      icon,
      onLeave,
      auth_rank,
      onMediaPress
    } = this.props;

    const { icon_option } = this.state
    let iconImage = (
      <MaterialIcons
        style={{backgroundColor: 'white'}}
        name={icon_option}
        size={100}
      />
    );

    if (icon != null) {
      iconImage = (
        <Image
          source={{uri: icon.uri}}
          style={styles.imageStyle}
          resizeMode={'cover'}
        />
      );
    }

    let SetBackgroundImgText =
      'Group owners are really lazy. So there is no background. Press here to set background';

    if (initialize) {
      SetBackgroundImgText = 'Press here to set background';
    }

    let imageBackground = (
      <View style={[styles.backgroundImageStyle]}>
        <TouchableOpacity
          style={styles.backgroundImageContainerStyle}
          disabled={auth_rank > 1}
          onPress={() => onMediaPress('background')}
          // onPress={() => backgroundImagePicker(setImage)}
          
          >
          {backgroundImg != null ? (
            <Image
              source={{uri: backgroundImg.uri}}
              style={{width: '100%', height: '100%'}}
            />
          ) : (
            <Text style={styles.noBackgroundImageTextStyle}>
              {SetBackgroundImgText}
            </Text>
          )}
        </TouchableOpacity>

        <View style={[styles.profileImgStyle]}>
          <TouchableOpacity
            style={styles.imageStyle}
            disabled={auth_rank > 1}
            onPress={() => onMediaPress('profileImg')}
            // onPress={() => iconImagePicker(setImage)}
            
            >
            {iconImage}
          </TouchableOpacity>
          {!initialize ? <LeaveButton auth={auth} onPress={onLeave} /> : null}
        </View>
      </View>
    );

    return imageBackground;
  }
}

const styles = StyleSheet.create({
  noBackgroundImageStyle: {},
  backgroundImageStyle: {
    width: '100%',
    height: Platform.OS == 'android' ? 230 : 220,
  },
  backgroundImageContainerStyle: {
    height: 170,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'grey',
  },
  noBackgroundImageTextStyle: {
    padding: 10,
    textAlign: 'center',
  },
  profileImgStyle: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingLeft: 15,
    flexDirection: 'row',
    paddingBottom: 50,
  },
  imageStyle: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
  },
});
