export const dateConversion = (time) => {
    const date = new Date(parseInt(time));
    const year = date.getFullYear();
    const day = date.getDate();
    const month = date.getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const postSecond = Math.floor(date.getTime() / 1000)

    let outputTime = ''


    const today = new Date()
    const currentSecond = Math.floor(today.getTime() / 1000)


    const timeDifference = currentSecond - postSecond

    if (0 <= timeDifference && timeDifference < 60){
        outputTime = timeDifference.toString() + ' s ago'
    }

    if (60 <= timeDifference && timeDifference < 60*60){
        const outputT = Math.floor(timeDifference / 60)
        outputTime = outputT.toString() + ' m ago'
    }

    if (60*60 <= timeDifference && timeDifference < 60*60*24){
        const outputT = Math.floor(timeDifference / (60 * 60))
        outputTime = outputT.toString() + ' hr ago'
    }

    if (60*60*24 <= timeDifference && timeDifference < 60*60*24*4){

        const outputT = Math.floor(timeDifference / (60*60*24))
        outputTime = outputT.toString() + ' d ago'

    }

    if (timeDifference >= 60*60*24*4){
        outputTime = months[month] + ' ' + day + ' ' + (year - 2000)
    }


    return outputTime
}

export const getSundays = (time) => {
    const input = time ||  Date.now()
    const today = new Date(input);
    const day = today.getUTCDay();
    const hour = today.getUTCHours();
    const minute = today.getUTCMinutes();
    const seconds = today.getUTCSeconds();

    // UTC 1 am (ETS 8 pm PTS 5 pm)
    const offset = 1 * 60 * 60
    const diff_to_begin = ((((day - 1)  * 24) + hour) * 60 + minute) * 60 + seconds
    let begin = null
    let end = null
    if (diff_to_begin < offset){
         begin = new Date((Math.floor(input / 1000) - diff_to_begin + offset - 7 * 24 * 60 * 60) * 1000)
         end = new Date((Math.floor(input / 1000) - diff_to_begin + offset) * 1000);
    } else {
         begin = new Date((Math.floor(input / 1000) - diff_to_begin + offset) * 1000);
         end = new Date((Math.floor(input / 1000) - diff_to_begin + offset +  7 * 24 * 60 * 60) * 1000);
    }


    return {last_sunday: begin, next_sunday: end }

}

export const getFormalTime = (time) => {
    const formalTime = new Date(time)
    const year = formalTime.getFullYear()
    const month = formalTime.getMonth()
    const date = formalTime.getDate()
    
    return {year: year, month: month, date: date}

}

export const calculateTimeAddition = (time) => {
    return new Date(Date.now() + time * 60 * 1000)
}

export const timeDifferentInMandS = (time) => {
    const current = Date.now()
    let diff = time - current

    if (diff <= 0){
        return false
    }

    diff = diff / 1000

    const day =  Math.floor(diff / (60 * 60 * 24))
    const hour = Math.floor((diff - day * (60 * 60 * 24)) / (60 * 60) )
    const minute = Math.floor( (diff - day * (60 * 60 * 24) - hour * (60 * 60)) / 60 )  
    const second = Math.floor(diff - day * (60 * 60 * 24) - hour * (60 * 60) - minute * 60)
    
    return {day: day, hour: hour, minute: minute, second: second}
}

export const getSemester = (time) => {
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
          1000
      );
      end = new Date((Math.floor(input / 1000) - diff_to_begin + offset) * 1000);
    } else if (diff_to_begin >= offset  &&  diff_to_begin < begin_offset){
      begin = new Date(
        (Math.floor(input / 1000) - diff_to_begin + offset) * 1000
      );
      end = new Date(
        (Math.floor(input / 1000) - diff_to_begin + begin_offset) *
          1000
      );
    } else if (diff_to_begin >= begin_offset){
      begin = new Date(
        (Math.floor(input / 1000) - diff_to_begin + begin_offset) * 1000
      );
      end = new Date(
        (Math.floor(input / 1000) - diff_to_begin + current_year_time + offset) *
          1000
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
  
    return { semester_begin: begin, semester_end: end };
  };