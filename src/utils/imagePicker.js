import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import PhotoEditor from 'react-native-photo-editor';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';
import {PermissionsAndroid, Platform} from 'react-native';
import {FileSystem} from 'react-native-unimodules';
import Clipboard from '@react-native-clipboard/clipboard';

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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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
                editPhoto(picked, setImage, 'background');
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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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
                editPhoto(picked, setImage, 'background');
              })
              .catch(err => {
                console.log(err);
              });
          });
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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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
                editPhoto(picked, setImage, 'icon');
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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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
                editPhoto(picked, setImage, 'icon');
              })
              .catch(err => {
                console.log(err);
              });
          });
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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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
                editPhoto(picked, setImage, 'image');
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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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
                editPhoto(picked, setImage, 'image');
              })
              .catch(err => {
                console.log(err);
              });
          });
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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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
        const resp = response.assets[0];
        const uri = resp.uri;
        let name = uri.split('/');
        name = name[name.length - 1];

        const path = RNFS.DocumentDirectoryPath + `/${resp.fileName}`;
        const picked = {
          path: path,
          type: resp.type,
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

export const editPhoto = (image, func, input_type) => {
  let {path, type} = image;

  if (Platform.OS == 'android'){
    if (path.search('file://') == 0){
      path = path.split('file://')[1]
    }
  }

  PhotoEditor.Edit({
    path: path,
    hiddenControls: ['save', 'share'],
    onDone: imagePath => {
      RNFS.readFile(imagePath, 'base64')
        .then(res => {
          const upload = {
            data: res,
            type: type,
            uri: imagePath,
          };
          func(upload, input_type);
          RNFS.unlink(path)
        })
        .catch(err => console.log(err));
    },
    onCancel: () => {},
  });
};

export const handleDownload = async props => {
  const {url, is_download} = props;
  let name = url.split('/');
  name = name[name.length - 1] + '.jpg';
  const dowloadResumable = FileSystem.createDownloadResumable(
    url,
    FileSystem.documentDirectory + name,
    {},
  );
  let path = '';
  try {
    const {uri} = await dowloadResumable.downloadAsync();
    path = uri;
  } catch (e) {
    console.error(e);
    return;
  }

  if (is_download) {
    CameraRoll.save(path, 'photo')
      .then(res => console.log(res))
      .catch(err => console.log(err));
  } else {

    Clipboard.setString(path);
  }

  // file:///Users/jinsenwu/Library/Developer/CoreSimulator/Devices/
  // 37CCDE62-1A85-4551-BE36-F8D2F0A19F67/data/Containers/Data/Application/739EC634-D683-4085-8DD8-9272B862D5ED/
  // Documents/a12265e5-f1f3-485b-869f-5b33b2ddbdab.jpg

  return path;
  // RNFetchBlob.config({
  //   fileCache: true,
  //   appendExt: 'png'
  // })
  // .fetch('GET', url)
  // .then(res => {
  //   CameraRoll.saveToCameraRoll(res.data, 'photo')
  //   .then(res => console.log(res))
  //   .catch(err => console.log(err))
  // })
  // .catch(err => console.log(err))
};
