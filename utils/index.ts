/**
 * 指定した長さの配列を生成します。
 */
export function createArray(length: number) {
  return [...Array(length)];
}

/**
 * 配列を指定した長さに区切ります。
 */
export function chunkArray(array: any[], length: number) {
  const chunkCount = Math.ceil(array.length / length);
  return createArray(chunkCount).map((_, i) => array.slice(i * length, (i + 1) * length));
}

/**
 * 0以上かつ指定した最大値未満の整数の乱数を生成します。
 */
export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
