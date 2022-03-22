// https://leetcode-cn.com/problems/palindrome-number/solution/ji-jian-jie-fa-by-ijzqardmbd-2/

// 给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。
// 回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
// 例如，121 是回文，而 123 不是。

/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    // 一：双指针
    /**
    将数字转为字符串,字符串从左右两边开始比对，如果比对到字符中间都相等，返回true
    如果还没有比对到中间就不相等 则返回false
     */
    const s = ""+x;
    let l=0;
    let r = s.length-1;
    while(r>l){
      if(s[l]!==s[r])return false;
      l++;
      r--;
    }
    return true;

    // 二：数学解法
};
