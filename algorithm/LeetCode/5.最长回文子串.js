// https://leetcode-cn.com/problems/longest-palindromic-substring/solution/zui-chang-hui-wen-zi-chuan-zuo-you-zhi-z-l6e1/

/**
 * @param {string} s
 * @return {string}
 babad
 */
// 一：中心扩散法
var longestPalindrome = function (s) {
  const len = s.length;
  let res = "";
  for (let i = 0; i < len; i++) {
    // 寻找长度为奇数的回文
    const s1 = palindrome(s, i, i);
    // 寻找长度为偶数的回文
    const s2 = palindrome(s, i, i + 1);
    // 比较返回的回文串，取其中最长的回文
    res = res.length > s1.length ? res : s1;
    res = res.length > s2.length ? res : s2;
  }
  return res
};
// 指针向左右两边移动
var palindrome = function (s, l, r) {
  // 以 l 下标 和 r 下标分别向左右两边扩散 
  // 循环查找 l r 下标位置的值，并进行比较，如果值相等，则继续向左右两侧扩散，
  // 不等，则返回 已查找到的回文串
  while (l >= 0 && r < s.length && s[l] === s[r]) {
    l--;
    r++;
  }
  return s.substr(l + 1, r - l - 1)
}
