// https://leetcode-cn.com/problems/zigzag-conversion/solution/zzi-xing-bian-huan-by-jyd/

/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */

var convert = function (s, numRows) {
  /**
  以 s = PAYPALISH numRows = 3 为例
  创建长度为3且填充了 空字符的数组  res = ["","",""]
  i=0 下  ['P','','']
  i=1 下 ['P','A','']
  i=2 下 ['P','A','Y']
  i=1 上 ['P','AP','Y']
  i=0 上 ['PA','APL','Y']
  i=1 下 ['PA','APL','YI']
  i=2 上 ['PA','APLS','YI']
  i=0 上 ['PAH','APLS','YI']
  
  最终 PAHAPLSYI
   */
  // numRows 为1是，不需要变化
  if (numRows === 1) return s;
  // 创建一个 numRows 长度的数组，来存储 Z字变形后的字符
  let res = new Array(numRows).fill('')
  // 字符 存储的索引
  let i = 0;
  // 字符的移动方向 true 向下， false 向上
  let direction;
  while (s !== '') {
    // 获取当前 字符
    const char = s[0];
    // 当 i 回到起始位置时， 字符的移动方向 变为向下
    if (i === 0) {
      direction = true;
    } else if (i === numRows-1) {
      // 当 i 快到终止位置时，字符的移动方向变为向上
      direction = false;
    }
    // 将 当前字符 添加到对应的 索引中
    res[i] = res[i] + char
    // 根据 direction 方向，判断 i 的是向上移动还是向下移动
    i = direction ? i + 1 : i - 1;
    // 将当前已插入到数组中的 字符删除，返回新的字符
    s = s.slice(1)
  }
  // 数组拼接 返回
  return res.join('');
};
