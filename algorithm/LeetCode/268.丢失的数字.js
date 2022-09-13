// 268. 丢失的数字
// https://leetcode.cn/problems/missing-number/

/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function (nums) {
  // 核心思路 0-n 的中间值 mid, 肯定等于 nums[mid],否则 中间有数字丢失
  // 0-n的数字 ，找出 没有的数字
  // 先将 nums 从小到大排序
  // 找出 left right的中间值 mid
  // 如果 mid === nums[mid] 表示 left- mid 之间没有丢失数字
  // 将 left 移动到mid+1
  // 否则 表示 left-mid 中间有丢失数字，将 right 移动到 mid-1,继续对比 left,right 的中间值 mid
  const n = nums.length;
  let left = 0;
  let right = n;
  let result = 0;
  nums.sort((a, b) => a - b);
  while (left <= right) {
    const mid = ~~((left + right) / 2);
    if (mid === nums[mid]) {
      left = mid + 1;
    } else {
      right = mid - 1;
      result = mid;
    }
  }
  return result;
};
