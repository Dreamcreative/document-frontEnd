/**
 * 有效的字母异位词
 * 给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。
 * 注意：若 s 和 t 中每个字符出现的次数都相同，则称 s 和 t 互为字母异位词。
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */

var isAnagram = function (s, t) {
  /**
   * 一
   * 1. 将 s t 字符串中每个元素出现的个数用对象保存
   * 2. 遍历比较 2个元素出现次数
   */
  // const sLen = s.length;
  // const tLen = t.length;
  // if (sLen !== tLen) return false;
  // const sObj = {};
  // const tObj = {};
  // for (let i = 0; i < sLen; i++) {
  //   const sItem = s.charAt(i);
  //   const tItem = t.charAt(i);
  //   tObj[tItem] = tObj[tItem] ? tObj[tItem] + 1 : 1;
  //   sObj[sItem] = sObj[sItem] ? sObj[sItem] + 1 : 1;
  // }
  // for (let item in sObj) {
  //   if (sObj[item] !== tObj[item]) {
  //     return false;
  //   }
  // }
  // return true;
  /**
   * 二
   * 1. 将s t 先进行排序，在比较 是否相等
   */
  // const sLen = s.length;
  // const tLen = t.length;
  // if (sLen !== tLen) return false;
  // return [...s].sort().join() === [...t].sort().join();
};
