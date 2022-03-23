// 类似于 9.回文数

/**
 * @param {number} x
 * @return {number}
 */
// 需要判断 反转后的数字 是否溢出
const max = Math.pow(2, 31) - 1;
const min = -Math.pow(2, 31);
var reverse = function (x) {
  // 一：数学方法
  /** 
  12345  => 54321
  1234 5
  123 54
  12 543
  1 5432
  0 54321
   */
  let is = false;
  let num = 0;
  // 判断是否是负数，是负数就转为整数 处理
  if (x < 0) {
    // 为什么要判断正负数，因为 Math.floor()在处理负数时， -12.2 处理为 -13。所以需要将负数转为整数处理
    is = true;
    x = -x;
  }
  while (x !== 0) {
    // 依次将 数字 x 的 尾数位提前 
    num = num * 10 + x % 10;
    // 去除 x 的 尾数位
    x = Math.floor(x / 10);
  }
  // 如果是负数
  if (is) {
    // num 小于最小值 为0
    if (-num < min) return 0;
    return -num
  }
  // num 大于最大值 为 0
  if (num > max) return 0;
  return num
};
