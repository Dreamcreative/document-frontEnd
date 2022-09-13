// https://leetcode-cn.com/problems/integer-to-roman/solution/zheng-shu-zhuan-luo-ma-shu-zi-by-leetcod-75rs/
/**
 * @param {number} num
 * @return {string}
 */

// 创建数字与罗马数字 几个关键的对应关系
let romanMap = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
];

/**
 * 以 num = 2345 为例
  2345 [1000,"M"] count = 2, 2345%1000 = 345; roman= "MM"
  345 [100,"C"] count = 3, 345%100 = 45; roman = "MMCCC"
  45 [40,"XL"] count = 1, 5%40 = 5; roman = "MMCCCXL"
  5 [5,"V"] count =1 , 5%5=0; roman = "MMCCCXLV"

  值在遍历的过程中会越来越小，所以只会向后匹配 罗马的对应关系
 */
var intToRoman = function (num) {
  let roman = '';
  // 遍历 整理的关键对应关系
  for (let [value, key] of romanMap) {
    // 取 num / value 的整数部分
    let count = Math.floor(num / value);
    if (count > 0) {
      // 拼接 整数个数的 key
      roman += key.repeat(count);
      num = num % value;
    }
  }
  return roman;
};
