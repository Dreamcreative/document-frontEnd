// https://leetcode.cn/problems/search-insert-position/
// 搜索插入位置
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// 使用二分法
var searchInsert = function (nums, target) {
  let len = nums.length;
  // 左指针
  let left = 0;
  // 右指针
  let right = len - 1;
  // 最终返回位置
  let n = len;
  // 左指针小于右指针
  while (left <= right) {
    // 中间值 遇到小数点取整
    let mid = ~~((left + right) / 2);
    if (nums[mid] >= target) {
      // 中间值大于等于目标值
      // n = mid
      n = mid;
      // 右指针移动到 中间位置的左边
      right = mid - 1;
    } else {
      // 中间值 小于目标值
      // 左指针 移动到 中间值的右边
      left = mid + 1
    }
  }
  return n;
}
