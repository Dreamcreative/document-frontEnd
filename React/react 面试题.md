# React 面试题

## 类组件和函数组件区别

  1. 语法上

```js
// 函数组件
// 接收一个 props ,返回一个 react 元素
import React from 'react'
const Welcome = (props) => {
  return <h1>welcome, {props.name}</h1>
}
export default Welcome
```

```js
// 类组件
// 继承自 React.Component，具有 render 方法，render 方法返回一个 react 元素
import React from 'react'
class Welcome extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <h1>welcome, {this.props.name}</h1>
  }
}

export default Welcome
```

  2. 状态管理

    > 函数组件: `React v16.8`之前，函数组件是一个纯函数，只是单纯的进行 UI 展示，无法进行状态管理，称为 `无状态组件`

    > 函数组件: `React v16.8`之后，`hooks` 出现，函数组件就可以管理自己的 state 状态

    > 类组件，继承自 `React.component`,可以进行自身的状态管理

  3. 生命周期钩子函数

    > 函数组件: `React v16.8`之后,可以在函数组件中使用 hooks 来代替类组件中的生命周期钩子函数

    > 类组件: 由于类组件是继承自 `React.Component`类，类上具有组件从挂载到卸载一整个完整生命周期的生命周期钩子函数。所以类组件可以使用生命周期钩子函数

  4. 设计思想层面

    > 类组件的根基是 `OOP(面向对象编程)`,所以它有继承、有属性、有内部状态的管理

    > 函数组件的根基是`FP(函数式编程)`,

  5. 发展趋势

    > 函数组件更契合 React 框架的设计理念

    > React 组件的定位就是函数，一个接收数据，产生 UI 的函数。意味着 React 的数据应该和 UI 紧紧的绑定在一起，而类组件做不到这一点

## setState 和 useState

  1. 用法不同

    * useState: `const [name, setName] = useState('名称')`,`const [name, setName] = useState(()=> '名称')`
    * setState: `setState({})`,`setState((state)=> state)`,`setState({}, ()=>{})`
  
  2. setState 和 useState 是同步还是异步

    * 在 React 合成事件中，setState 和 useState 都是异步执行
    * 在 原生事件中 ，setState 和 useState 都是同步执行。因为合成事件是被 React 重写过，React 可以控制执行，而原生事件，React 无法控制
    * 在合成事件中，多次执行 setState，会被合并更新，而 setState 不会被合并

## 参考

* [React-函数组件和类组件](https://juejin.cn/post/6944312020825014302)
* [React设计模式和最佳实践总结](https://blog.poetries.top/2019/08/10/react-good-practice/)