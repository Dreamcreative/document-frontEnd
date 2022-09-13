// https://leetcode-cn.com/problems/4sum/solution/si-shu-zhi-he-by-leetcode-solution/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  /**
   * 方法一：排序 + 双指针
   */
  const len = nums.length;
  const result = [];
  // 数组长度小于4，直接返回空
  if (len < 4) return result;
  // 数组排序
  nums.sort((a, b) => a - b);
  // 生成一个 hash 表，用来存储满足条件的值
  const map = new Map();
  for (let i = 0; i < len - 3; i++) {
    // 遍历数组，从第一个值开始
    for (let j = j + 1; j < len - 2; j++) {
      // 遍历数组，从第二个值开始
      // 左指针
      let L = j + 1;
      // 右指针
      let R = len - 1;
      while (L < R) {
        // 获取当前遍历到的值的和
        const sum = nums[i] + nums[j] + nums[L] + nums[R];
        if (sum === target) {
          // 和 等于 target
          const arr = [nums[i], nums[j], nums[L], nums[R]];
          if (!map.get(arr + '')) {
            // 在hash 表中查找是否已存在， 值不存在时，将值插入数组
            result.push(arr);
          }
          // 设置 hash 表的值
          map.set(arr + '', true);
          // 遍历 数组的值，去除重复的 左侧值
          while (L < R && nums[L] === nums[L + 1]) {
            L++;
          }
          // 遍历数组的值，去除重复的右侧值
          while (L < R && nums[R] === nums[R - 1]) {
            R--;
          }
          L++;
          R--;
        } else if (sum > target) {
          // 和大于 target 右指针 左移
          R--;
        } else {
          // 和小于 target 左指针右移
          L++;
        }
      }
    }
  }
  return result;
};
