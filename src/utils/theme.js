import {themeStyle} from '../assets/themes/systemTheme';

export const getTheme = theme => {
  let output = {
    backgroundColor: themeStyle.defaultBackgroundColor,
    textColor: themeStyle.defaultTextColor,
    greyArea: themeStyle.defaultGreyArea,
  };

  if (theme == 'default') {
    output = {
      backgroundColor: themeStyle.defaultBackgroundColor,
      textColor: themeStyle.defaultTextColor,
      greyArea: themeStyle.defaultGreyArea,
    };
  } else if (theme == 'darkMode') {
    output = {
      backgroundColor: themeStyle.darkModeBackgroundColor,
      textColor: themeStyle.darkModeTextColor,
      greyArea: themeStyle.darkModeGreyArea,
    };
  }

  return output;
};
