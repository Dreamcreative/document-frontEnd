/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function (head) {
  /**
   * 一 遍历方法
    遍历链表，将每个节点的val 放入数组中，
    最终通过比较 vals 和 vals.reverse() 数组翻转值 ，
   */
  // // 存放节点值的 数组
  // let vals = [];
  // let node = head;
  // while (node) {
  //   // 将节点的值压入 数组中
  //   vals.push(node.val);
  //   node = node.next;
  // }
  // // 比较 vals 和 翻转后的 valus 是否相等
  // return vals.toString() === vals.reverse().toString() ? true : false;

  /**
    二 快慢指针
   */
  let len = 0;
  let node = head;
  // 获取当前节点的长度
  while (node) {
    len++;
    node = node.next;
  }
  // 当前节点长度的一半
  let mid = Math.floor(len / 2);
  let pre = head;
  // 后半部分节点
  let nextPart = null;
  // 前半部分节点
  let firstPart = new ListNode();
  let tempFirst = firstPart;
  let cur = 0;
  while (pre) {
    // 遍历，当节点遍历到一半时，得到当前节点的，前半部分和后半部分节点
    if (cur === mid) {
      nextPart = pre;
      break;
    }
    tempFirst.next = pre;
    tempFirst = pre;
    pre = pre.next;
    cur++;
  }
  // 翻转后半部分节点
  let revList = reverseList(nextPart);
  let tempRev = revList;
  let tempPre = firstPart.next;
  // 翻转后的后半部分节点 与 前半部分节点，依次对比 val值，不相等，直接返回 false
  // 比如，单总节点长度为13时， 中点为6 ，前半部分节点[1,2,3,4,5,6] 后半部分节点[7,6,5,4,3,2,1]
  // 判断条件为 前节点存在且后节点存在，当前节点 为 null 时，表示后节点还剩一个，表示真正的 链表中心节点，不需要再比对
  while (tempRev && tempPre) {
    if (tempPre.val !== tempRev.val) return false;
    tempRev = tempRev.next;
    tempPre = tempPre.next;
  }
  return true;
};
// 翻转链表
var reverseList = function (head) {
  let node = head;
  let prev = null;
  while (node) {
    const next = node.next;
    node.next = prev;
    prev = node;
    node = next;
  }
  return prev;
};
