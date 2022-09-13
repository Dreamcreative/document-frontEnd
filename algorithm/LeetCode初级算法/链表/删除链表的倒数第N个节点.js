// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  /**
  一 
  快慢双指针
  快指针先 走 n 步，
  之后，快慢指针同步走，
  当 快指针走到尾节点时，
  慢指针正好走到了 需要删除的节点
   */
  // let preNode = head;
  // let nextNode = head;
  // for (let i = 0; i < n; i++) {
  //   preNode = preNode.next;
  // }
  // if (preNode == null) return head.next;
  // while (preNode.next !== null) {
  //   preNode = preNode.next;
  //   nextNode = nextNode.next;
  // }
  // nextNode.next = nextNode.next.next
  // return head

  /**
  二
  1. 先获取节点的总长度
  2. 通过 节点总长度 len和 n ，得到需要删除节点所在 链表的位置
   */
  let length = 0;
  let node = head;
  while (node !== null) {
    length += 1;
    node = node.next;
  }
  let len = length - n;
  if (len === 0) return head.next;
  node = head;
  while (true) {
    if (len === 1) {
      node.next = node.next.next;
      return head;
    }
    node = node.next;
    len--;
  }
};
