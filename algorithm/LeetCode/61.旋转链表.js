// https://leetcode-cn.com/problems/rotate-list/solution/xuan-zhuan-lian-biao-li-yong-huan-lian-b-0dpz/

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function (head, k) {
  /**
   * 方法一：
    将head 节点 分为 两部分
    第一部分，是 节点需要向后移动的节点部分
    第二部分，是节点需要向前移动的节点部分，
    最后 将 第二部分的节点，拼接在 第一部分节点的前面
   */
  // 获取节点长度
  const len = getLen(head);
  // 获取节点需要移动的位置数，k 可能会大于 节点的总长度。
  // 例如 如果 k 与节点长度相同，即使节点移动了，最后得到的节点仍然与未移动前的节点相同，相当于没有移动
  let move = len - k % len;
  if (move === 0) return head;
  let node = head;
  // 用来保存需要向后移动的节点 ，也就是第一部分节点
  let tempN = new ListNode();
  let temp = tempN;
  while (move) {
    temp.next = node;
    temp = temp.next;
    node = node.next;
    move--;
    // 当 move 移动完后，将 第一部分的节点尾部置为 null
    if (move === 0) {
      temp.next = null
    }
  }
  // 用来保存 需要向前移动的节点，也就是第二部分
  let resN = new ListNode();
  let res = resN;
  while (node) {
    // 当下一个节点为 null 时，表示该节点已经是最后一个节点了
    if (node.next == null) {
      res.next = node;
      res = res.next;
      res.next = tempN.next;
      return resN.next;
    }
    res.next = node;
    res = res.next;
    node = node.next;
  }
  return tempN.next;
};
// 获取 节点长度
function getLen(head) {
  let len = 0;
  let node = head;
  while (node) {
    len++;
    node = node.next;
  }
  return len;
}
