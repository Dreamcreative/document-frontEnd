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
var deleteDuplicates = function (head) {
  /**
    节点是已排序的节点，返回没用重复的节点
    所以 第一个节点也有可能被删除
    遍历节点，当 当前节点与下一个节点的值不相等时，
   */
  if (!head) return head;
  let result = new ListNode(0, head);
  let temp = result;
  while (temp.next && temp.next.next) {
    // 如果 当前节点与下一个节点的值相等，
    if (temp.next.val === temp.next.next.val) {
      // 获取当前节点的值
      const val = temp.next.val;
      // 如果当前节点存在，并且当前节点的值 等于当前节点的下一个节点
      while (temp.next && temp.next.val === val) {
        // 将 当前节点的下一个节点指向 下下个节点
        // 这一步是为了去除 与 val 值相同的节点
        temp.next = temp.next.next;
      }
    } else {
      // 如果当前节点与下一个节点的值不等，则 将 temp 节点设置为 已去重的 节点
      temp = temp.next;
    }
  }
  return result.next;
};
