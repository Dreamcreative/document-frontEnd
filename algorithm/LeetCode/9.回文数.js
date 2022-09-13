// https://leetcode-cn.com/problems/palindrome-number/solution/ji-jian-jie-fa-by-ijzqardmbd-2/
// https://leetcode-cn.com/problems/palindrome-number/solution/hua-jie-suan-fa-9-hui-wen-shu-by-guanpengchn/

// 给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。
// 回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
// 例如，121 是回文，而 123 不是。

/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  // 一：双指针
  /**
  将数字转为字符串,字符串从左右两边开始比对，如果比对到字符中间都相等，返回true
  如果还没有比对到中间就不相等 则返回false
   */
  // const s = ""+x;
  // let l=0;
  // let r = s.length-1;
  // while(r>l){
  //   if(s[l]!==s[r])return false;
  //   l++;
  //   r--;
  // }
  // return true;

  // 二：数学解法
  // 小于0的数都不是 回文数
  // 从 x 值的 个位数开始取数， 取到的数依次向高位进位
  // 最后将得到的值 cur  与原值 x 比较，如果相等则是回文数
  /** 123432 执行顺序
  一：cur 2 num 12343
  二：cur 23 num 1234
  三：cur 234 num 123
  四：cur 2343 num 12
  五：cur 23432 num 1
  六：cur 234321 num 0 结束

  cur =234321  x = 123432
   */
  if (x < 0) return false;
  let cur = 0;
  let num = x;
  while (num >= 1) {
    // 将 当前 cur 向 高位移动 加上 个位数
    cur = cur * 10 + (num % 10);
    // 将 num 除以 10 取整
    num = Math.floor(num / 10);
  }
  // 最后 判断 从个位数开始取到的值 重新拼成
  return cur === x;
};
