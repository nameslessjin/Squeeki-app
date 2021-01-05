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
    const day = today.getDay();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const seconds = today.getSeconds();

    // UTC 1 am (ETS 8 pm PTS 5 pm)
    const diff_to_begin = ((((day)  * 24) + hour) * 60 + minute) * 60 + seconds
    const diff_to_end = 7 * 24 * 60 * 60 - diff_to_begin
    const offset = 20 * 60 * 60
    const begin = new Date((Math.floor(input / 1000) - diff_to_begin + offset) * 1000);
    const end = new Date((Math.floor(input / 1000) + diff_to_end + offset) * 1000);


    return {last_sunday: begin, next_sunday: end }

}

export const getNominationTime = (time) => {
    const nomination_time = new Date(time)
    const year = nomination_time.getFullYear()
    const month = nomination_time.getMonth()
    const date = nomination_time.getDate()
    
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