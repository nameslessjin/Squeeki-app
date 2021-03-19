import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import PhotoEditor from 'react-native-photo-editor';
import RNFS from 'react-native-fs';

export const backgroundImagePicker = (setImage, from, cancel) => {
  const options = {
    quality: 1.0,
    maxWidth: 900,
    maxHeight: 900,
    includeBase64: true,
  };

  if (from == 'library') {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let name = response.uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
        };

        setImage(source, 'background');
      }
    });
  } else {
    launchCamera(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let name = response.uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
        };

        setImage(source, 'background');
      }
    });
  }
};

export const iconImagePicker = (setImage, from, cancel) => {
  const options = {
    quality: 1.0,
    maxWidth: 900,
    maxHeight: 900,
    includeBase64: true,
  };

  if (from == 'library') {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let name = response.uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
        };

        setImage(source, 'icon');
      }
    });
  } else {
    launchCamera(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let name = response.uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
        };

        setImage(source, 'icon');
      }
    });
  }
};

export const PostImagePicker = (setImage, from, cancel) => {
  const options = {
    mediaType: 'photo',
    quality: 1.0,
    maxWidth: 900,
    maxHeight: 900,
    includeBase64: true,
  };

  if (from == 'library') {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let name = response.uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
          mediaType: 'photo',
        };

        setImage(source, 'image');
      }
    });
  } else {
    launchCamera(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let name = response.uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
          mediaType: 'photo',
        };
        setImage(source, 'image');
      }
    });
  }
};

export const PostVideoPicker = (setImage, from, cancel) => {
  const options = {
    mediaType: 'video',
    videoQuality: 'low',
    maxWidth: 900,
    maxHeight: 900,
    durationLimit: 30,
  };

  if (from == 'library') {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Video Picker Error: ', response.error);
      } else {
        const uri = response.uri;
        let name = uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
          mediaType: 'photo',
        };

        // setImage(source, 'image')
      }
    });
  } else {
    launchCamera(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Video Picker Error: ', response.error);
      } else {
        let name = response.uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
          mediaType: 'photo',
        };
        setImage(source, 'image');
      }
    });
  }
};

export const MessageImagePicker = (onMediaUpload, from, cancel) => {
  const options = {
    mediaType: 'photo',
    quality: 1.0,
    maxWidth: 900,
    maxHeight: 900,
    includeBase64: true,
  };

  if (from == 'library') {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        const uri = response.uri;
        let name = uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
          mediaType: 'photo',
        };

        const path = RNFS.DocumentDirectoryPath + `/${response.filename}`;
        const picked = {
          path: path,
          type: response.type,
        };

        RNFS.exists(path)
          .then(res => {
            if (res) {
              RNFS.unlink(path);
            }
          })
          .then(() => {
            RNFS.moveFile(uri, path)
              .then(() => {
                editPhoto(picked, onMediaUpload);
              })
              .catch(err => {
                console.log(err);
              });
          });
      }
    });
  } else {
    launchCamera(options, response => {
      if (response.didCancel) {
        cancel();
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        const uri = response.uri;
        let name = uri.split('/');
        name = name[name.length - 1];
        let source = {
          uri: response.uri,
          width: response.height,
          height: response.width,
          type: response.type,
          filename: name,
          data: response.base64,
          mediaType: 'photo',
        };

        const path = RNFS.DocumentDirectoryPath + `/${response.fileName}`;
        const picked = {
          path: path,
          type: response.type,
        };

        RNFS.exists(path)
          .then(res => {
            if (res) {
              RNFS.unlink(path);
            }
          })
          .then(() => {
            RNFS.moveFile(uri, path)
              .then(() => {
                editPhoto(picked, onMediaUpload);
              })
              .catch(err => {
                console.log(err);
              });
          });
      }
    });
  }
};

const editPhoto = (image, onMediaUpload) => {
  const {path, type} = image;

  PhotoEditor.Edit({
    path: path,
    hiddenControls: ['share', 'sticker'],
    onDone: imagePath => {
      RNFS.readFile(imagePath, 'base64')
        .then(res => {
          const upload = {
            data: res,
            type: type,
          };
          onMediaUpload(upload);
        })
        .catch(err => console.log(err));
    },
    onCancel: () => {},
  });
};
