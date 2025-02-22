# useId

`useId` 可以生成传递给无障碍属性的唯一 ID

`const id = useId()`

## 挂载阶段

```ts
function mountId(): string {
  // 获取当前 hook
  const hook = mountWorkInProgressHook();
  // 获取当前 组件根节点
  const root = ((getWorkInProgressRoot(): any): FiberRoot);
  const identifierPrefix = root.identifierPrefix;
  let id;
  // 服务器渲染(SSR)
  if (getIsHydrating()) {
    const treeId = getTreeId();
    id = ':' + identifierPrefix + 'R' + treeId;

    const localId = localIdCounter++;
    if (localId > 0) {
      id += 'H' + localId.toString(32);
    }

    id += ':';
  } else {
    const globalClientId = globalClientIdCounter++;
    id = ':' + identifierPrefix + 'r' + globalClientId.toString(32) + ':';
  }
  // 将生成的 id 保存到 hook.memoizedState，保证每个组件在整个生命周期内保持一致
  hook.memoizedState = id;
  return id;
}
```

## 更新阶段

```ts
function updateId(): string {
  // 获取当前 hook
  const hook = updateWorkInProgressHook();
  // 从 hook 中获取保存的 id,保证组件 id 唯一
  const id: string = hook.memoizedState;
  return id;
}
```
