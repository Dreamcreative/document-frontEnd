/**
 * 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。
 * 如果反转后整数超过 32 位的有符号整数的范围 [−2^31,  2^31 − 1] ，就返回 0。
 * 假设环境不允许存储 64 位整数（有符号或无符号）。
 * @param {number} x
 * @return {number}
 */
//  限制的最大值 最小值
const max = Math.pow(2, 31) - 1;
const min = -Math.pow(2, 31);
var reverse = function (x) {
  /**
   * 一
   */
  // let result = 0;
  // while (x !== 0) {
  //   // 使用 x%10 得到末尾数字
  //   const digit = x % 10;
  //   // 使用 x = parseInt(x / 10)，设置 x 得到剩余的整数部分
  //   x = parseInt(x / 10);
  //   // 将 result * 10 + digit，得到反转之后的数字
  //   result = result * 10 + digit;
  //   if (result > max || result < min) {
  //     return 0;
  //   }
  // }
  // return result;
  /**
   * 二
   */
  // // 将 x 转为字符串
  // let str = String(x);
  // let result = 0;
  // if (x >= 0) {
  //   // x 大于等于0
  //   // 得到反转后的字符串
  //   result = reverseString(str.split(''));
  //   if (result > max) {
  //     return 0;
  //   }
  // } else {
  //   // x 小于0
  //   // 得到反转后的字符串
  //   // slice(1) 剪切掉负数转为数组后 第一位的符号
  //   result = -reverseString(str.split('').slice(1));
  //   if (result < min) {
  //     return 0;
  //   }
  // }
  // return Number(result);
};
var reverseString = function (strArr) {
  const len = strArr.length;
  for (let i = 0; i < len / 2; i++) {
    // 元素首尾替换
    let temp = strArr[len - 1 - i];
    strArr[len - 1 - i] = strArr[i];
    strArr[i] = temp;
  }
  return strArr.join('');
};
