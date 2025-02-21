# React.StrictMode

> StrictMode 是一个用来突出显示应用程序中潜在问题的工具。与 `<Fragment>`一样，`<StrictMode>`不会渲染任何可见的 UI。只是为其后代元素触发额外的检查和警告

- `注意：<StrictMode>`检查仅在开发模式下运行，不会影响生产构建

* `<StrictMode>` 多次`(一般为两次)`调用以下函数来进行检测

1. class 组件的 constructor、render 以及 shouldComponentUpdate 方法
2. class 组件的生命周期方法 getDerivedStateFromProps
3. 函数组件体
4. 状态更新函数(setState 的第一个参数)
5. 函数组件通过使用 useState、useMemo、或者 useReducer

## `<StrictMode>` 检查范围

1. 识别不安全的生命周期

   1. componentWillMount
   2. componentWillUpdate
   3. componentWillReceiveProps

2. 关于使用过时的 `ref API` 的警告

> `ref API` 使用方式

- `ref string`: 已被废弃 [存在的一些问题](https://github.com/facebook/react/pull/8333#issuecomment-271648615)

1. 查找效率低
   1. 字符串 ref 需要 React 维护一个 refs 注册表
   2. 每次更新都需要遍历查找，性能开销大
   3. 无法进行编译优化
2. 内存占用
3. 无法进行静态分析
   1. 字符串 ref 难以进行代码检查
   2. 重构工具无法可靠的重命名
   3. TypeScript 类型检查受限
4. 可能得命名冲突

```js
<Input ref='inputRef' />
```

- `React.createRef()`

```js
this.inputRef = React.createRef();
<Input ref={this.inputRef} />;
```

- `回调 ref`

```js
<Input ref={el => (this.inputRef = el)} />
```

1.  关于使用废弃的 `findDOMNode`方法警告

- `React.findDOMNode` 可以用来查找 DOM 节点，但在`<StrictMode>` 严格模式下，不推荐这样做。并且在严格模式下弃用了该方法。
- `React.findDOMNode` 的使用可能打破封装性
- 推荐使用 `ref API` 来获取节点

4.  检测意外的副作用
5.  检测过时的 `context API`
6.  确保可复用的状态

## 参考

- [严格模式 v18.2.0](https://zh-hans.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
