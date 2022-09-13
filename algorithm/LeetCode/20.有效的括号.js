// https://leetcode.cn/problems/valid-parentheses/

/**
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。
  有效字符串需满足：
  左括号必须用相同类型的右括号闭合。
  左括号必须以正确的顺序闭合。

 */
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  /**
   * 通过栈的方式
   * 所以需要将 字符推入栈中进行字符对比，
   * 因为 括号要按顺序闭合，所以 栈尾的字符与当前对比的字符是一对时，将栈尾的字符抛出，
   * 否则将当前对比的字符继续压入栈
   */
  // 对应关系
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  // 栈
  const stack = [];
  for (let item of s) {
    // if (stack.length) {
    //   if (map[stack[stack.length - 1]] === item) {
    //     stack.pop()
    //   } else {
    //     stack.push(item)
    //   }
    // } else {
    //   stack.push(item)
    // }
    if (stack.length && map[stack[stack.length - 1]] === item) {
      // 如果栈中有值 并且 栈尾和当前的item 是同一种类型，将栈尾弹出
      stack.pop();
    } else {
      // 如果栈为空，或者 栈尾 和 当前值不是同一种类型，将当前 item 推入栈
      stack.push(item);
    }
  }
  // 最后，如果是栈，则表示 字符中的 括号都是一对的，
  // 如果栈不为空，则表示 字符中的括号 存在不按顺序闭合
  return !stack.length;
};
