# React18更新内容

1. 自动批处理

  > 没有批处理的情况，默认情况下，Promise、setTimeout、本机事件处理程序或者任何其他事件内部的更新不会再 React 中批处理

  > 当使用批处理后，以上的 Promise、setTimeout、本机事件处理函数或任何其他事件内部的更新会进行批处理

```js
setTimeout(()=>{
  setCount(c=>c+1);
  setFlag(f=>!f);
  // 以上两个 set 方法会导致 React 渲染两次
},1000)
setTimeout(()=>{
  setCount(c=>c+1);
  setFlag(f=>!f);
  // 使用批处理后，以上两个 set 方法只会渲染一次
},1000)
```
2. 新的 API startTransition 

  > 过渡，用来区分紧急和非紧急更新

    * 紧急更新反映了直接交互，例如键入、单击、按下等
    * 转换更新 将 UI 从一个视图转换到另一个视图

3. 支持 Suspense 的流式服务器端渲染

  > Suspense 并发模式。是一种新的机制，可以同时渲染多个 UI，同时`渲染可中断`

4. 新的客户端和服务器渲染 API

  * 使用 `createRoot`来替换客户端渲染的方法`ReactDOM.render()`
  * 使用 `hydrateRoot`来替换服务端渲染的方法`ReactDOM.hydrate()`

5. 新的严格模式

6. 新的 hooks

  * useId：用于在客户端和服务器上生成唯一 ID,同时避免 hydrate 不匹配。主要用于与需要唯一 ID 的可访问性 API 继承的组件库
  * useTransition：将一些状态更新标记为`不紧急`
  * useDeferredValue：可以推迟重新渲染树的非紧急部分，类似于去抖动。没有固定的时间延迟，因此 React 将在第一次渲染反映在屏幕后立即尝试延迟渲染，延迟渲染是可中断的，不会阻止用户交互
  * useSyncExternalStore：允许外部存储数据库通过强制对存储的更新同步来支持并发读取
  * useInsertionEffect：具有与 useEffect 相同的标识，但是会在 DOM 渲染前同步触发。但是由于 `useInsertionEffect` 的范围有限，因此无法访问 `refs`并且无法安排更新。主要用于 `CSS-in-JS 库`，一般的应用不建议使用

## 参考

* [React v18.0](https://reactjs.org/blog/2022/03/29/react-v18.html)
