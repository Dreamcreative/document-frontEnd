// 1460.通过翻转子数组使两个数组相等
// https://leetcode.cn/problems/make-two-arrays-equal-by-reversing-sub-arrays/

/**
 * @param {number[]} target
 * @param {number[]} arr
 * @return {boolean}
 */
var canBeEqual = function (target, arr) {
  // 这里只需要判断两个数组有没有可能通过翻转 ，最终 target == arr
  // 所以只要判断 target/arr 数组的元素和元素个数相等就行了

  // 1. 排序法
  // 将 两个数组排好序，然后判断值相等
  // target.sort();
  // arr.sort();
  // return target + '' == arr + '';

  // 2. 值比较
  // 使用 Map 结构 将 target arr 的元素和 元素出现的次数存储
  // 然后比较 target/arr 每个元素和 每个元素出现的次数是否相等
  const tMap = new Map();
  const aMap = new Map();
  for (let item of target) {
    tMap.set(item, tMap.get(item) ? tMap.get(item) + 1 : 1);
  }
  for (let item of arr) {
    aMap.set(item, aMap.get(item) ? aMap.get(item) + 1 : 1);
  }
  for (let [key, value] of tMap) {
    if (!aMap.get(key) || aMap.get(key) !== value) {
      return false;
    }
  }
  return true;
};
