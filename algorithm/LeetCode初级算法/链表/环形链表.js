/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
  /***
  一 快慢指针
  快慢指针 快指针走2步，慢指针走一步，如果是环形链表，快慢指针总会相遇
  如果不是环形链表，当快指针先到达 链表尾部，
   */
  // //  快指针 
  // let fast = head?.next;
  // // 慢指针
  // let slow = head;
  // // 如果存在尾指针，返回false
  // if (!fast || slow) {
  //   return false
  // }
  // while (fast && slow) {
  //   // 当 fast === slow 时，表示慢指针赶上了快指针，存在环形链表
  //   if (fast === slow) return true;
  //   // 快指针走2步，需要判断快指针没有到达链表的尾部
  //   if (!fast?.next?.next) return false;
  //   fast = fast.next.next;
  //   // 慢指针走一步
  //   slow = slow.next;
  // }
  // return false;

  /**
  二 哈希表
  使用 Set集合存放 已遍历到的节点
  每次遍历 先查看 集合中是否存在当前节点
  已存在 则表示 链表是 环形
  不存在 则表示链表不是环形
   */
  // 定义集合存放已遍历节点
  let obj=new Set();
  let node = head;
  while(node){
    // 遍历链表
    // 查看 集合中是否存在当前节点，存在表示 链表是环形
    if(obj.has(node) )return true;
    // 向集合添加当前节点
    obj.add(node)
    // 节点指向下一个节点
    node = node.next;
  }
  return false;
};
