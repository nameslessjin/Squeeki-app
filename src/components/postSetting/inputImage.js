import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

export default class InputImage extends React.Component {
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.image !== this.props.image) {
      const {image} = this.props;
      if (image) {
        Image.getSize(image.uri, (w, h) => {
          this.setState({height: h, width: w});
        });
      }
    }
  }

  render() {
    const {image, contentKeyboard, onPress, disabled} = this.props;
    const imageSelected = image != null;

    return (
      <TouchableOpacity
        style={[
          styles.imageSelection,
          imageSelected ? {backgroundColor: 'white'} : {height: 100},
          imageSelected && contentKeyboard ? {maxHeight: 250} : null,
        ]}
        disabled={disabled}
        onPress={() => onPress()}>
        {!imageSelected ? null : (
          <Image
            source={{uri: image.uri}}
            style={[
              styles.imageStyle,
              {aspectRatio: this.state.width / this.state.height},
              imageSelected && contentKeyboard ? {maxHeight: 250} : null,
            ]}
          />
        )}
        {!imageSelected ? (
          <Text style={{color: 'white'}}>{!disabled ? 'Add Image' : 'No Image'}</Text>
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  imageSelection: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#273c75',
    width: '100%',
    maxHeight: 400,
  },
  imageStyle: {
    width: '100%',
    maxHeight: 400,
  },
});
