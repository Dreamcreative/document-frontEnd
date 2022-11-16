1. react16 与 react17 生命周期

   > react 16： constructor componentWillReceiveStateFromProps render componentWillMount componentDidMount shouldComponentUpdate componentWillUpdate componentDidUpdate componentWillUnmount
   > react 17: constructor getDeservedStateFromProps getSnapShotFromProps render ComponentDidMount shouldComponentUpdate ComponentDidUpdate componentWillUnmount

2. react17 新增了什么内容

   > 17 没有新增新的功能，只是对原先的功能进行了优化，为了之后的一些新特性
   > 对合成事件，16 将事件代理在 document 节点，17 将组件事件代理在 页面根节点 Container 上 `ReactDOM.render(<App>, Container)`，为了微应用，因为微应用中，项目中具有多个应用，如果还是绑定在 document,会导致微应用的事件混乱。17 合成事件不再使用事件池

3. react 为什么新增 hooks ,解决了什么问题

   1. 逻辑复用：在 hooks 出现之前，react 可以使用 react.CreateContent(),HOC， renderProps 模式，但是这些方法都需要改变组件的结构。而 react 没有原生方法来实现逻辑复用。添加 hooks 之后，在不需要改变组件结构的情况下，将逻辑拆分成一个个小的纯函数，便于逻辑复用
   2. 解决复杂组件难以理解的问题：类组件，使用生命周期的方式使得，组件在什么情况下做什么事情，比如，一般在 componentDidMount,去调用接口，获取数据，但是同时也可能会添加一些事件绑定，这样使得各种不相关的逻辑代码混合在一起。可能导致意想不到的 bug 出现。而 hooks,使用函数将逻辑进行分离，而不是通过生命周期的方式进行归类，使得内部状态变得可预测
   3. 难以理解的 Class：使用类组件，就必须去理解 JavaScript 中 this 的指向问题，使得代码冗余。同时 class 也给目前的一些工具带来一些问题，1. class 不能被很好的压缩，2. class 在热更新时不是很稳定。而 hooks 是你在不使用 class 的情况可以使用更多的 react 特性。

4. react 合成事件

   > react 的目的是实现一个全平台的 ui 库，所以实现了一套自身的事件系统，来抹平不同浏览器的差异。事件的统一管理，统一初始化，统一分发，统一销毁

5. react 合成事件与原生事件有什么区别

   1. 写法上： 合成 `<button onClick={click}></button>`,原生`<button onclick="click"></button>`
   2. 阻止事件的默认行为：合成 只能显示调用`e.preventDefault()`，原生 `return false` /`e.preventDefault W3C`/`e.returnValue = false IE`
   3. 合成事件的执行顺序， react 使用事件代理的方式将组件事件代理在 `document React17之前`/`container React17 之后，`，当 react 事件被调用后，会向父节点冒泡，如果自身节点和父节点绑定了原生事件，会执行原生事件，，一直冒泡到根节点。再执行 react 事件

```js
class App extends React.Component {
  parentRef = null;
  childRef = null;
  constructor(props) {
    super(props);
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }
  componentDidMount() {
    console.log('React componentDidMount！');
    this.parentRef.current?.addEventListener('click', () => {
      console.log('原生事件：父元素 DOM 事件监听！');
    });
    this.childRef.current?.addEventListener('click', () => {
      console.log('原生事件：子元素 DOM 事件监听！');
    });
    document.addEventListener('click', e => {
      console.log('原生事件：document DOM 事件监听！');
    });
  }
  parentClickFn() {
    console.log('React 事件：父元素事件监听！');
  }
  childClickFn() {
    console.log('React 事件：子元素事件监听！');
  }
  render() {
    return (
      <div ref={this.parentRef} onClick={() => this.parentClickFun()}>
        <div ref={this.childRef} onClick={() => this.childClickFun()}>
          分析事件执行顺序
        </div>
      </div>
    );
  }
}

// 上面输出结果

// 原生事件：子元素 DOM 事件监听！
// 原生事件：父元素 DOM 事件监听！
// React 事件：子元素事件监听！
// React 事件：父元素事件监听！
// 原生事件：document DOM 事件监听！
```

6. react16 的合成事件与 react17 的 合成事件有什么区别

   1. 16 事件代理在 document 节点，使用了事件池的概念，当事件被调用时，从事件池中取出一个事件对象，当事件执行完成之后，再将事件对象返还给事件池。这样做的好处是，减少了事件对象的创建和释放，减少了所需的内存。但是同时也导致一个问题，当事件调用后，无法再次访问事件。但是可以通过手动调用`e.persist()`来缓存事件，一边事件的再次使用
   2. 17 事件代理在 Container 节点。取消了事件池的概念，解决了事件调用后，无法再次访问到的问题
   3. 17 中支持了原生捕获事件的支持，对齐了浏览器标准。同时`onScroll`事件不再进行冒泡，`onBlur/onFocus`，使用原生的 `foucein/foucsout`合成

7. useLayoutEffect 与 useEffect 区别

   1. useLayoutEffect 在 DOM 挂载之前同步执行，会阻塞 DOM 渲染。而 useEffect 在节点挂载完成后，异步调用，不会阻塞 DOM 渲染
   2. useLayoutEffect 和 useEffect 在 react 中执行时会被打上不同的 effectTag，导致，useLayoutEffect、useEffect 在 react 的 Renderer 阶段执行时机不同
   3. useLayoutEffect 用来代替 类组件中 componentWillMount /componentWillUpdate 因为 useLayoutEffect 的创建函数的调用时机与 这 2 个生命周期相同，切都是同步调用。useLayoutEffect 还用来代替 componentWillUnmount 因为 useLayoutEffect 的销毁函数与 这个生命周期的调用时机相同

8. hooks 下的 useEffect 和 classComponent 下的生命周期对应关系

   > useEffect(callback, deps) 是在组件挂载只会异步执行的，可以根据 useEffect 的 deps 是否存在来模拟 classComponent 的生命周期

   1. useEffect(callback,[]): 相当于 componentDidMount，当 `deps 为 []` 时，只在组件挂载完成后，执行一次
   2. useEffect(callback): 相当于 componentDidUpdate，当 deps 不存在时，每次更新都会执行
   3. `useEffect(()=>{ return ()=>{ console.log() }},[a,b])`: 当 useEffect 返回一个 cleanup 函数时，相当于 componentWillUnmount

9. useCallback(callback,deps) 和 useMemo(callback,deps) 有什么区别

   1. 都是用来缓存值的
   2. useCallback 用来缓存函数，，useCallback 在 mount 阶段，将 callback 直接进行存储，在 update 阶段当 deps 变化后,会再次将 callback 返回
   3. useMemo 用来缓存函数调用后返回的结果，mount 阶段会将调用 callback，将 callback 执行结果返回，update 阶段 当 deps 变化后，会再次调用 callback,将 callback 执行结果返回

```js
// useCallback mount
mountCallback(callback, deps){
    const hook = workInProgressHook();
    const nextDeps = deps === undefined?null:deps;
    hook.memoizedState = [callback, nextDeps];
    return callback;
}
// useCallback update
updateCallback(callback, deps){
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined? null: deps;
  const prevState = hook.memoizedState;
  if(prevState!==null){
    if(nextDeps!==null){
      const prevDeps = prevState[1];
      if(areHookInputsEqual(nextDeps, prevDeps)){
        return prevState[0];
      }
    }
  }
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
// useMemo mount
mountMemo(nextCreate, deps){
    // 获取当前hook
    const hook = mountInProgressHook();
    // 获取依赖，
    const nextDeps = deps===undefined?null:deps;
    // 执行传入的 函数，返回需要缓存的值
    const nextValue = nextCreate();
    hook.memoizedState = [nextValue,nextDeps];
    return nextValue;
}
// useMemo update
updateMemo(nextCreate, deps){
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined? null: deps;
  const prevState = hook.memoizedState;
  if(prevState !== null){
    if(nextDeps!==null){
      const prevDeps = prevState[1];
      if(areHookInputsEqual(nextDeps, prevDeps)){
        return prevState[0];
      }
    }
  }
  const nextValue = nextCrate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

9. state 和 props 区别

   1. props 是由父组件传入，子组件无法改变
   2. state 是组件内部维护的状态，会频繁的改变，使用 useState 调用，会异步更新

10. 类组件和函数组件有什么区别

    1. 类组件继承自 react.Component 类，，而类上挂载组件从挂载到卸载的生命周期函数，，所以类组件能够使用生命周期
    2. 类组件可以使用 state 进行组件内部状态的维护
    3. 函数组件在 react 16.8 之前被称为傻瓜组件，只能通过传入的 props 来进行 UI 展示，无法维护自身的状态，当 hooks 出现后，函数组件使用 hooks 来代替了类组件的生命周期，同时也能维护自身内部的状态
    4. 类组件必须有一个 render 方法，返回一个 jsx ,而函数组件不需要 render 方法，但是同时还是需要返回 jsx
    5. 函数组件更加贴合 React ,因为 react 组件的定位就是函数，接收数据返回 UI,意味着 react 的数据和 UI 紧紧的绑定在一起，这是类组件无法做到的

11. react.children 具有哪些方法，分别是用来干什么的

    1. forEach：遍历子节点
    2. map：遍历子节点
    3. count ：返回子节点数量
    4. only：验证只有一个子节点
    5. toArray：将子节点扁平化返回

12. react 开发模式有哪几种，分别有什么区别

    1. legacy: 默认模式，不支持新功能
    2. blocking: 默认模式和实验模式之间的模式，具有一部分 react 新特性
    3. concurrent: 实验模式，具有 react 最新的特性

13. setState 是同步还是异步

    1. 在 合成事件中 setState 是异步的 ，合成事件中 ，逻辑的执行受到 react 控制
    2. 原生事件中， setState 是同步的，原生事件中，逻辑执行不受 react 控制，例如 setTimeout 等定时器，el.addEventListener()
    3. 在 legacy 模式下，setState 同步异步都有，在 concurrent 模式下是异步的

14. setState 和 useState 的区别

    1. 写法上 setState({})/setState({},(state)=>{})/setState(()=>{})。`const [name,setName]=useState('111')/const [name,setName]=useState(()=>{return '1111'})`
    2. 合成事件中 都是 异步执行，原生事件中都是同步执行。合成事件中 多个 setState 会合并执行， 多个 useState 不会合并

15. 怎么实现一个简单的 useState, useMemo ,useCallback

16. React.Component 和 React.PureComponent 有什么区别，

    1. PureComponent 默认实现了 shouldComponentUpdate 生命周期，会浅比较 props 是否变化，判断组件是否需要更新

17. react 怎么实现逻辑复用

    1. HOC
    2. React.createContext({}), 使用上下文模式
    3. render props 模式
    4. hooks

18. react 中使用了哪几种设计模式，

    1. HOC
    2. React.createContext({}), 使用上下文模式
    3. render props 模式
    4. hooks
    5. 组合模式
    6. 继承模式 `class Welcome extends React.Component{}`

19. react.createContext 是用来干什么的

    1. `const {Provider, Consumer} = React.createContext({})`
    2. 通过在 Provider 顶层传入 数据，Consumer 底层消费数据， 实现逻辑复用

20. react dom diff 是怎么样的。react DOM diff 与 vue DOM diff 对比

    1. react DOM DIFF：通过两次遍历来实现 ， 第一次遍历，遍历新节点，依次对比旧节点，判断 标签和 key 是否相等，相等则复用旧节点，继续下一个新节点和 下一个旧节点的 兄弟节点遍历。不等则直接退出第一次遍历。第一次遍历完会出现 4. 种情况，1. 新旧节点都遍历完，2. 新节点还有剩余，表示有新增节点，为剩余节点打上 Placement 新增 effectTag。3. 旧节点有剩余，表示删除了节点，未剩余旧节点打上 Deletion EffectTag，表示删除。4. 新旧节点都没有遍历完，表示节点的位置移动了，继续第二次遍历
    2. 第二次遍历：将旧节点生成一个 Map 对象，以旧节点的 key 或者 index 作为 map 的 key,旧节点作为 map 的 value。遍历剩余新节点，通过新节点的 key 或者 index，从 map 对象中查找，是否有可复用的旧节点，，如果查找到旧节点，则判断旧节点的 标签名，是否相同，相同则复用，不同则根据新节点，重新创建一个 fiber 节点，并打上 Placement effectTag。
    3. 为什么两次遍历，因为 React 团队调研发现，节点的更新操作相对于节点的移动频率会高。第一轮遍历是为了处理节点的更新，第二轮遍历，是判断节点的移动。会使用一个 lastPlacedIndex 变量来存储节点移动前的索引。

21. hooks 中，第二个参数是一个依赖，react 是怎么判断依赖是否改变

    1. react 使用 is()方法来判断依赖是否变化， is 方法，会先使用 Object.is()是否存在，如果不存在，则使用 React 自己实现的 pollfill 来处理

22. useState 和 useReducer 的区别

    1. useState 和 useReducer 在 update 阶段，都是调用同样的方法 `updateReducer(basicStateReducer, initialState)`。 useState 会在 updateReducer 默认传入一个 basicStateReducer,而 useReducer 的 basicStateReducer 是由用户手动传入的。

23. useReducer 使用来干什么的，有几个参数，当 useReducer 拥有第三个参数时，内部是怎么处理的，为什么这么处理

    1. useReducer 相当于 redux 中的 reducer,用来处理对象。
    2. useReducer( reducer, initialState, init)，当存在第三个参数 init 时，第二个参数会作为 init 的参数传入

```js
mountReducer(reducer, initialArg, init){
  const hook = mountWorkInProgressHook();
  let initialState;
  // 当传入第三个参数 init时，useReducer的初始值会被延迟初始化，避免了 useReducer 在初始化之前巨大的初始值带来的影响
  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }
  hook.memoizedState = hook.baseState = initialState;
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialState
  });
  const dispatch = (queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue));
  return [hook.memoizedState, dispatch];
}
```

24. react 为什么不使用原生事件，而是使用合成事件。合成事件解决了什么问题。合成事件内部流程是怎么样的

    1. react 为了实现一个跨平台的 UI 库，为了解决平台差异而实现了一个自己的事件系统。合成事件解决了不同平台事件存在的差异
    2. 合成事件是在组件挂载过程中，在遍历组件 props 时，当遍历到合成事件属性时，会根据事件类型使用不同插件进行特殊的逻辑处理，事件插件有 simpleEventPlugin, beforeInputEventPlugin, EnterLeaveEventPlugin, ChangeEventPlugin, SelectEventPlugin

25. 使用 react 实现双向数据绑定

    1. 通过 state,来实现

26. react 新增了 fiber， fiber 用来解决什么问题
27. fiber 流程
28. react 添加了 fiber 后，为什么把 componentWillxxxx 这些生命周期标记为 UNSAFE\_

    1. 因为 react15（fiber）之前的架构是 Reconciler 和 renderer 两层，Reconciler 对 DOM 进行 DOM Diff（同步递归），diff 完成之后，进入 Renderer 阶段，对 DOM 进行渲染
    2. react16 (fiber)之后架构是 Scheduler/Reconciler/Renderer 三次，Scheduler 会对任务进行优先级判断，优先级高的任务优先进入 Reconciler。优先级低的任务，后进入 Reconciler。Reconciler 对 DOM 进行 DOM Diff ，找出变化的节点，并为节点打上 EffectTag 标记。Reconciler 之后是 Renderer 阶段，会对打上 EffectTag 标记的节点，进行相应的增删改操作。
    3. fiber 之前，react 处理任务，是递归执行，期间无法被打断，如果任务执行时间过长，会导致页面长时间无效应，影响用户交互。fiber 之后，react 将 react15 的 Reconciler 阶段拆分成了两个阶段，一个 Scheduler、一个 Reconciler。Scheduler 通过判断任务的优先级，优先级高的任务先进入 Reconciler，优先级低的后进入 Reconciler。这样就导致了任务可能会被打断，使得 componentWillxxxx 这些生命周期可能会重复执行。所以给 componentWillxxxx 加上了 UNSAFE\_

29. react 组件是怎么处理错误的

    1. react 新增了错误边界组件 static getDerivedStateFromError(err)、componentDidCatch(err,stackInfo) 只要具有一个就是错误边界组件
    2. React.Component 新增了一个 static getDerivedStateFromError(err) 静态方法、componentDidCatch(err,stackInfo)生命周期，来处理组件的错误。getDerivedStateFromError(err)返回一个 state,在组件出错后有机会修改 state，并触发最后一次渲染。componentDidCatch(err,stackInfo)返回了组件的错误信息和堆栈
    3. 错误边界组件不能捕获的错误

       - 自身组件的错误，
       - 异步任务的错误，
       - 编译时错误
       - 服务器渲染错误

    4. 错误边界组件可以捕获被自己包裹的子组件的错误，无论是 类组件还是函数组件

30. react 的 HOC 高阶组件是怎么理解的

    - HOC 高阶组件，是传入一个组件，返回一个功能强化后的组件，

31. HOC 有哪些约定。HOC 是怎么处理传入组件上的静态属性的

    1. 不能改变原组件的属性
    2. 只能通过 props 的形式对原组件进行功能强化
    3. 使用组合模式
    4. 需要添加 displayName，便与 devtool 调试
    5. 需要使用 `hoist-non-react-statics`包处理 HOC 返回的组件，因为默认情况下，hoc 返回的组件无法访问到原组件的静态属性和方法，所以需要使用`hoist-non-react-statics`包，将 原组件上的静态属性和方法复制到 hoc 最终返回的组件上

32. JSX 的理解

    1. jsx 实际上是`React.createElement()`的语法糖。同时 jsx 也是 js 的拓展，包含了所有 js 的功能
    2. jsx 的优点，

       - 快速：jsx 执行更快，因为它在编译为 js 后进行了优化
       - 安全：jsx 是静态类型的，大多是类型安全的
       - 简单：语法简介，上手简单

33. react 组件怎么添加 props 默认值

    1. 通过 defaultProps 属性添加 默认值，
    2. 通过 state 设置默认值

34. react 组件的优化手段

    1. 使用 useMemo 值
    2. 使用 useCallback 缓存函数
    3. 使用 shouldComponentUpdate 生命周期
    4. 使用 React.lazy() 懒加载组件
    5. 使用 React.memo()
    6. 节点添加 key 属性

35. React.memo 的理解

    - React.memo(Component, function compare(){})， 是一个高阶函数，第一个参数是一个组件，第二个参数是一个比较函数。当组件 props 变化时，会通过 compare 方法，判断组件是否需要更新
