# React 触发更新的几种方式

## class 类组件

1. `ReactDOM.render()`:页面第一次挂载时
2. `this.setState()`:手动触发 state 更新
3. `this.forceUpdate()`:强制更新

## React hooks

1. `const [value, setValue] = useState(0)`,通过调用 setValue() 传入新的值，可以触发 render
