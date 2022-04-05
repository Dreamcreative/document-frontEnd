// https://leetcode-cn.com/problems/remove-element/solution/yi-chu-yuan-su-by-leetcode-solution-svxi/

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  /**
   * 方法一：双指针
    比较每个值与 val 是否相等，
    不相等，则将 R 索引的值赋值给 L 索引，L 指针右移
   */
  const len = nums.length;
  let L = 0;
  for (let R = 0; R < len; R++) {
    if (nums[R] !== val) {
      nums[L] = nums[R];
      L++;
    }
  }
  return L;
};
