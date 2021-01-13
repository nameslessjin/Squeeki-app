import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('screen');

export default class PostMedia extends React.Component {
  render() {
    const {image, content} = this.props;
    return (
      // <TouchableWithoutFeedback>
        <View style={styles.contentStyle}>
          <Text style={styles.textStyle}>{content}</Text>
          {image != null ? (
            <View style={styles.imageView}>
              <Image
                source={{uri: image.uri}}
                style={[
                  styles.imageStyle,
                  {aspectRatio: image.height / image.width, width: width},
                ]}
                resizeMode={'cover'}
              />
            </View>
          ) : null}
        </View>
      // </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  contentStyle: {
    maxHeight: 950,
    width: '100%',
    justifyContent: 'center',
    // backgroundColor: 'orange'
  },
  imageView: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    padding: 7,
    marginBottom: 10,
    maxHeight: 150,
  },
  imageStyle: {
    width: '100%',
    maxHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
