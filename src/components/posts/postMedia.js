import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ImageModal from 'react-native-image-modal';
import ParsedText from 'react-native-parsed-text';
import {
  onUrlPress,
  onLinkPhoneLongPress,
  renderText,
  onPhonePress,
  onEmailPress,
} from '../chat/render';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

const {width} = Dimensions.get('window');

export default class PostMedia extends React.Component {
  state = {
    height: 100,
    width: width,
    isShowMorePressed: false,
  };

  componentDidMount() {
    const {image} = this.props;
    if (image) {
      Image.getSize(image.uri, (w, h) => {
        this.setState({height: h, width: w});
      });
    }
  }

  onAtUserNGroupHightlightPress = content => {
    const {getGroup} = this.props;
    const components = content.substr(1, content.length - 2).split(':');

    const atText = components[0];
    const displayName = components[1];
    const id = components[2];

    // @username check
    if (atText[0] == '@') {
      // this.onPressAvatar({_id: id});
    } else if (atText[0] == 'g' && atText[1] == '@') {
      // g@groupname check
      getGroup(id);
    }
  };

  onPress = type => {
    const {prevRoute, navigation, postId} = this.props;
    if (type == 'showMore') {
      // if user is in the home page then redirect to comment page else show all the content
      if (prevRoute == 'Home') {
        navigation.navigate('Comment', {
          postId: postId,
        });
      } else {
        this.setState(prevState => ({
          isShowMorePressed: !prevState.isShowMorePressed,
        }));
      }
    }
  };

  render() {
    const {
      image,
      content,
      _actionSheetRef,
      theme,
      priority,
      prevRoute,
    } = this.props;

    const {isShowMorePressed} = this.state;
    const isMediaLong = content.length > 255 || this.state.height > 300;

    return (
      <View style={styles.contentStyle}>
        <ParsedText
          style={[
            styles.textStyle,
            {color: priority > 0 ? 'black' : theme.textColor.color},
          ]}
          parse={[
            {
              type: 'url',
              style: {color: '#1e90ff'},
              onPress: onUrlPress,
              onLongPress: url =>
                onLinkPhoneLongPress({type: 'url', content: url}),
            },
            {
              type: 'phone',
              style: {color: '#1e90ff'},
              onPress: phone => onPhonePress({phone, ..._actionSheetRef}),
              onLongPress: phone =>
                onLinkPhoneLongPress({type: 'phone', content: phone}),
            },
            {
              type: 'email',
              style: {color: '#1e90ff'},
              onPress: onEmailPress,
              onLongPress: email =>
                onLinkPhoneLongPress({type: 'email', content: email}),
            },
            {
              pattern: /\[(@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
              style: {color: '#1e90ff'},
              renderText: renderText,
              onPress: m => this.onAtUserNGroupHightlightPress(m),
            },
            {
              pattern: /\[(g@[a-zA-Z0-9_]{4,29}[a-zA-Z0-9]{1}):(.{1,50}):([a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})\]/g,
              style: {color: '#1e90ff', fontWeight: '500'},
              renderText: renderText,
              onPress: m => this.onAtUserNGroupHightlightPress(m),
            },
          ]}
          childrenProps={{allowFontScaling: false}}>
          {isShowMorePressed
            ? content
            : `${content.substr(0, 255)}${content.length > 255 ? '...' : ''}`}
        </ParsedText>
        {image != null ? (
          <View style={styles.imageView}>
            <ImageModal
              resizeMode="cover"
              style={[
                styles.imageStyle,
                // {aspectRatio: this.state.width / this.state.height},
                {
                  height:
                    this.state.height <= 300
                      ? this.state.height
                      : isShowMorePressed
                      ? this.state.height
                      : 300,
                },
              ]}
              source={{uri: image.uri}}
              modalImageResizeMode={'contain'}
            />
          </View>
        ) : null}
        {isMediaLong && !isShowMorePressed ? (
          <View style={styles.moreContent}>
            <TouchableOpacity onPress={() => this.onPress('showMore')}>
              <Text style={theme.titleColor}>
                {isShowMorePressed ? 'Hide Content' : 'Show More'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    maxHeight: 1100,
    width: '100%',
    justifyContent: 'center',
    // backgroundColor: 'orange'
  },
  imageView: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    maxHeight: 600,
  },
  textStyle: {
    padding: 7,
    marginBottom: 10,
    maxHeight: 380,
    lineHeight: 15,
  },
  imageStyle: {
    height: 300,
    width: width,
    maxHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreContent: {
    height: 25,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
