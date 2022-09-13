// https://leetcode-cn.com/problems/roman-to-integer/solution/luo-ma-shu-zi-zhuan-zheng-shu-by-leetcod-w55p/

/**
 * @param {string} s
 * @return {number}
 */
// 罗马数字与 整数的对应关系
let romanMap = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
let romanMap2 = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
var romanToInt = function (s) {
  /**一：从罗马数字中 取对应的整数
   * 思路：遍历 罗马数字
    如果左侧的罗马数字 小于 右侧的罗马数字，计算整数时，将 两个罗马数字进行 拼接 取值
    否则 直接从 romanMap 中取值

    MCMXCIV
    M 右侧的 C 比 M 小 ，num = 1000(M)
    C 右侧的 M 比 C 大，num = 1000(M) + 900(CM)
    X 右侧的 C 比 X 大，num = 1000(M) + 900(CM) + 100(XC)
    I 右侧的 V 比 I 大，num = 1000(M) + 900(CM) + 100(XC) + 4(IV)

    最终 1000+900+100+4
   */
  // let num = 0;
  // for (let i = 0; i < s.length;) {
  //   let str = '';
  //   if (romanMap[s[i]] < romanMap[s[i + 1]]) {
  //     str = s[i] + s[i + 1]
  //     num += romanMap[str];
  //     i += 2
  //     continue;
  //   } else {
  //     str = s[i]
  //     num += romanMap[str];
  //     i++;
  //     continue;
  //   }
  // }
  // return num;

  /** 二：罗马数字 右边的大于左边的进行 减法，右边的小于左边的进行 加法

  MCMXCIV
  M 大于 C num = 1000
  C 小于 M num = 1000 - 100
  M 大于 X num = 1000 -100 +1000
  X 小于 C num = 1000 -100 +1000 - 10
  C 大于 I num = 1000 -100 +1000 +10 + 100
  I 小于 V num = 1000 -100 +1000 +10 + 100 -1
  v num = 1000 -100 +1000 +10 + 100 -1+ 5
   */
  let num = 0;
  for (let i = 0; i < s.length; i++) {
    if (romanMap2[s[i]] < romanMap2[s[i + 1]]) {
      num -= romanMap2[s[i]];
    } else {
      num += romanMap2[s[i]];
    }
  }
  return num;
};
