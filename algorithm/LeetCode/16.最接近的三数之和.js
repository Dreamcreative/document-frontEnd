// https://leetcode-cn.com/problems/3sum-closest/solution/shuang-zhi-zhen-jie-fa-javascript-by-lzx-r3xi/
// https://leetcode-cn.com/problems/3sum-closest/solution/ren-zhe-suan-fa-ren-zhun-ren-zhe-suan-fa-1w34/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function (nums, target) {
  /**
    排序 + 双指针 方法
   */
  // nums 排序
  nums.sort((a, b) => a - b);
  const len = nums.length;
  // 默认最接近的值
  let nearest = nums[0] + nums[1] + nums[2];
  for (let i = 0; i < len; i++) {
    // 左指针
    let L = i + 1;
    // 右指针
    let R = len - 1;
    while (L < R) {
      // 三个值的和
      const sum = nums[i] + nums[L] + nums[R];
      // 判断 target 到 sum 的距离，判断 target 到 nearset 的距离
      // 如果 target 到 sum 的距离 小于 目前 target 到 nearest 的距离，更新 nearest
      if (Math.abs(target - sum) < Math.abs(target - nearest)) {
        nearest = sum;
      }
      if (sum === target) {
        // 三值和 等于 target, 直接返回
        return sum;
      } else if (sum > target) {
        // 三值和 大于 target, 表示 当前值偏大，右指针左移
        R--;
      } else if (sum < target) {
        // 三值和 小于 target,表示 当前值偏小，左指针右移
        L++;
      }
    }
  }
  return nearest;
};
