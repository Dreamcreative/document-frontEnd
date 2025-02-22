# useInsertionEffect

`useInsertionEffect` 可以在布局之前将元素插入到 DOM 中，主要是为 `CSS-in-JS` 库的作者特意打造的

## 注意

1. `useInsertionEffect` 是一个最早执行的 Effect,比 `useLayoutEffect`、`useEffect` 更早执行
2. 主要用于`样式注入`等 DOM 操作
3. 不支持异步
4. `useInsertionEffect` 会在 DOM 变更之前同步触发
5. 不能再这个 Hook 中范围 refs 或更新状态

## 挂载阶段

```ts
function mountInsertionEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  mountEffectImpl(UpdateEffect, HookInsertion, create, deps);
}

function mountEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  createDeps: Array<mixed> | void | null,
  update?: ((resource: {...} | void | null) => void) | void,
  updateDeps?: Array<mixed> | void | null,
  destroy?: ((resource: {...} | void | null) => void) | void,
): void {
  // 创建一个 hook
  const hook = mountWorkInProgressHook();
  const nextDeps = createDeps === undefined ? null : createDeps;
  // 设置 fiber 标记
  currentlyRenderingFiber.flags |= fiberFlags;
  // 创建 effect 并保存到 hook.memoizedState
  hook.memoizedState = pushSimpleEffect(
    HookHasEffect | hookFlags,
    createEffectInstance(),
    create,
    nextDeps,
  );
}

function pushSimpleEffect(
  tag: HookFlags,
  inst: EffectInstance,
  create: () => (() => void) | void,
  createDeps: Array<mixed> | void | null,
  update?: ((resource: {...} | void | null) => void) | void,
  updateDeps?: Array<mixed> | void | null,
  destroy?: ((resource: {...} | void | null) => void) | void,
): Effect {
  const effect: Effect = {
    tag,
    create,
    deps: createDeps,
    inst,
    // Circular
    next: (null: any),
  };
  return pushEffectImpl(effect);
}

function pushEffectImpl(effect: Effect): Effect {
  // 获取更新队列
  let componentUpdateQueue: null | FunctionComponentUpdateQueue =
    (currentlyRenderingFiber.updateQueue: any);
  if (componentUpdateQueue === null) {
    // 如果更新队列为空，创建
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue: any);
  }
  // 获取 最后一个 effect
  const lastEffect = componentUpdateQueue.lastEffect;
  if (lastEffect === null) {
    // 如果最后一个 effect 为空 表示当前是第一个effect，
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    // 如果存在最后一个effect，将当前 effect 插入到链表的末尾，并更新 lastEffect 指针
    const firstEffect = lastEffect.next;
    lastEffect.next = effect;
    effect.next = firstEffect;
    componentUpdateQueue.lastEffect = effect;
  }
  return effect;
}
```

## 更新阶段

```ts
function mountEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  createDeps: Array<mixed> | void | null,
  update?: ((resource: {...} | void | null) => void) | void,
  updateDeps?: Array<mixed> | void | null,
  destroy?: ((resource: {...} | void | null) => void) | void,
): void {
  // 获取当前hook
  const hook = mountWorkInProgressHook();
  // 获取依赖数组
  const nextDeps = createDeps === undefined ? null : createDeps;
  // 设置fiber 标记
  currentlyRenderingFiber.flags |= fiberFlags;
  // 获取 effect
  hook.memoizedState = pushSimpleEffect(
    HookHasEffect | hookFlags,
    createEffectInstance(),
    create,
    nextDeps,
  );
}
function updateEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  // 获取 hook
  const hook = updateWorkInProgressHook();
  // 获取依赖数组
  const nextDeps = deps === undefined ? null : deps;
  // 获取 effect
  const effect: Effect = hook.memoizedState;
  const inst = effect.inst;
  // 如果currentHook 存在（不是初始挂载时的重新渲染）
  if (currentHook !== null) {
    if (nextDeps !== null) {
      const prevEffect: Effect = currentHook.memoizedState;
      const prevDeps = prevEffect.deps;
      // 依赖变化 重新获取 effect
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushSimpleEffect(
          hookFlags,
          inst,
          create,
          nextDeps,
        );
        return;
      }
    }
  }
  
  currentlyRenderingFiber.flags |= fiberFlags;
  
  hook.memoizedState = pushSimpleEffect(
    HookHasEffect | hookFlags,
    inst,
    create,
    nextDeps,
  );
}
```
