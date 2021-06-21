import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
  Dimensions,
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
  };

  componentDidMount() {
    const {image} = this.props;
    if (image) {
      Image.getSize(image.uri, (w, h) => {
        this.setState({height: h, width: w});
      });
    }
  }

  render() {
    const {image, content, _actionSheetRef} = this.props;

    return (
      <View style={styles.contentStyle}>
        <ParsedText
          style={styles.textStyle}
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
            },
          ]}
          childrenProps={{allowFontScaling: false}}>
          {content}
        </ParsedText>
        {image != null ? (
          <View style={styles.imageView}>
            <ImageModal
              resizeMode="cover"
              style={[
                styles.imageStyle,
                {aspectRatio: this.state.width / this.state.height},
              ]}
              source={{uri: image.uri}}
              modalImageResizeMode={'contain'}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    maxHeight: 800,
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
    maxHeight: 180,
    lineHeight: 15,
  },
  imageStyle: {
    width: '100%',
    maxHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
