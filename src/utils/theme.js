import {themeStyle} from '../assets/themes/systemTheme';

export const getTheme = theme => {
  let output = {
    backgroundColor: themeStyle.defaultBackgroundColor,
    textColor: themeStyle.defaultTextColor,
    greyArea: themeStyle.defaultGreyArea,
    drawerTextColor: themeStyle.defaultDrawerTextColor,
    shadowColor: themeStyle.defaultShadowColor,
    borderColor: themeStyle.defaultBorderColor,
    underLineColor: themeStyle.defaultUnderLineColor,
    titleColor: themeStyle.defaultTitleColor,
    iconColor: themeStyle.defaultIconColor,
    secondaryTextColor: themeStyle.defaultSecondaryTextColor,
    secondaryIconColor: themeStyle.defaultSecondaryIconColor,
  };

  if (theme == 'default') {
    output = {
      backgroundColor: themeStyle.defaultBackgroundColor,
      textColor: themeStyle.defaultTextColor,
      greyArea: themeStyle.defaultGreyArea,
      drawerTextColor: themeStyle.defaultDrawerTextColor,
      shadowColor: themeStyle.defaultShadowColor,
      borderColor: themeStyle.defaultBorderColor,
      underLineColor: themeStyle.defaultUnderLineColor,
      titleColor: themeStyle.defaultTitleColor,
      iconColor: themeStyle.defaultIconColor,
      secondaryTextColor: themeStyle.defaultSecondaryTextColor,
      secondaryIconColor: themeStyle.defaultSecondaryIconColor,
    };
  } else if (theme == 'darkMode') {
    output = {
      backgroundColor: themeStyle.darkModeBackgroundColor,
      textColor: themeStyle.darkModeTextColor,
      greyArea: themeStyle.darkModeGreyArea,
      drawerTextColor: themeStyle.darkModeDrawerTextColor,
      shadowColor: themeStyle.darkModeShadowColor,
      borderColor: themeStyle.darkModeBorderColor,
      underLineColor: themeStyle.darkModeUnderLineColor,
      titleColor: themeStyle.darkModeTitleColor,
      iconColor: themeStyle.darkModeIconColor,
      secondaryTextColor: themeStyle.darkModeSecondaryTextColor,
      secondaryIconColor: themeStyle.darkModeSecondaryIconColor,
    };
  }

  return output;
};
