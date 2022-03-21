/**
 * 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let first = l1;
  let second = l2;
  let carry = 0;
  // 最终返回链表
  let result = null;
  // 临时链表
  let temp = null;
  while (first || second) {
    // 将 l1 和 l2 两条链表当作同样长度，长度不够是，链表节点值置为 0
    const val1 = first ? first.val : 0;
    const val2 = second ? second.val : 0;
    const num = val1 + val2 + carry;
    // !result 表示 result 不存在，则创建一个链表，val值为 num%10 
    if (!result) {
      result = temp = new ListNode(num % 10)
    } else {
      // 表示已经存在初始节点，创建下一个节点
      temp.next = new ListNode(num % 10)
      // 临时节点赋值下一个节点
      temp = temp.next
    }
    // 获取 进位 10位进1
    carry = Math.floor(num / 10)
    if (first) {
      first = first.next;
    }
    if (second) {
      second = second.next
    }
  }
  // 当l1、l2 遍历完了，但是还存在进位，则创建下一个节点存储进位值
  if (carry) {
    temp.next = new ListNode(carry)
  }
  return result
};
