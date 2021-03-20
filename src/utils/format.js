export const countFormat = (count) => {

    let count_text = count.toString()
    if (count >= 1000) {
      count_text =
        Math.floor(count / 1000) +
        Math.floor(
          (count -
            Math.floor(count / 1000) * 1000) /
            100,
        ) /
          10 +
        'k';
    }
    
    if (count >= 1000000) {
      count_text =
        Math.floor(count / 1000000) +
        Math.floor(
          (count -
            Math.floor(count / 1000000) * 1000000) /
            100000,
        ) /
          10 +
        'm';
    }

    return count_text

}