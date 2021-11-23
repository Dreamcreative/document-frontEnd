# React 17.0.2 hooks

## mount 阶段

> `HooksDispatcherOnMountInDEV` hooks 在挂载阶段使用的方法

### useState(initialState) 

> `let [number, setNumber] = useState(0)`

> 返回一个数组，数组第一项用于读取此时的 state 值，第二项用于更新 state 函数

```js
mountState(initialState){
    // 获取 hooks
    var hook= mountWorkInprogress();
    // 如果 initialState 是方法，执行后得到 initialState
    if(typeof initialState === 'function'){
        initialState = initialState();
    }
    hook.memoizedState = hook.baseState = initialState;
    var queue = hooks.queue = {
        pending:null,
        dispatch:null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialState
    }
    // 返回一个已绑定了 fiber 和 queue 的 dispatch 函数
    var dispatch = queue.dispatch = dispatchAction.bind(null,currentlyRenderingFiber, queue);
    // 返回一个记忆值和一个可以修改值的 dispatch 函数
    return [hook.memoizedState, dispatch]
}
```

### useReducer(reducer, initialArg, init)

> 用法

```js
// useReducer 三个参数
/**
 * 当 useReducer 传入第三个参数时， 第二个参数 initialCount 会作为第三个参数 init 函数的参数
 * 是为了 useReducer 延迟初始化设计的。为了避免 useReducer 在初始化时，巨大的参数带来影响
 */
function init (initialCount){
    return {count: initialCount};
}
function reducer(state, action){
    switch(action.type){
        case 'reset':
            return init(action.payload);
    }
}
function Counter({initialCount}){
    const [state, dispatch]=useReducer(reducer, initialCount, init)
}
```

```js
// useReducer 两个参数

const initialState = {
  count: 5,
};
function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return initialState;
  }
}
function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialState);
}
```

```js
mountReducer(reducer, initialArg, init){
    const hook= mountWorkInProgressHook();
    let initialState;
    // 当传入第三个参数 init时，useReducer的初始值会被延迟初始化，避免了 useReducer 在初始化之前巨大的初始值带来的影响
    if(init !== undefined){
        initialState = init(initialArg);
    }else{
        initialState = initialArg;
    }
    hook.memoizedState = hook.baseState = initialState;
    const queue= hook.queue={
        pending:null,
        dispatch:null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState,
    };
    const dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
    return [hook.memoizedState, dispatch]
}
```

### useEffect(create, deps)

> 使用

```js
useEffect(()=>{
    // dosomething
    return ()=>{
        // 返回一个销毁函数 
        // 当组件销毁前执行的一些操作，比如清除定时器，解绑节点事件等
    }
},[deps])
```

```js
mountEffect(create, deps){
    mountEffectImpl(
        PassiveEffect | PassiveStaticEffect,
        HookPassive,
        create,
        deps,
    )
}
mountEffectImpl(fiberFlags, hookFlags, create, deps){
    const hook = mountWorkInProgressHook();
    const nextDeps= deps===undefined? null: deps;
    currentlyRenderingFiber.flags |= fiberFlags;
    hook.memoizedState= pushEffect(
        HookHasEffect | hookFlags,
        create,
        undefined,
        nextDeps,
    )
}
pushEffect(tag, create, destory, deps){
    const effect = {
        tag,
        create,
        destory,
        deps,
        next: null,
    }
    let componentUpdateQueue = currentlyRenderingFiber.updateQueue;
    if (componentUpdateQueue === null) {
        componentUpdateQueue = createFunctionComponentUpdateQueue();
        currentlyRenderingFiber.updateQueue = componentUpdateQueue;
        componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
        const lastEffect = componentUpdateQueue.lastEffect;
        if (lastEffect === null) {
        componentUpdateQueue.lastEffect = effect.next = effect;
        } else {
        const firstEffect = lastEffect.next;
        lastEffect.next = effect;
        effect.next = firstEffect;
        componentUpdateQueue.lastEffect = effect;
        }
    }
    return effect;
}
```


### useLayoutEffect(create, deps)

> 使用

```js
useLayoutEffect(()=>{
    // dosomething
    return ()=>{
        // 返回一个销毁函数 
        // 当组件销毁前执行的一些操作，比如清除定时器，解绑节点事件等
    }
},[deps])
```

```js
mountLayoutEffect(create, deps){
    return mountEffectImpl(UpdateEffect, HookLayout, create, deps);
}
mountEffectImpl(fiberFlags, hookFlags, create, deps){
    const hook = mountWorkInProgressHook();
    const nextDeps= deps===undefined? null: deps;
    currentlyRenderingFiber.flags |= fiberFlags;
    hook.memoizedState= pushEffect(
        HookHasEffect | hookFlags,
        create,
        undefined,
        nextDeps,
    )
}
pushEffect(tag, create, destory, deps){
    const effect = {
        tag,
        create,
        destory,
        deps,
        next: null,
    }
    let componentUpdateQueue = currentlyRenderingFiber.updateQueue;
    if (componentUpdateQueue === null) {
        componentUpdateQueue = createFunctionComponentUpdateQueue();
        currentlyRenderingFiber.updateQueue = componentUpdateQueue;
        componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
        const lastEffect = componentUpdateQueue.lastEffect;
        if (lastEffect === null) {
        componentUpdateQueue.lastEffect = effect.next = effect;
        } else {
        const firstEffect = lastEffect.next;
        lastEffect.next = effect;
        effect.next = firstEffect;
        componentUpdateQueue.lastEffect = effect;
        }
    }
    return effect;
}
```

> useEffect 和 useLayoutEffect 的区别

   1. useEffect 用来代替 `componentDidMount`、`componentDidUpdate`、`componentWillUnmount`生命周期，主要作用是在当`页面渲染后异步调用`，执行一些访问 DOM、请求数据等的副作用操作，`不会阻塞 UI 渲染` 。[React hook](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
   2. useLayoutEffect 是在 `DOM 更新后，UI渲染前，同步调用`,`会阻塞 UI 渲染`
   3. useEffect 和 useLayoutEffect 在 `Reader 阶段`打上的 `effectTag`不同，导致 useEffect 和 useLayoutEffect 的执行时间不同
   4. useEffect 和 useLayoutEffect 的回调函数和销毁函数在每次更新时都会执行。如果想要只执行一次，在 useEffect 和 useLayoutEffect 的依赖项中传入空数组 `useEffect(()=>{},[])`、`useLayoutEffect(()=>{},[])`
   4. 在`commit 阶段` 分为三个小阶段 `before Mutation`、`Mutation`、`Layout`。
        
        1. 在 `before Mutation 阶段` 会执行 `useEffect 的销毁函数`、`useEffect 的回调函数`
        2. 在 `commit-Mutation 阶段`会执行`所有 useLayoutEffect 的销毁函数`
        3. 在 `commit-Layout 阶段`会执行`所有 useLayoutEffect 的回调函数`