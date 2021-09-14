/**
 * @param {string} s
 * 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
 * 说明：本题中，我们将空字符串定义为有效的回文串。
 * @return {boolean}
 */
var isPalindrome = function (s) {
  // [^a-z] 表示匹配不在 [] 中的字符
  const reg = /[^A-Za-z0-9]/ig;
  // 使用正则匹配 A-Za-z0-9 其他字符全设置为 ''
  const str = s.replaceAll(reg, '');
  const strLen = str.length;
  if (strLen === 0) return true;
  for (let i = 0; i < strLen / 2; i++) {
    // 获取前字符 并转为小写
    const pre = str[i].toLowerCase();
    // 获取后字符 并转为小写
    const last = str[strLen - i - 1].toLowerCase();
    // 如果前字符与后字符不等，则返回false
    if (pre !== last) return false;
  }
  return true;
}