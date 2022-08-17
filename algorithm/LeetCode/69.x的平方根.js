// https://leetcode.cn/problems/sqrtx/
// x 的平方根

/**
 * @param {number} x
 * @return {number}
 */
// 二分法

var mySqrt = function (x) {
  /**
   * 通过 判断 mid*mid <= x
   * 如果 mid*mid <= x  left 右移 n = mid
   * mid*mid > x right 左移
   * 最后 当 left 与 right 交叉时 n 为最终的 值
   */
  let left = 0;
  let right = x;
  let n = 0;
  while (left <= right) {
    // 中间值 ~~ 表示 小数取整
    let mid = ~~((left + right) / 2);
    if (mid * mid <= x) {
      // mid*mid <= x  left 右移 n = mid
      n = mid;
      left = mid + 1;
    } else {
      // mid*mid > x right 左移
      right = mid - 1
    }
  }
  return n;
}
