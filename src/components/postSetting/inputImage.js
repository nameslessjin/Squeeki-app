import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {PostImagePicker} from '../../utils/imagePicker';

export default class InputImage extends React.Component {
  render() {
    const {modifyInput, image, contentKeyboard} = this.props;
    const imageSelected = image != null

    return (
      <TouchableOpacity
        style={[
          styles.imageSelection,
          imageSelected ? {backgroundColor: 'white'} : {height: 100},
          (imageSelected && contentKeyboard) ? {maxHeight: 250} : null
        ]}
        onPress={() => PostImagePicker(modifyInput)}>
        {!imageSelected ? null : (
          <Image
            source={{uri: image.uri}}
            style={[
              styles.imageStyle,
              {aspectRatio:  image.height / image.width},
              (imageSelected && contentKeyboard) ? {maxHeight: 250} : null
            ]}
          />
        )}
        {!imageSelected ? <Text style={{color:'white'}}>Add Image</Text> : null}
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
