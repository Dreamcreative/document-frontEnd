# nextTick(cb)

微任务，等待下一次 DOM 更新之前调用

## Vue3 中 nextTick 

1. 使用`Promise.then()`实现

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

## Vue2 中 nextTick 

Vue2 中 nextTick 实现的降级顺序

1. Promise 优先使用 （微任务）
2. MutationObserver (微任务)
3. setImmediate （宏任务）
4. setTimeout 最后方案 （宏任务）

```js
let timerFunc
if(typeof Promise !== 'undefined'){
  // 优先使用 Promise  (微任务)
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
}else if(typeof MutationObserver !== 'undefined'){
  // 如果不支持 Promise,尝试使用 MutationObserver (微任务)
  
}else if(typeof setImmediate !== 'undefined'){
  // 如果都不支持，降级到 setImmediate (宏任务),node 环境
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
}else {
  // 最后降级为 setTimeout (宏任务)
   timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```
