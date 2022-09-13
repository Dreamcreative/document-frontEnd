// https://leetcode-cn.com/problems/3sum/solution/hua-jie-suan-fa-15-san-shu-zhi-he-by-guanpengchn/

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  /**
   * 一：排序 + 双指针 方法
    先将 nums 排序 从小到大
    遍历 nums i 当前值，L 左指针，R 右指针
    获取 nums i，L R 位置的和 sum , sum ===0 将值压入 result 数组，sum <0 L指针向右移动，sum>0 R 指针向左移动
    当 存在重复值时，特殊处理
   */
  let result = [];
  const len = nums.length;
  // 升序排列
  nums.sort((a, b) => a - b);
  // 当 len 小于3 直接返回
  if (len < 3) return result;

  for (let i = 0; i < len; i++) {
    // 当 nums[i]>0 时，i 之后的数字，不会再出现 和为 0 的情况，直接退出循环
    if (nums[i] > 0) break;
    // 去重 去除重复值
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    // 左指针
    let L = i + 1;
    // 右指针
    let R = len - 1;
    while (L < R) {
      // 获取 i L R 的和
      const sum = nums[i] + nums[L] + nums[R];
      if (sum === 0) {
        // sum === 0 时，将值 压入 result
        result.push([nums[i], nums[L], nums[R]]);
        // 去重 去除 左指针 相同的值
        while (L < R && nums[L] === nums[L + 1]) {
          L++;
        }
        // 去重 去除右指针相同的值
        while (L < R && nums[R] === nums[R - 1]) {
          R--;
        }
        // 去重之后，左指针右移，右指针左移
        L++;
        R--;
      } else if (sum > 0) {
        // sum>0 右指针左移
        R--;
      } else if (sum < 0) {
        // sum< 0 左指针右移
        L++;
      }
    }
  }
  return result;
};
