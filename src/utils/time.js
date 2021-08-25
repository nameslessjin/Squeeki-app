export const dateConversion = (time, type) => {
  let date = new Date();
  if (time) {
    date = new Date(parseInt(time));
  }

  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let outputTime = '';

  if (
    type == 'post' ||
    type == 'member' ||
    type == 'comment' ||
    type == 'chat' ||
    type == 'group' ||
    type == 'timeDisplay' ||
    type == 'reward'
  ) {
    outputTime = months[month] + ' ' + day + ' ' + (year - 2000);

    if (type == 'timeDisplay') {
      const check = withInAWeekCheck(date, 'up');
      outputTime = check ? check : outputTime;
    }

    return outputTime;
  } else if (
    type == 'priority' ||
    type == 'task' ||
    type == 'event' ||
    type == 'expiration' ||
    type == 'expirationDisplay'
  ) {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const am = hour < 12 ? 'am' : 'pm';
    outputTime = `${month + 1}/${day}/${year - 2000} ${
      hour <= 12 ? hour : hour - 12
    }:${minutes < 10 ? '0' : ''}${minutes} ${am}`;

    if (type == 'expirationDisplay') {
      const check = withInAWeekCheck(date, 'down');
      outputTime = check ? check : `End At: ${outputTime}`;
    }

    return outputTime;
  }
};

const withInAWeekCheck = (date, type) => {
  const today = new Date();
  let outputTime = null;

  const timeDifference =
    type == 'down'
      ? Math.floor((date.getTime() - today.getTime()) / 1000)
      : Math.floor((today.getTime() - date.getTime()) / 1000);

  // less than 1 min left
  if (0 <= timeDifference && timeDifference < 60) {
    outputTime =
      timeDifference.toString() + (type == 'down' ? 's left' : 's ago');
  }
  // less than 1 hour lef
  if (60 <= timeDifference && timeDifference < 60 * 60) {
    outputTime =
      Math.floor(timeDifference / 60).toString() +
      (type == 'down' ? 'm left' : 'm ago');
  }
  // less than 1 day left
  if (60 * 60 <= timeDifference && timeDifference < 60 * 60 * 24) {
    outputTime =
      Math.floor(timeDifference / (60 * 60)).toString() +
      (type == 'down' ? 'hr left' : 'hr ago');
  }
  // less than 1 week left
  if (60 * 60 * 24 <= timeDifference && timeDifference < 60 * 60 * 24 * 7) {
    outputTime =
      Math.floor(timeDifference / (60 * 60 * 24)).toString() +
      (type == 'down' ? 'd left' : 'd ago');
  }

  if (timeDifference <= 0){
    outputTime = 'Expired'
  }

  return outputTime;
};

export const getSundays = time => {
  const input = time || Date.now();
  const today = new Date(input);
  const day = today.getUTCDay();
  const hour = today.getUTCHours();
  const minute = today.getUTCMinutes();
  const seconds = today.getUTCSeconds();

  // UTC 1 am (ETS 8 pm PTS 5 pm)
  const offset = 1 * 60 * 60;
  const diff_to_begin = (((day - 1) * 24 + hour) * 60 + minute) * 60 + seconds;
  let begin = null;
  let end = null;
  if (diff_to_begin < offset) {
    begin = new Date(
      (Math.floor(input / 1000) - diff_to_begin + offset - 7 * 24 * 60 * 60) *
        1000,
    );
    end = new Date((Math.floor(input / 1000) - diff_to_begin + offset) * 1000);
  } else {
    begin = new Date(
      (Math.floor(input / 1000) - diff_to_begin + offset) * 1000,
    );
    end = new Date(
      (Math.floor(input / 1000) - diff_to_begin + offset + 7 * 24 * 60 * 60) *
        1000,
    );
  }

  return {last_sunday: begin, next_sunday: end};
};

export const getFormalTime = time => {
  const formalTime = new Date(time);
  const year = formalTime.getFullYear();
  const month = formalTime.getMonth();
  const date = formalTime.getDate();

  return {year: year, month: month, date: date};
};

export const calculateTimeAddition = time => {
  return new Date(Date.now() + time * 60 * 1000);
};

export const timeDifferentInMandS = time => {
  const current = Date.now();
  let diff = time - current;

  if (diff <= 0) {
    return false;
  }

  diff = diff / 1000;

  const day = Math.floor(diff / (60 * 60 * 24));
  const hour = Math.floor((diff - day * (60 * 60 * 24)) / (60 * 60));
  const minute = Math.floor(
    (diff - day * (60 * 60 * 24) - hour * (60 * 60)) / 60,
  );
  const second = Math.floor(
    diff - day * (60 * 60 * 24) - hour * (60 * 60) - minute * 60,
  );

  return {day: day, hour: hour, minute: minute, second: second};
};

export const getSemester = time => {
  let input = time || Date.now();
  const today = new Date(input);
  const year = today.getUTCFullYear();
  const prev_year = year - 1;

  let period = new Date();
  period.setUTCFullYear(year);
  period.setUTCMonth(0);
  period.setUTCDate(0);
  period.setUTCHours(0);
  period.setUTCMinutes(0);
  period.setUTCSeconds(0);
  period.setUTCMilliseconds(0);
  input = new Date(input);
  input.setUTCHours(1);
  input.setUTCMinutes(0);
  input.setUTCSeconds(0);
  input.setUTCMilliseconds(0);
  input = input.getTime();

  // 1-15 to 8-15 then 8-15 to 1-15
  let begin = null;
  let end = null;

  // 1-15
  let offset = 16 * 24 * 60 * 60;
  const prev_year_time = (prev_year % 4 == 0 ? 366 : 365) * 24 * 60 * 60;
  const current_year_time = (year % 4 == 0 ? 366 : 365) * 24 * 60 * 60;
  const diff_to_begin = Math.floor((today - period) / 1000);

  // 8-15
  const begin_offset =
    ((prev_year % 4 == 0 ? 366 : 365) - 15 - 30 - 31 - 30 - 31) * 24 * 60 * 60;

  if (diff_to_begin < offset) {
    begin = new Date(
      (Math.floor(input / 1000) -
        diff_to_begin -
        prev_year_time +
        begin_offset) *
        1000,
    );
    end = new Date((Math.floor(input / 1000) - diff_to_begin + offset) * 1000);
  } else if (diff_to_begin >= offset && diff_to_begin < begin_offset) {
    begin = new Date(
      (Math.floor(input / 1000) - diff_to_begin + offset) * 1000,
    );
    end = new Date(
      (Math.floor(input / 1000) - diff_to_begin + begin_offset) * 1000,
    );
  } else if (diff_to_begin >= begin_offset) {
    begin = new Date(
      (Math.floor(input / 1000) - diff_to_begin + begin_offset) * 1000,
    );
    end = new Date(
      (Math.floor(input / 1000) - diff_to_begin + current_year_time + offset) *
        1000,
    );
  }

  begin.setUTCHours(1);
  begin.setUTCMinutes(0);
  begin.setUTCSeconds(0);
  begin.setUTCMilliseconds(0);
  end.setUTCHours(1);
  end.setUTCMinutes(0);
  end.setUTCSeconds(0);
  end.setUTCMilliseconds(0);

  return {semester_begin: begin, semester_end: end};
};

export const chatTimeFormat = input => {
  const time = new Date(parseInt(input));
  const year = time.getFullYear();
  const date = time.getDate();
  const month = time.getMonth();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const hour = time.getHours();
  const minute = time.getMinutes();

  const today = new Date();
  const today_date = today.getDate();
  const today_year = today.getFullYear();
  const today_month = today.getMonth();

  //check if it is today
  if (today_date == date && today_month == month && today_year == year) {
    const format_hour = hour <= 12 ? hour : hour - 12;
    const format_minute = minute > 10 ? minute : `0${minute}`;
    const am = hour < 12 ? 'AM' : 'PM';
    return `${format_hour}:${format_minute} ${am}`;
  } else {
    return `${month + 1}/${date}/${year}`;
  }
};

export const countDownFormat = time => {
  const {day, hour, minute, second} = time;
  let timeDisplay = day + 'd ' + hour + 'h ' + minute + 'm ' + second + 's ';
  if (day == 0) {
    timeDisplay = hour + 'h ' + minute + 'm ' + second + 's ';
    if (hour == 0) {
      timeDisplay = minute + 'm ' + second + 's ';
      if (minute == 0) {
        timeDisplay = second + 's ';
      }
    }
  }
  if (!time) {
    timeDisplay = 'Ended';
  }
  return timeDisplay;
};

export const getMonth = time => {
  const input = time || Date.now();
  const today = new Date(input);
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();
  const date = today.getUTCDate();
  const hour = today.getUTCHours();
  const minute = today.getUTCMinutes();
  const seconds = today.getUTCSeconds();

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const month_days = [
    31,
    year % 4 == 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  // the first day of a month at UTC 1 am
  const offset = 1 * 60 * 60;
  const diff_to_begin = (((date - 1) * 24 + hour) * 60 + minute) * 60 + seconds;
  let begin = null;
  let end = null;

  if (diff_to_begin < offset) {
    const month_time = (month - 1 ? 31 : month_days[month - 1]) * 24 * 60 * 60;

    begin = new Date(
      (Math.floor(input / 1000) - diff_to_begin - month_time + offset) * 1000,
    );
    end = new Date((Math.floor(input / 1000) - diff_to_begin + offset) * 1000);
  } else {
    const month_time = month_days[month] * 24 * 60 * 60;
    begin = new Date(
      (Math.floor(input / 1000) - diff_to_begin + offset) * 1000,
    );
    end = new Date(
      (Math.floor(input / 1000) - diff_to_begin + month_time + offset) * 1000,
    );
  }

  return {month_begin: begin, month_end: end, month: months[month]};
};
