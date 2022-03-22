// https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/solution/jian-dan-shuang-zhi-zhen-wei-hu-hua-dong-atl5/

/**
 * @param {string} s
 * @return {number}
 abcabcbb
 pwwkew
 */
var lengthOfLongestSubstring = function (s) {
  // 一： 使用滑动窗口 + hash 表
  /**
   * 使用 两个指针，start end ，start 表示字符的下标，end 表示重复字符的下标
   */
  // 字符长度
  const len = s.length;
  // map 保存字符索引
  let map = new Map();
  // 重复字符的下标
  let end = 0;
  // 最大值
  let max = 0;
  // 遍历字符
  for (let start = 0; start < len; start++) {
    // 当前字符
    const char = s[start];
    // map.has(char) 表示 当前字符已经存在 ， map.get(char)>=end 保证 end的值在 [end, start) 之间
    // 那么从 map 中获取之前出现的字符索引
    // abcabcbb 为例 当 start = 3 时，char 为a ,但是 map中存在 a 索引为0
    if (map.has(char) && map.get(char) >= end) {
      end = map.get(char) + 1;
    }
    // 获取最大值，max 值每次都会加一，只有当遇到重复字符时并且 map中 char 的索引在[end,start) 之间， end 才会进行移动，
    max = Math.max(max, start - end + 1)
    // 设置 map 值，当前字符和字符下标，如果出现重复字符，新的字符覆盖旧字符的索引
    map.set(char, start)
  }
  return max
};
