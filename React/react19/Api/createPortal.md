# createPortal

createPortal 允许你将 JSX 作为 children 渲染至 DOM 的不同部分

* createPortal(children, domNode, key?)

主要实现

```ts
// 返回一个 Portal React 节点
export function createPortal(
  children: ReactNodeList,
  container: Element | DocumentFragment,
  key: ?string = null,
): ReactPortal {
  return {
    // 这个特殊的 $$typeof 标记表明这是一个 Portal
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : String(key),
    children,
    containerInfo: container,
    // 这些字段用于保持与其他 React 元素类型的一致性
    implementation: null
  };
}
```

* Portal 的渲染过程主要在 Reconciler 中处理

```ts
function updatePortalComponent(
  current: Fiber|null,
  workInProgress: Fiber,
  renderLanes: Lanes
){
  // 1. 获取 portal 的目标容器
  const nextChildren= workInProgress.pendingProps.children
  const containerInfo= workInProgress.stateNode.containerInfo
  
  // 2. 递归处理子节点
  reconcileChildren(
    current,
    workInProgress,
    nextChildren,
    containerInfo
  )

  // 3. 将子节点挂载到目标节点
  appendAllChildren(containerInfo, workInProgress)
}
```
