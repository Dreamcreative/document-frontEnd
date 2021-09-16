// 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。

// 说明：
// 当 needle 是空字符串时，我们应当返回什么值呢？这是一个在面试中很好的问题。
// 对于本题而言，当 needle 是空字符串时我们应当返回 0 。这与 C 语言的 strstr() 以及 Java 的 indexOf() 定义相符。


/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  const hLen = haystack.length;
  const nLen = needle.length;
  if (nLen === 0) return 0;
  if (nLen > hLen) return -1;
  for (let i = 0; i < hLen; i++) {
    const str = haystack.substr(i, nLen);
    if (str.length < nLen) return -1;
    if (str === needle) {
      return i;
    }
  }
  return -1;
};