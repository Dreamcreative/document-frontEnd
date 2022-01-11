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
// [1,2,4]
// [1,3,4]
var mergeTwoLists = function (l1, l2) {
  /**
   * 1 遍历方法
   */
  // 返回的链表
  // let result = new ListNode(0);
  // // temp 表示 result 的一个引用，
  // // temp 表示 result 链表的最后一个节点，每次遍历得到的小值节点都插入到最后一个节点
  // let temp = result;
  // while (l1 && l2) {
  //   // 将小值 放入到 temp.next
  //   if (l1.val <= l2.val) {
  //     temp.next = l1;
  //     // l1 后移
  //     l1 = l1.next
  //   } else {
  //     temp.next = l2;
  //     // l2 后移
  //     l2 = l2.next
  //   }
  //   // temp 指针后移
  //   temp = temp.next;
  // }
  // // 当其中一个链表遍历完后，将另一条链表剩余的节点插入到 result 链表的末尾
  // temp.next = l1 ? l1 : l2;
  // return result.next;

  /**
  2 递归方法
   */

  
};
