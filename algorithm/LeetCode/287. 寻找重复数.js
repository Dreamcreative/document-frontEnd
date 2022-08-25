// 287. 寻找重复数
// https://leetcode.cn/problems/find-the-duplicate-number/
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function (nums) {
  // 一. hash 表
  // 遍历nums 中每个元素，添加到 Set 中，当 Set 存在当前元素时， 表示当前元素重复了， 直接返回
  const set = new Set();
  for (let item of nums) {
    if (set.has(item)) return item;
    set.add(item)
  }

  // 二. 二分查找

  // 三. 快慢指针
};
