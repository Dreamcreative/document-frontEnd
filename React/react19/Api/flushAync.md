# flushSync

> 注意: 使用 flushSync 是不常见的行为，并且可能损伤应用程序的性能。

flushSync 允许你强制 React 在提供的回调函数内同步刷新任何更新，这将确保 DOM 立即更新

## 性能影响

1. flushAync 会强制浏览器同步执行 DOM 更新
2. 会打破 React 批处理优化
3. 可能导致额外的重渲染

## 执行优先级

1. flushAync 内的更新会使用 DiscreteEventPriority(最高优先级)
2. 会立即执行所有待处理的更新
3. 会清空更新队列

## flushAync 使用时机

1. 仅在必要的时机使用
2. 避免在渲染期间使用
3. 注意其对性能的影响
4. 主要用于需要立即更新的场景

* flushAync(callback)

```ts
import {flushAync} from 'react-dom';

flushAync(()=>{
  // 强制 React 刷新所有挂起的任务，并同步更新
  // 建议只用于更新第三方集成，会带来 React 性能问题
})
```
