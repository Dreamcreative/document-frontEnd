// https://leetcode-cn.com/problems/longest-common-prefix/solution/zui-chang-gong-gong-qian-zhui-by-leetcode-solution/

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  /**
   * 一：暴力解法
    通过 第一个字符串 firstItem，
    遍历 firstItem,依次比对 strs 剩余的字符串，相同前缀，一个字符一个字符比对，
   */
  // const firstItem = strs.shift();
  // let common = '';
  // let is = true;
  // for (let i = 0; i < firstItem.length; i++) {
  //   const char = firstItem[i];
  //   // for 遍历比 for of 遍历性能好一点

  //   // for(let item of strs){
  //   //   if(!item[i] ||item[i]!==char){
  //   //     return common;
  //   //   }
  //   // }
  //   for (let j = 0; j < strs.length; j++) {
  //     let item = strs[j];
  //     if (!item[i] || item[i] !== char) {
  //       return common
  //     }
  //   }
  //   if (is) {
  //     common += char;
  //   }
  // }
  // return common;

  /**
    * 二：横向比对
    以第一个字符串为基准，分别比对 strs中剩余的元素，将 common 作为
    第一个元素默认作为 公共部分，
    common = strs.shift();
    将之前元素比对后得到的公共部分作为 第一个参数，下一次遍历的元素作为第二个参数，返回一个 最新的公共部分
    common = samePrefix(common, strs[i])
   */

  let common = strs.shift();
  for (let i = 0; i < strs.length; i++) {
    common = samePrefix(common, strs[i])
  }
  return common;
};
/**
 * 
 * @param {string} pre 之前元素比对后得到的公共部分
 * @param {string} str 下一个需要比对的元素
 */
function samePrefix(pre, str) {
  if (!str) return str;
  let common = '';
  for (let i = 0; i < pre.length; i++) {
    if (pre[i] === str[i]) {
      common += pre[i]
    } else {
      return common;
    }
  }
  return common;
}
