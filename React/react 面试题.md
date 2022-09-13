# React 面试题

## 类组件和函数组件区别

1. 语法上

```js
// 函数组件
// 接收一个 props ,返回一个 react 元素
import React from 'react';
const Welcome = props => {
  return <h1>welcome, {props.name}</h1>;
};
export default Welcome;
```

```js
// 类组件
// 继承自 React.Component，具有 render 方法，render 方法返回一个 react 元素
import React from 'react';
class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <h1>welcome, {this.props.name}</h1>;
  }
}

export default Welcome;
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

   - useState: `const [name, setName] = useState('名称')`,`const [name, setName] = useState(()=> '名称')`
   - setState: `setState({})`,`setState((state)=> state)`,`setState({}, ()=>{})`

2. setState 和 useState 是同步还是异步

   - 在 React 合成事件中，setState 和 useState 都是异步执行
   - 在 原生事件中 ，setState 和 useState 都是同步执行。因为合成事件是被 React 重写过，React 可以控制执行，而原生事件，React 无法控制
   - 在合成事件中，多次执行 setState，会被合并更新，而 useState 不会被合并
   - 在 legecy 模式下，setstate 同步异步都有，在 concurrent 模式下都为异步

## React 设计模式

1. 组合模式 类似于 Vue2 中的插槽功能

> 组合模式适合一些容器组件场景，通过外层组件包裹内层组件。外层组件可以获取内层组件的属性和监听方法，还可以控制内层组件的渲染

```js
// 组合模式 - 例子
<Tabs onChange={type => console.log(type)}>
  <TabItem name='react' label='react'>
    React
  </TabItem>
  <TabItem name='vue' label='vue'>
    Vue
  </TabItem>
  <TabItem name='angular' label='angular'>
    Angular
  </TabItem>
</Tabs>
```

1. 隐式混入 props

```js
<Tabs>
  <TabItem name='react' label='react'></TabItem>
</Tabs>;

function TabItem(props) {
  console.log(props); // {name: "《React进阶实践指南》", author: "xxx"}
  return <div> 名称： {props.name} </div>;
}
function Tabs(props) {
  console.log(props.children); // Tabs 的子节点
  // 这里需要使用 cloneElement 根据子节点克隆一个新的节点，然后传入属性，传入的属性会与克隆的目标节点原先的属性进行合并
  // 无法直接对 props.children 的属性进行修改，因为 React 对 react 元素的属性进行了保护
  const newChild = React.cloneElement(props.children, { author: 'xxx' });
  return newChild;
}
```

2. 控制渲染

```js
<Tabs>
  <TabItem isShow name='react' label='react'></TabItem>
  <TabItem isShow={false} name='react' label='react'></TabItem>
</Tabs>;

// 可以通过 React.Children 的方法，遍历子节点，控制输出想要展示的子节点
function Tabs(props) {
  const newChildren = [];
  React.Children.forEach(props.children, item => {
    const { type, props } = item || {};
    if (isValidElement(item) && type === Item && props.isShow) {
      newChildren.push(item);
    }
  });
  return newChildren;
}
```

3. 内外层通信

```js
function TabItem(props) {
  return (
    <div>
      名称：{props.name}
      <button onclick={() => props.callback('let us learn React!')}></button>
    </div>
  );
}
// 通过 React.cloneElement 克隆子组件时，向新生成的子组件传入回调，
function Tabs(props) {
  const handleCallback = val => console.log(' children 内容：', val);
  return <div>{React.cloneElement(props.children, { callback: handleCallback })}</div>;
}
```

4. ...

> 总结

- 组合模式通过外层组件`children`获取它的子组件，通过 cloneElement 传入新的状态，或者控制内层组件渲染
- 组合模式还可以和其他组件结合，或者是 `render props`模式，拓展性很强，实现的功能强大

![组合模式流程](/images/React/React-组合模式.webp)

2. render props 模式

> 组件中共享逻辑的一种技巧，把一些渲染逻辑以 prop 的形式传递给子组件

> `render props`的核心思想是：通过一个函数将组件内部的 state 传递给子组件

> 用法

```js
// Container 组件将自身的属性通过函数传递给子组件
// Children 子组件通过函数返回的 props 可以获取父组件中的 state
function App() {
  const aProps = {
    name: '《React进阶实践指南》'
  };
  return <Container>{cProps => <Children {...cProps} {...aProps} />}</Container>;
}

// 外层组件控制内层子组件的简单实现
function Container(props) {
  const { children } = props;
  const rednerChildren = useMemo(() => {
    typeof children === 'function' ? children({ name: '《React进阶实践指南》' }) : null;
  }, [children]);
  return <div>{rednerChildren}</div>;
}
```

![render props 模式流程](/images/React/React-render_props模式.webp)

3. hoc 模式

> 解决的问题：需要复用公用逻辑

> hoc 高阶组件，一个函数，传入一个组件，返回一个组件，对返回的组件进行一系列的功能增强

> hoc 不会修改传入的组件，也不会使用继承来复制其行为。相反，hoc 通过将组件包装在容器组件中，来组成新组件。`hoc 是纯组件，没有副作用`

> 约定

1. 不要改变原始组件，使用组合

   - 这样会破坏包裹组件的一些功能，导致不必要的冲突

2. 将需要的 props 传递给被包裹的组件

   - hoc 为组件添加新特性，自身不应该去改变包裹的组件。hoc 返回的组价应该具有与原组件相类似的接口

3. 最大化可组合性
4. 包装显示名称以便轻松调试

   - hoc 创建的容器组件跟其他组件一样，会显示在 `React Developer Tools`中，为了方便调试，需要显示一个名称 `displayName`，表明这个组件是 hoc 的产物

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {
    /* ... */
  }
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

> 注意事项

1. 不要在 render 方法使用 hoc

   - React DOM DIFF 会对变化的组件进行更新（增、删、改），可能会导致性能问题

2. 务必复制静态方法

   - 被 hoc 的容器组件包裹后，无法继承原组件本身的`静态方法/静态属性`,所以需要得 hoc 返回的组件做一些特殊处理，以便返回的组件具有原组件本身的`静态属性`

```js
import hoistNonReactStatic from 'hoist-non-react-statics';

function enhance(wrapppedComponent){
  class Enhance extends React.Component{...}
  // 将静态属性进行复制到 hoc 返回的组件
  hoistNonReactStatic(Enhance, wrapppedComponent);
  Enhance.displayName = 'enhance';
  return Enhance;
}
```

3. Refs 不会被传递

   - 虽然 hoc 约定将所用 props 传递给原组件，但是这对 `refs` 并不适用。因为 `refs` 实际上并不是一个 props 。像 `key` 一样，React 会对其进行特殊处理。
   - 无法传递 `refs` 在 `React v16.3` 中提供了一个解决方案，使用`React.forwardRef` API。

> React 其他复用代码的方式

> > 在之前，React 是使用 mixins（混入），来实现组件的代码复用，但是在使用 mixins 时，会导致一些问题，使得 React 弃用了这种方案。重新提出了 HOC (高阶组件)的方案

1. mixins 引入了隐式依赖

   - 当组件使用多个 mixins ,一层层的 mixins 的引用，最后你会不知道，删除或修改其中一个 mixins，会不会导致其他 mixins 是否失效，因为其他 mixins 可能引用了其他 mixins 的一些代码

2. mixins 导致名称冲突

   - 当组件使用多个 mixins ，相同的方法/属性名，会被覆盖掉，

3. mixins 导致滚雪球般的复杂性

   - 当组件使用多个 mixins，由于嵌套较深，我们会没有办法定位到错误

![render hoc 模式流程](/images/React/React-hoc模式.webp)

4. 提供者模式 `React v16.3.0`之后

> 就是 `const context = {Provider, Consumer} = React.createContext()`，拥有两个角色 `提供者 Provider`、`消费者 Consumer`

> 他提供了 React 由顶层提供属性，底层消费属性的能力 - `无论底层组件被嵌套了多少层`

> `React v16.3.0` 之后的提供者模式

```js
const Context = React.createContext();
function App() {
  const state = { name: 'xxx' };
  return (
    <Context.Provider value={state}>
      <Children />
    </Context.Provider>
  );
}
function Children(props) {
  return (
    <Context.Consumer>
      {state => {
        const { name } = state;
        return <P>{name}</P>;
      }}
    </Context.Consumer>
  );
}
```

![render 提供者模式流程](/images/React/React-提供者模式.webp)

5. 类组件模式

> `React 有十分强大的组合模式。我们推荐使用组合模式而非继承来实现组件间的代码重用` - React

> 在 class 类组件盛行时，我们可以通过继承的方式进一步强化我们的组件。这种模式的好处是，`可以封装基础功能组件，然后根据需要去 extends 它们`

```js
// 例子

// Test 组件继承自 React.Component 组件，使得 Test 具有了 React.Component 组件的一些基础功能，例如 生命周期 、 render 方法 等等
class Test extends React.Component{...}
```

![render 类组件模式流程](/images/React/React-类组件模式.webp)

## 参考

- [React-函数组件和类组件](https://juejin.cn/post/6944312020825014302)
- [React 设计模式和最佳实践总结](https://blog.poetries.top/2019/08/10/react-good-practice/)
- [「React 进阶」 学好这些 React 设计模式，能让你的 React 项目飞起来](https://jishuin.proginn.com/p/763bfbd66c7f)
- [Render Props](https://zh-hans.reactjs.org/docs/render-props.html)
- [React 中的 Render Props](https://zhuanlan.zhihu.com/p/31267131)
- [高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)
- [Mixins 被认为是有害的](https://zh-hans.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)
- [组合 vs 继承](https://zh-hans.reactjs.org/docs/composition-vs-inheritance.html)
