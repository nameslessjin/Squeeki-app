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

        if (outputT == 1){
            outputTime = outputT.toString() + ' m ago'
        } else {
            outputTime = outputT.toString() + ' ms ago'
        }
    }

    if (60*60 <= timeDifference && timeDifference < 60*60*24){
        const outputT = Math.floor(timeDifference / (60 * 60))
        if (outputT == 1){
            outputTime = outputT.toString() + ' hr ago'
        } else {
            outputTime = outputT.toString() + ' hrs ago'
        }
    }

    if (60*60*24 <= timeDifference && timeDifference < 60*60*24*4){

        const outputT = Math.floor(timeDifference / (60*60*24))
        if (outputT == 1){
            outputTime = outputT.toString() + ' d ago'
        } else {
            outputTime = outputT.toString() + ' ds ago'
        }
    }

    if (timeDifference >= 60*60*24*4){
        outputTime = months[month] + ' ' + day + ' ' + (year - 2000)
    }


    return outputTime
}

export const getSundays = (time) => {
    const input = time ||  Date.now()
    const today = new Date(input);
    const year = today.getFullYear();
    const day = today.getDay();
    const month = today.getMonth();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const seconds = today.getSeconds();
    const date = today.getDate();

    let last_diff_time = 0
    if (day == 0 && hour <= 18){
        last_diff_time = (((7 * 24 + hour - 18) * 60 + minute) * 60 + seconds) * 1000;
    } else {
        last_diff_time = (((day * 24 + hour - 18) * 60 + minute) * 60 + seconds) * 1000;
    }
    const last_sunday = new Date((input) - last_diff_time);
    // const last_sunday_year = last_sunday.getFullYear();
    // const last_sunday_month = last_sunday.getMonth();
    // const last_sunday_hour = last_sunday.getHours();
    // const last_sunday_date = last_sunday.getDate();
    // const last_sunday_UTC = Date.UTC(last_sunday_year, last_sunday_month, last_sunday_date, last_sunday_hour)
    
    let next_diff_time = 0
    if (day  == 0 && hour <= 18){
        next_diff_time = (((18 - hour) * 60 - minute) * 60 - seconds) * 1000
    } else {
        next_diff_time = (((24 * (7 - day) + (18 - hour)) * 60 - minute) * 60 - seconds) * 1000
    }

    const next_sunday = new Date((input) + next_diff_time)
    // const next_sunday_year = next_sunday.getFullYear();
    // const next_sunday_month = next_sunday.getMonth();
    // const next_sunday_hour = next_sunday.getHours();
    // const next_sunday_date = next_sunday.getDate();
    // const next_sunday_UTC = Date.UTC(next_sunday_year, next_sunday_month, next_sunday_date, next_sunday_hour)

    return {last_sunday: last_sunday, next_sunday: next_sunday }

}

export const getNominationTime = (time) => {
    const nomination_time = new Date(time)
    const year = nomination_time.getFullYear()
    const month = nomination_time.getMonth()
    const date = nomination_time.getDate()
    
    return {year: year, month: month, date: date}

}