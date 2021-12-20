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

## 渲染错误边界 componentDidCatch / static getDerivedStateFromError

> 主要是两个生命周期函数

> 类组件中，只要有一下任意一个生命周期出现，那么这个类组件就是`错误边界组件`

> 错误边界组件可以阻止子组件渲染时报错

  1. static getDerivedStateFromError()：在出错后有机会修改 state 触发最后一次渲染
  2. componentDidCatch()：用于出错时副作用代码。会的带出错信息和堆栈

```js
class MyErrorBoundary extends Component {
  state={
    error: null
  }
  static getDerivedStateFromError(error){
    return {
      error: error
    }
  }
  componentDidCatch(err, stackInfo){
    // 错误上报
    logErrorToMyService(error, info);
  }
  render(){
    if(this.state.error){
      return <p>Something broke</p>;
    }
    return this.props.children;
  }
}
```

> [React 错误边界 官方文档](https://zh-hans.reactjs.org/docs/error-boundaries.html) 提到了四种无法 catch 错误的场景

  1. 回调事件。由于回调事件执行时机不再渲染周期内。所以无法被 `错误边界组件` catch 住，只能自行 catch
  2. 异步。比如`setTimeout`或`requestAnimationFrame`,和第一条同理
  3. 服务器渲染
  4. `错误边界组件`无法 catch 自身的错误。只能 catch 自身内部子组件的错误 ,无论是 类组件还是函数组件都能 catch 错误 
  5. 额外的，无法 catch `编译时的错误`。仅仅关注`运行时错误`

## 参考

* [精读《React Error Boundaries》](https://zhuanlan.zhihu.com/p/133632612)
* [错误边界](https://zh-hans.reactjs.org/docs/error-boundaries.html)