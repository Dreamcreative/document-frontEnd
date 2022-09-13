// https://leetcode-cn.com/problems/sort-colors/solution/yan-se-fen-lei-by-leetcode-solution/

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function (nums) {
  /**
   * 方法一 双指针
    nums 中只存在 0 1 2
    遍历 nums ,
    将 0 放在 L 指针的位置 ，i L 索引位置的值进行交换 进行下一个 i 值的比较
    将 2 放在 R 指针位置 i R 索引值进行交换，当 i R 值交换后，由于 交换后的 i 索引值还没有进行比较，所以 继续比较当前 i 位置的值
   */
  const len = nums.length;
  if (len < 2) return nums;
  let L = 0;
  let i = 0;
  let R = len - 1;
  while (i <= R) {
    if (nums[i] === 0) {
      swap(nums, L, i);
      i++;
      L++;
    } else if (nums[i] === 1) {
      i++;
    } else {
      swap(nums, R, i);
      R--;
    }
  }
};
function swap(nums, index1, index2) {
  let temp = nums[index1];
  nums[index1] = nums[index2];
  nums[index2] = temp;
}
