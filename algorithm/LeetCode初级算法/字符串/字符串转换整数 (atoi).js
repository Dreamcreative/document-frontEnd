// 请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C / C++ 中的 atoi 函数）。
// 函数 myAtoi(string s) 的算法如下：
//     读入字符串并丢弃无用的前导空格
//     检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有）。 确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
//     读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
//     将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32）。如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
//     如果整数数超过 32 位有符号整数范围[−231, 231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被固定为 −231 ，大于 231 − 1 的整数应该被固定为 231 − 1 。
//     返回整数作为最终结果。
// 注意：
// 本题中的空白字符只包括空格字符 ' ' 。
// 除前导空格或数字后的其余字符串外，请勿忽略 任何其他字符。

/**
 * @param {string} s
 * @return {number}
 */
const max = Math.pow(2, 31) - 1;
const min = -Math.pow(2, 31);
var myAtoi = function (s) {
  // const len = s.length;
  // // 单位
  // let unit = '';
  // // 结果
  // let result = '';
  // for (let i = 0; i < len; i++) {
  //   const item = s.charAt(i);
  //   if (/[0-9]/.test(item)) {
  //     // 如果是0-9的数字 直接加上
  //     result += item;
  //     continue;
  //   } else if (item === '-') {
  //     // 如果是 - ，
  //     // 如果 unit 和 result 都不存在，表示是第一个 - 号
  //     // 设置 unit ,继续下一轮循环
  //     if (unit !== '' || result !== '') {
  //       break;
  //     }
  //     unit = '-';
  //     continue;
  //   } else if (item === '+') {
  //     // 如果是 + ，
  //     // 如果 unit 和 result 都不存在，表示是第一个 + 号
  //     // 设置 unit ,继续下一轮循环
  //     if (unit !== '' || result !== '') {
  //       break;
  //     }
  //     unit = '+';
  //     continue;
  //   } else if (item === ' ') {
  //     // 如果是 ' ' ，
  //     // 如果 unit 和 result 都不存在，表示是第一个 ' ' 号
  //     // 继续下一轮循环
  //     if (unit !== '' || result !== '') {
  //       break;
  //     }
  //     continue;
  //   } else {
  //     // 其他的直接返回
  //     break;
  //   }
  // }
  // // 转为数字
  // const total = Number(unit + result) || 0;
  // if (total > max) {
  //   // 大于最大值，返回最大值
  //   return max;
  // } else if (total < min) {
  //   // 小于最小值，返回最小值
  //   return min;
  // }
  // return total;
};