/**
 * 给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  /**
   * 将s 中每个元素出现的 索引 添加到 hash 中，
   * 如果 元素已存在，则将索引设置为 -1
   * 设置一个 firstIndex= s.length flag
   * 如果 索引不为 -1，并且索引小于 firstIndex，将当前的索引赋值给 firstIndex
   * 最后，如果 firstIndex === s.length ,表示 s 中的元素不存在不重复的元素 ，设置为 -1
   */
  const sLen = s.length;
  const map = new Map();
  for (let i = 0; i < sLen; i++) {
    const item = s[i];
    if (map.has(item)) {
      map.set(item, -1)
    } else {
      map.set(item, i)
    }
  }
  let firstIndex = sLen;
  for (let item of map.values()) {
    if (item !== -1 && item < firstIndex) {
      firstIndex = item
    }
  }
  return firstIndex === sLen ? -1 : firstIndex;
};