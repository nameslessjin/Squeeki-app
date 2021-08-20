import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GroupButton from './groupButton';
import {singleDefaultIcon} from '../../utils/defaultIcon';

export default class HeaderImageBackground extends React.Component {
  state = {
    setBackgroundImgText:
      'Group owners are really lazy. So there is no background. Press here to set background',
    background_text_sequence: 0,
  };

  onTextBackgroundPress = () => {
    const {background_text_sequence} = this.state;
    if (background_text_sequence == 0) {
      this.setState({
        setBackgroundImgText:
          "You don' really think it is going to work right?",
        background_text_sequence: 1,
      });
    } else if (background_text_sequence == 1) {
      this.setState({
        setBackgroundImgText: 'I name thou DumDum',
        background_text_sequence: 2,
      });
    } else if (background_text_sequence == 2) {
      this.setState({
        setBackgroundImgText: 'Seriously, stop pressing on the background',
        background_text_sequence: 3,
      });
    } else if (background_text_sequence == 3) {
      this.setState({
        setBackgroundImgText: 'Stop it, it is itchy',
        background_text_sequence: 4,
      });
    } else if (background_text_sequence == 4) {
      this.setState({
        setBackgroundImgText: 'Eat this!',
        background_text_sequence: 5,
      });
    }
  };

  render() {
    const {
      icon,
      backgroundImg,
      auth,
      groupMethod,
      loading,
      onNotificationPress,
      onAddPost,
      visibility,
      join_requested,
      rank_setting,
      theme
    } = this.props;

    const {background_text_sequence} = this.state;

    const iconImage =
      background_text_sequence == 5 ? (
        <TouchableWithoutFeedback onPress={this.onTextBackgroundPress}>
          <MaterialIcons
            style={theme.backgroundColor}
            name={'emoticon-poop'}
            size={100}
          />
        </TouchableWithoutFeedback>
      ) : (
        <Image
          source={icon ? {uri: icon.uri} : singleDefaultIcon()}
          style={styles.imageStyle}
          resizeMode={'cover'}
        />
      );

    let {setBackgroundImgText} = this.state;

    let imageBackground = (
      <View style={[styles.backgroundImageStyle, theme.backgroundColor]}>
        <TouchableWithoutFeedback
          onPress={backgroundImg == null ? this.onTextBackgroundPress : null}>
          <View style={[styles.backgroundImageContainerStyle, theme.backgroundColor]}>
            {backgroundImg != null ? (
              <Image
                source={{uri: backgroundImg.uri}}
                style={{width: '100%', height: '100%'}}
              />
            ) : (
              <Text style={[styles.noBackgroundImageTextStyle, theme.textColor]}>
                {setBackgroundImgText}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={[styles.profileImgStyle]}>
          <View style={styles.imageStyle}>{iconImage}</View>
          {loading ? (
            <ActivityIndicator animating={loading} color={'grey'} />
          ) : (
            <GroupButton
              auth={auth}
              method={groupMethod}
              onNotificationPress={onNotificationPress}
              onAddPost={onAddPost}
              join_requested={join_requested}
              rank_setting={rank_setting}
              theme={theme}
            />
          )}
        </View>
      </View>
    );
    return imageBackground;
  }
}

const styles = StyleSheet.create({
  backgroundImageStyle: {
    width: '100%',
    height: Platform.OS == 'android' ? 230 : 200,
  },
  backgroundImageContainerStyle: {
    height: 170,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
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
  noBackgroundImageStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
  },
  noBackgroundImageTextStyle: {
    padding: 10,
    textAlign: 'center',
  },
  modal: {
    flex: 1,
    width: 200,
    height: 400,
  },
});
