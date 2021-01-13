export const getGroupNominationsFunc = async data => {
  const {
    token,
    getGroupNominations,
    navigation,
    userLogout,
    groupId,
  } = data;
  const input = {
    groupId: groupId,
    token: token,
  };
  const nominations = await getGroupNominations(input);
  if (nominations.errors) {
    alert(nominations.errors[0].message);
    if (nominations.errors[0].message == 'Not Authenticated') {
      userLogout();
      navigation.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      });
    }

    return;
  }
};

export const GroupNominationResultsFormatting = data => {
  const {nominationResults, new_nomination_result} = data;

  let new_oldResultList = [...nominationResults.oldResultList];

  // get the last item in the old list and the first item in the new list
  const last_item_oldResultList_time_from_nominationResults =
    nominationResults.oldResultList[nominationResults.oldResultList.length - 1];
  const first_item_oldResultList_time_from_new_nomination_result =
    new_nomination_result.oldResultList[
      new_nomination_result.oldResultList.length - 1
    ];

  // if the last item from old list and the first item from the new list have the same time.  Focus on combing those items first
  if (
    last_item_oldResultList_time_from_nominationResults.time ==
    first_item_oldResultList_time_from_new_nomination_result.time
  ) {
    // check if the last item from last_item_oldResultList_time_from_nominationResults has the same nomination name as
    // the first item from first_item_oldResultList_time_from_new_nomination_result.  if so combine them
    const last_item_from_previous_last_item_list =
      last_item_oldResultList_time_from_nominationResults.list[
        last_item_oldResultList_time_from_nominationResults.list.length - 1
      ];
    const first_item_from_previous_first_item_list =
      first_item_oldResultList_time_from_new_nomination_result.list[
        first_item_oldResultList_time_from_new_nomination_result.list.length - 1
      ];

    // if it has the same name then combine then under the same nomination name
    let new_list_under_time_level = [];
    if (
      last_item_from_previous_last_item_list.nomination_name ==
      first_item_from_previous_first_item_list.nomination_name
    ) {
      const new_list_under_nomination_level = [
        ...last_item_from_previous_last_item_list.list,
      ].concat(first_item_from_previous_first_item_list.list);
      const new_last_item_oldResultList_nomination_from_nominationResults = {
        ...last_item_from_previous_last_item_list,
        list: new_list_under_nomination_level,
      };

      let new_last_item_oldResultList_time_from_nominationResults_list = [
        ...last_item_oldResultList_time_from_nominationResults.list,
      ];
      new_last_item_oldResultList_time_from_nominationResults_list.pop();
      new_last_item_oldResultList_time_from_nominationResults_list.push(
        new_last_item_oldResultList_nomination_from_nominationResults,
      );

      // remove the first item in the newly retrieved list
      const first_item_oldResultList_time_from_new_nomination_result_removed = first_item_oldResultList_time_from_new_nomination_result.list.filter(
        (v, i) => i != 0,
      );
      new_list_under_time_level = [
        ...new_last_item_oldResultList_time_from_nominationResults_list,
      ].concat(
        first_item_oldResultList_time_from_new_nomination_result_removed,
      );
    } else {
      // comebine based on time
      new_list_under_time_level = [
        ...last_item_oldResultList_time_from_nominationResults.list,
      ].concat(first_item_oldResultList_time_from_new_nomination_result.list);
    }
    // done with overlapped time
    const new_last_item_oldResultList_time_from_nominationResults = {
      ...last_item_oldResultList_time_from_nominationResults,
      list: new_list_under_time_level,
    };
    new_oldResultList.pop();
    new_oldResultList.push(
      new_last_item_oldResultList_time_from_nominationResults,
    );

    // remove the first time item in the newly retrieved list
    const new_nomination_result_modified = new_nomination_result.oldResultList.filter(
      (v, i) => i != 0,
    );
    if (new_nomination_result_modified.length != 0) {
      new_oldResultList = new_oldResultList.concat(
        new_nomination_result_modified,
      );
    }
  } else {
    // if time is not overlapped
    new_oldResultList = new_oldResultList.concat(
      new_nomination_result.oldResultList,
    );
  }

  const new_nominationResults = {
    count: new_nomination_result.count,
    oldResultList: new_oldResultList,
  };

  return new_nominationResults
};
