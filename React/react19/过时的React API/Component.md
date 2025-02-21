# Component

Component 一个 JavaScript 类

1. Component
2. context
3. props
4. state
5. constructor(props)
6. componentDidCatch(error, info)
7. componentDidMount()
8. componentDidUpdate(prevProps, prevState, snapshot?)
9. componentWillMount()
10. componentWillReceiveProps(nextProps)
11. componentWillUpdate(nextProps, nextState)
12. componentWillUnmount()
13. forceUpdate(cb?)
14. getSnapshotBeforeUpdate(prevProps, prevState)
15. render()
16. shouldComponentUpdate(nextProps, nextState, nextContext)
17. static contextType
18. static defaultProps
19. static getDerivedStateFromError(error)
20. static getDerivedStateFromProps(props, state)

## context

类组件可以通过 `this.context` 访问 context, 但是只有使用 `static contextType` 指定后才有效

一次只能指定一个 context

```ts
class Button extends Component{
  static contextType = themeContext
  render(){
    const theme = this.context
    ...
    return <div></div>
  }
}
```

## constructor(props)

constructor 会在组件挂载之前执行。一般仅用于 `声明 state`、`绑定类方法`

## componentDidCatch(error, info)

定义了 `componentDidCatch` React 将在某些子组件（包括后代组件）在渲染过程中抛出的错误时调用它，一般来说，`componentDidCatch`与`static getDerivedStateFromError` 一起使用，这样就允许你更新 state 来响应错误并向用户显示错误消息

同时具有 `componentDidCatch`与 `static getDerivedStateFromError` 的组件被称为 `错误边界`

* 注意：在函数组件中没有与 `componentDidCatch`、`static getDerivedStateFromError` 作用完全一样的方法，`错误边界` 只能使用`类组件`创建，或者使用 `react-error-boundary` 包。

## componentDidMount()

React 将在组件被挂载后调用。这里是设置数据获取、订阅监听事件或者操作 DOM 节点的常见位置

## componentDidUpdate(prevProps, prevState, snapshot?) 

React 会在组件更新 `props`或者`state`后，立即调用。`这个方法不会在首次渲染调用`

## componentWillMount() 

`已弃用`

## componentWillReceiveProps(nextProps) 

`已弃用`

## componentWillUpdate(nextProps, nextState) 

`已弃用`

## componentWillUnmount() 

React 会在组件卸载之前调用。常用于取消数据获取、移除事件监听

## forceUpdate(callback?)

强制组件渲染

* 注意：如果调用了 `forceUpdate`,React 将重新渲染而且不会调用 `shouldComponentUpdate`

## getSnapshotBeforeUpdate(prevProps, prevState) 函数组件还没有与之相同的方法，只能使用类组件

React 会在更新 DOM 之前直接调用它。使你的组件能够在 DOM 发生更改之前捕获一些信息（例如滚动位置）。`此方法返回的任意值都会作为 componentDidUpdate 的第三个参数`

## render()

类组件唯一必需的方法。返回渲染内容

## shouldComponentUpdate(nextProps, nextState, nextContext) 

判断是否可以跳过渲染。返回 `true` 重新渲染，返回 `false` 跳过渲染。

仅作为性能优化，`PureComponent` 实现了它，会浅比较 props 和 state,以减少错过必要更新的概率

## static contextType 类似于 useContext

在类组件中使用 context,则必须指定它需要读取哪个 context。同时必须是由 `createContext` 创建的值

## static defaultProps

用于设置默认的 props。它们将在 props 为 `undefined` 或者缺少时生效，为 `null` 时无效

## static getDerivedStateFromError(error) 

与 `componentDidCatch` 一起使用，称为`错误边界`。告诉组件显示错误消息的 state

## static getDerivedStateFromProps(props, state) 

React 会在初始挂载和后续更新时调用 `render` 之前调用它。它应该返回一个对象来更新 state, 或者返回 null 不更新任何内容
