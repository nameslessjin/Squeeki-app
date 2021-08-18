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
import {singleDefaultIcon} from '../../utils/defaultIcon';

export default class HeaderImageBackground extends React.Component {
  render() {
    const {
      initialize,
      auth,
      backgroundImg,
      icon,
      auth_rank,
      onMediaPress,
      required_rank,
    } = this.props;

    const iconImage = (
      <Image
        source={icon ? {uri: icon.uri} : singleDefaultIcon()}
        style={styles.imageStyle}
        resizeMode={'cover'}
      />
    );

    let SetBackgroundImgText =
      'Group owners are really lazy. So there is no background. Press here to set background';

    if (initialize) {
      SetBackgroundImgText = 'Press here to set background';
    }

    let imageBackground = (
      <View style={[styles.backgroundImageStyle]}>
        <TouchableOpacity
          style={styles.backgroundImageContainerStyle}
          disabled={auth_rank > required_rank}
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
            disabled={auth_rank > required_rank}
            onPress={() => onMediaPress('profileImg')}
            // onPress={() => iconImagePicker(setImage)}
          >
            {iconImage}
          </TouchableOpacity>
 
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
    borderColor: 'grey',
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
