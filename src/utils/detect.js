export const detectFile = text => {
  let t = text;
  t = t.split('/');
  if (t[0] == 'file:' && t[1].length == 0 && t[2].length == 0) {
    let file = t[t.length - 1];
    file = file.split('.');
    const type = file[file.length - 1];
    if (type == 'jpg' || type == 'png') {
      return {is_image: true, imageType: type};
    }
  }

  return {is_image: false};
};

export const detectAtPeopleNGroup = prop => {
  const {prevText, currentText} = prop;
  const prevTextArray = prevText.split(' ');
  const currentTextArray = currentText.split(' ');

  // find the term and index that is current midifying
  let currentModifyingTermIndex = currentTextArray.length - 1;
  let currentModifyingTerm = currentTextArray[currentModifyingTermIndex];
  let isNewEmptySpaceAfterExistingTag = false;
  let set = false;
  let searchTerm = '';
  let searchIndex = -1;

  currentTextArray.forEach((c, i) => {
    if (c != prevTextArray[i] && !set) {
      currentModifyingTermIndex = i;
      currentModifyingTerm = c;
      set = true;
    }
  });

  // if @ is used to get user/group
  if (currentModifyingTerm.search('@') != -1) {
    // if @user
    if (currentModifyingTerm[0] == '@') {
      // this is used to check putting an empty space between @ and username, ex. from '@username' to '@ username'
      if (
        currentModifyingTerm.length == 1 &&
        currentTextArray.length > prevTextArray.length
      ) {
        const prevChar = prevTextArray[currentModifyingTermIndex];
        if (
          prevChar[0] == '@' &&
          prevChar.substr(1, prevChar.length) ==
            currentTextArray[currentModifyingTermIndex + 1]
        ) {
          isNewEmptySpaceAfterExistingTag = true;
        }
      }
      if (!isNewEmptySpaceAfterExistingTag) {
        searchTerm = currentModifyingTerm;
        searchIndex = currentModifyingTermIndex;
      }
    }

    // if g@groupname
    if (currentModifyingTerm[0] == 'g' && currentModifyingTerm[1] == '@') {
      // this is used to check putting an empty space between g@ and groupname, ex. from 'g@groupname' to 'g@ groupname'
      if (
        currentModifyingTerm.length == 2 &&
        currentTextArray.length > prevTextArray.length
      ) {
        const prevChar = prevTextArray[currentModifyingTermIndex];
        if (
          prevChar[0] == 'g' &&
          prevChar[1] == '@' &&
          prevChar.substr(2, prevChar.length) ==
            currentTextArray[currentModifyingTermIndex + 1]
        ) {
          isNewEmptySpaceAfterExistingTag = true;
        }
      }
      if (!isNewEmptySpaceAfterExistingTag) {
        searchTerm = currentModifyingTerm;
        searchIndex = currentModifyingTermIndex;
      }
    }
  }

  return {
    searchTerm,
    searchIndex,
  };
};

export const detectAtUserNGroupInCurrentText = text => {
  const textArray = text.split(' ');
  const atUser = textArray
    .filter(item => item[0] == '@' && item.length >= 5)
    .map(u => u.substr(1, u.length));
  const atGroup = textArray
    .filter(item => item[0] == 'g' && item[1] == '@' && item.length >= 6)
    .map(g => g.substr(2, g.length));

  return {atUser, atGroup};
};
