
/**
 * 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  /**
   * 一：暴力解法，两次遍历
   * 第一次遍历，获取 target 与 nums[i]的差值 rest
   * 第二次遍历，查找数组中是否存在 rest，并且只有 i 与 inner 不等时，返回数组下标
   */
  // const len = nums.length;
  // for (let i = 0; i < len; i++) {
  //   const rest = target - nums[i];
  //   for (let inner = 0; inner < len; inner++) {
  //     if (rest === nums[inner] && inner !== i) {
  //       return [i, inner];
  //     }
  //   }
  // }

  /**
    二：使用 hash 表
    该题条件为 只会存在一个对应的答案，所以就算是 3+3 =6 这种情况， 3也只会出现2次，并且会在不同的位置。
    所以 hash 对象中存值 不需要关心，两个相同的值被覆盖
    
    遍历数组时，获取到了 rest 剩余值之后，再从 hash 对象中取另一个值，需要判断取到的值是否与当前数组中值的索引相同。
      如果相同，则放弃，继续下一次遍历
      不同，则直接返回结果
   */

  const len = nums.length;
  let obj = {}
  // 将 数据值，以 数组索引为 key，以数组value 为对象 value;生成对象
  for (let i = 0; i < len; i++) {
    obj[nums[i]] = i
  }
  // 遍历数组
  for (let i = 0; i < len; i++) {
    // 获取剩余值 
    let rest = target - nums[i];
    let index = obj[rest];
    // 判断剩余值在 obj 是否存在
    if (index) {
      // 存在，并且 obj中存储的下标值，不与数组中下标值相同，返回 
      if (index !== i) {
        return [i, index]
      }
      // 否则继续遍历
      continue;
    }
  }
};
