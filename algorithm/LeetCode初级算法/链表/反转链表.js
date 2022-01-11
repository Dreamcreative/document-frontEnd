/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
/**
 * 遍历链表 [1,2,3,4,5]
  prev= null
  第一个节点 node1 的next = prev; prev = node1 = [1]
  第二个节点 node2 的next = prev; prev = node2 = [2,1]
  第二个节点 node3 的next = prev; prev = node3 = [3,2,1]
  ....
 */
var reverseList = function (head) {
  let prev = null;
  let node = head;
  while (node) {
    let cur = node.next;
    node.next = prev;
    prev = node;
    node = cur;
  }
  return prev;
};
