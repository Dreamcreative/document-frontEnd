# React 优化手段

## `React.PureComponent`

> 纯组件，会浅比较 state 和 props，来控制节点的渲染。与 `React.Component`的区别在与，纯组件新增了一个 `shouldComponentUpdate()` 周期判断 state/props 是否有变化

## React.memo(Component, props)

> `React.PureComponent`类似，会浅比较 props,只有当 props 变化时，才会重新渲染 Component 

## useMemo(callback, deps)

> 会执行传入的函数，缓存函数返回的值，只有当 deps 依赖变化时，才会重新更新缓存值

## useCallback(callback, deps)

> 将传入的函数直接缓存起来，只有当 deps 依赖变化时，才会改变缓存函数

## React.lazy()

> 允许动态加载组件。`const SomeComponent = React.lazy(()=> import('./SomeComponent'))`

> 与 `React.Suspense()` 组合使用，可以在动态加载组件未加载完全时，展示 Loading 状态

## 添加 key 属性

> React 在进行 `DOM DIFF`时，通过 key 属性来判断节点是否可以复用，来减少渲染代价
