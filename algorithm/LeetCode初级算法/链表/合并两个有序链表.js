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
  l1 [1,2,3]
  l2 [1,3,4]

  1: l1.1.next = mergeTwoLists([2,3],[1,3,4])
  2: l2.1.next = mergeTwoLists([2,3],[3,4])
  3: l1.2.next = mergeTwoLists([3],[3,4])
  4: l1.3.next = mergeTwoLists([],[3,4])
  5: l2 = [3,4]

  最终返回的链表  l1.1.next = l2.1.next = l1.2.next = l1.3.next = l2
                    1         1           2           3         3,4
   */
  // l1 为空，返回l2
  if (!l1) return l2;
  // l2 为空 返回l1
  if (!l2) return l1;
  if (l1.val <= l2.val) {
    // 每次只需要知道当前自己的 next 指向，具有指向 由 mergeTwoLists() 返回
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l2.next, l1);
    return l2;
  }
};
