export const pointFormat = point => {
  let pointDisplay = point.toString();
  if (point > 10000) {
    const int = Math.floor(point / 1000);
    const dec = Math.floor((point - int * 1000) / 100) / 10;
    pointDisplay = (int + dec).toString() + 'K';
  }
  return pointDisplay
};
