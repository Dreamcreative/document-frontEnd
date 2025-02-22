# useDeferredValue

useDeferredValue 可以让你延迟更新 UI 的某些部分

`隐藏树`: 是指被 `Suspense` 组件或 `Offscreen` 组件隐藏的 React 组件

`Offscreen(离屏渲染)`: 在视觉上隐藏UI，但将其内容降级优先级 

## 应用

1. 延迟非紧急更新
2. 在紧急更新时使用旧值
3. 在合适时机应用新值
4. 处理隐藏树的特殊情况

## useDeferredValue(value, initialValue?)

1. value: 需要延迟的值
2. 可选 initialValue: 组件初始渲染使用的值，如果省略，useDeferredValue 在初始渲染时不会延迟，因为没有可以延迟的值

## 挂载阶段

```ts
function mountDeferredValue<T>(value: T, initialValue?: T): T {
  const hook = mountWorkInProgressHook();
  return mountDeferredValueImpl(hook, value, initialValue);
}
function mountDeferredValueImpl<T>(hook: Hook, value: T, initialValue?: T): T {
  // 当提供了 initialValue 且当前渲染不包含 DeferredLane 时
  if (
    initialValue !== undefined &&
    !includesSomeLane(renderLanes, DeferredLane)
  ) {
    // 使用初始值进行渲染
    hook.memoizedState = initialValue;
    // 安排一个延迟渲染切换到最终值
    const deferredLane = requestDeferredLane();
    currentlyRenderingFiber.lanes = mergeLanes(
      currentlyRenderingFiber.lanes,
      deferredLane,
    );
    markSkippedUpdateLanes(deferredLane);

    return initialValue;
  } else {
    // 没有设置初始值，直接使用当前值
    hook.memoizedState = value;
    return value;
  }
}
```

## 更新阶段

```ts
function updateDeferredValueImpl<T>(
  hook: Hook,
  prevValue: T,
  value: T,
  initialValue?: T,
): T {
  // 通过 Object.is 比较当前值与延迟值是否相等
  if (is(value, prevValue)) {
    // 相等则直接返回当前值
    return value;
  } else {
    // 检查是否在隐藏的树中
    if (isCurrentTreeHidden()) {
      // 如果在隐藏树中，重用挂载逻辑
      const resultValue = mountDeferredValueImpl(hook, value, initialValue);
      if (!is(resultValue, prevValue)) {
        markWorkInProgressReceivedUpdate();
      }
      return resultValue;
    }
    // 检查是否需要延迟更新
    const shouldDeferValue = !includesOnlyNonUrgentLanes(renderLanes);
    if (shouldDeferValue) {
      // 如果是一个紧急更新，继续使用旧值并安排延迟渲染来更新
      const deferredLane = requestDeferredLane();
      currentlyRenderingFiber.lanes = mergeLanes(
        currentlyRenderingFiber.lanes,
        deferredLane,
      );
      markSkippedUpdateLanes(deferredLane);
      return prevValue;
    } else {
      // 如果不是紧急更新，直接使用新值
      markWorkInProgressReceivedUpdate();
      hook.memoizedState = value;
      return value;
    }
  }
}
```
