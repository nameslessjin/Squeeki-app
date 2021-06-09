import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import ImageModal from 'react-native-image-modal';

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
    const {image, content} = this.props;

    return (
      // <TouchableWithoutFeedback>
      <View style={styles.contentStyle}>
        <Text style={styles.textStyle}>{content}</Text>
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
      // </TouchableWithoutFeedback>
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
    maxHeight: 150,
  },
  imageStyle: {
    width: '100%',
    maxHeight: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
