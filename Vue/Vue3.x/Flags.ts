/**
 * vue3 flags
 * PatchFlag DOM DIFF 标签
 * ShapeFlag 组件类型标签
 */
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

export const enum ShapeFlags {
  ELEMENT = 1, // 表示一个普通的HTML元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 有状态组件
  TEXT_CHILDREN = 1 << 3, // 子节点是文本
  ARRAY_CHILDREN = 1 << 4, // 子节点是数组
  SLOTS_CHILDREN = 1 << 5, // 子节点是插槽
  TELEPORT = 1 << 6, // 表示vnode描述的是个teleport组件
  SUSPENSE = 1 << 7, // 表示vnode描述的是个suspense组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 表示需要被keep-live的有状态组件
  COMPONENT_KEPT_ALIVE = 1 << 9, // 已经被keep-live的有状态组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 组件，有状态组件和函数式组件的统称
}
