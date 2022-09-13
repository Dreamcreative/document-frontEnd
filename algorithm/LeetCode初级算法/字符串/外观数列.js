/** 外观数列
 * 给定一个正整数 n ，输出外观数列的第 n 项
 * 「外观数列」是一个整数序列，从数字 1 开始，序列中的每一项都是对前一项的描述。
 *
 * 前5项
 * 1.     1
 * 2.     11
 * 3.     21
 * 4.     1211
 * 5.     111221
 * 第一项是数字 1
 * 描述前一项，这个数是 1 即 “ 一 个 1 ”，记作 "11"
 * 描述前一项，这个数是 11 即 “ 二 个 1 ” ，记作 "21"
 * 描述前一项，这个数是 21 即 “ 一 个 2 + 一 个 1 ” ，记作 "1211"
 * 描述前一项，这个数是 1211 即 “ 一 个 1 + 一 个 2 + 二 个 1 ” ，记作 "111221"
 */

/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function (n) {
  let result = '1';
  if (n === 1) return result;
  // 保存临时 字符串
  let tempStr;
  do {
    // 保存 临时数组 index 0 保存相同整数的长度 ，index 1 保存当前整数的值
    let tempArr = new Array(2);
    // 双指针 i 记录需要对比数字的第一个位置
    // j 记录 相同整数的 长度
    let i = 0;
    let j = 1;
    for (; i < result.length; ) {
      const first = result.charAt(i);
      const next = result.charAt(j);
      // 设置当前需要记录长度的值
      tempArr[1] = first;
      // 如果 数字相等， 则 j 向后移动
      if (next !== undefined && first === next) {
        j++;
      } else {
        // 否则 设置 temp[0] 相同整数的长度
        tempArr[0] = j - i;
        // 将 i 移动到下一个 对比数字的 索引
        i = j;
        // 同时将 j 移动到下一个对比数字的 索引
        j++;
        // 拼接 每一段 相同数字的结果
        tempStr += tempArr.join('');
        // 清空保存 0 数字长度 1 数字值的 临时数组
        tempArr = [];
      }
      // next ==='' 表示 j 的当前值不存在 ，即 result 已经遍历完
      // 停止 for 循环
      if (next === '') break;
    }
    // 设置下一轮遍历的 初始值
    result = tempStr;
    // 当前 n 已处理完成，进行下移轮的处理
    n--;
  } while (n - 1 !== 0);
  return result;
};
