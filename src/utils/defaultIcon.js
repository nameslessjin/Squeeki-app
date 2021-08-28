import {Platform} from 'react-native';

const uri = [
  require('../assets/defaultIcons/b1_l.png'),
  require('../assets/defaultIcons/b2_g.png'),
  require('../assets/defaultIcons/b3_l.png'),
  require('../assets/defaultIcons/b4_g.png'),
  require('../assets/defaultIcons/e1.png'),
  require('../assets/defaultIcons/e2.png'),
  require('../assets/defaultIcons/e3.png'),
  require('../assets/defaultIcons/e4.png'),
  require('../assets/defaultIcons/f1_g.png'),
  require('../assets/defaultIcons/f2_l.png'),
  require('../assets/defaultIcons/f3_g.png'),
  require('../assets/defaultIcons/f4_l.png'),
  require('../assets/defaultIcons/p1.png'),
  require('../assets/defaultIcons/p2.png'),
  require('../assets/defaultIcons/p3.png'),
  require('../assets/defaultIcons/p4.png'),
  require('../assets/defaultIcons/w1_g.png'),
  require('../assets/defaultIcons/w2_l.png'),
  require('../assets/defaultIcons/w3_g.png'),
  require('../assets/defaultIcons/w4_l.png'),
];

const powerByGoogle = {
  ios: {
    noWhite: require('../assets/powerByGoogle/ios/powered_by_google_on_non_white.png'),
    white: require('../assets/powerByGoogle/ios/powered_by_google_on_white.png'),
  },
  android: {
    noWhite: require('../assets/powerByGoogle/android/powered_by_google_on_non_white.png'),
    white: require('../assets/powerByGoogle/android/powered_by_google_on_white.png'),
  },
};

export const randomDefaultIcon = () => {
  const random = Math.floor(Math.random() * 20);
  const icon = uri[random];

  return icon;
};

export const singleDefaultIcon = () => require('../assets/defaultIcons/p1.png');

export const powerByGoogleIconPick = isWhite => {
  let googleIcon = powerByGoogle.ios.white;

  if (Platform.OS == 'ios') {
    if (isWhite) {
      googleIcon = powerByGoogle.ios.white;
    } else {
      googleIcon = powerByGoogle.ios.noWhite;
    }
  } else {
    if (isWhite) {
      googleIcon = powerByGoogle.android.white;
    } else {
      googleIcon = powerByGoogle.android.noWhite;
    }
  }

  return googleIcon;
};
