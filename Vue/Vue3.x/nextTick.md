# nextTick(cb)

微任务，等待下一次 DOM 更新之前调用。使用`Promise.then()`实现

```ts
// packages/runtime-core/src/scheduler.ts

function nextTick<T = void, R = void>(
  // 默认绑定为当前组件实例
  this: T,
  // 传入的回调函数
  fn?: (this: T) => R,
): Promise<Awaited<R>> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```
