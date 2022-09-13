// 编写一个函数来查找字符串数组中的最长公共前缀。
// 如果不存在公共前缀，返回空字符串 ""。

/**
 * @param {string[]} strs
 * @return {string}
 */
// ["flower","flow","flight"]
var longestCommonPrefix = function (strs) {
  /**
  一
  1. 先遍历获取 传入字符串中长度最短的元素
  2. 遍历 最短元素，使用 str.substr()获取 字符串的前几个字符
  3. 遍历 字符串数组，依次对比字符串的前缀字符
  4. 得到 最大公共前缀
  */
  // let samestr = '';
  // if (strs.length === 0) return samestr;
  // let minStr = '';
  // for (let i = 0; i < strs.length; i++) {
  //   const item = strs[i];
  //   if (!minStr) {
  //     minStr = item;
  //     continue;
  //   }
  //   if (item.length < minStr.length) {
  //     minStr = item;
  //     continue;
  //   }
  // }
  // if (minStr.length === 0) return samestr;
  // for (let i = 0; i < minStr.length; i++) {
  //   const prestr = minStr.substr(0, i + 1);
  //   for (let j = 0; j < strs.length; j++) {
  //     const item = strs[j];
  //     let pre = item.substr(0, i + 1);
  //     if (pre !== prestr) {
  //       return samestr;
  //     }
  //   }
  //   samestr = prestr;
  // }
  // return samestr;
  /**
  二
  纵向扫描
  f l o w e r
  f l o w 
  f l i g h t

  从数组中取出一个基础字符串，与剩下的字符串 分别对比相同索引下标上位置的 字符串
  */
  // const firstItem = strs.shift();
  // let samestr = '';
  // for (let i = 0; i < firstItem.length; i++) {
  //   let char = firstItem.charAt(i);
  //   for (let item of strs) {
  //     if (item.charAt(i) !== char) return samestr;
  //   }
  //   samestr += char;
  // }
  // return samestr;
};
