// https://leetcode-cn.com/problems/implement-strstr/solution/shi-xian-strstr-by-leetcode-solution-ds6y/

/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  /**
    方法一：从 haystack 中，取出从 i索引开始的 needle 字符长度的字符来与 needle 进行对比。相等则返回 索引 i
   */
  if (needle === '') return 0;
  const len = haystack.length;
  const nLen = needle.length;
  for (let i = 0; i < len; i++) {
    // 从 haystack 中取出 needle 字符长度的 字符与 needle 进行对比
    const str = haystack.substr(i, nLen);
    if (str === needle) {
      return i;
    }
  }
  return -1;
};
