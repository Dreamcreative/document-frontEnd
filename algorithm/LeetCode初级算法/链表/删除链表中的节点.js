// 请编写一个函数，用于 删除单链表中某个特定节点 。在设计函数时需要注意，你无法访问链表的头节点 head ，只能直接访问 要被删除的节点 。
// 题目数据保证需要删除的节点 不是末尾节点 。

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */

// 正常杀手需要找到A的把柄才可以杀掉A，
// 可现在找到A本人后竟然没有可以获取A把柄的途径
// A得知我们要杀他，心生一计，可助你完成任务
// A说我有B的把柄，你杀了B，我改头换面，以B的身份活着
// GC也会自动清理掉B的尸体，没人会知道的

var deleteNode = function (node) {
  node.val = node.next.val;
  node.next = node.next.next;
};
