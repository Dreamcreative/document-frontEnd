export const enum PatchFlag {
  // 需要进行 DOM DIFF 的标志
  // 动态文本节点
  TEXT = 1,
  // 动态 class
  CLASS = 1 << 1,
  // 动态style
  STYLE = 1 << 2,
  // 动态属性 不包括 class/style
  PROPS = 1 << 3,
  // 具有动态 key 属性，当key改变时，需要进行完整 DOM DIFF
  FULL_PROPS = 1 << 4,
  // 带有监听事件的节点
  HYDRATE_EVENTS = 1 << 5,
  // 一个不会改变子节点顺序的 fragment
  STABLE_FRAGMENT = 1 << 6,
  // 带有 key 的 fragment
  KEYED_FRAGMENT = 1 << 7,
  // 没有 key 的 fragment
  UNKEYED_FRAGMENT = 1 << 8,
  // 一个节点只会进行非 props 比较
  NEED_PATCH = 1 << 9,
  // 动态插槽
  DYNAMIC_SLOTS = 1 << 10,

  // DOM DIFF 会被跳过
  // 仅用于 开发的标志 在生产环境会被剥离
  DEV_ROOT_FRAGMENT = 1 << 11,
  // 静态节点 内容永远不会改变 不需要 DOM DIFF
  HOISTED = -1,
  // 表示 节点的 DOM DIFF 结束
  BAIL = -2
}
