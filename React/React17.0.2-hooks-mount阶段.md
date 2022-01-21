# React 17.0.2 hooks

## mount 阶段

> `HooksDispatcherOnMountInDEV` hooks 在挂载阶段使用的方法

### useState(initialState) 

> 使用

   1. `let [number, setNumber] = useState(0)`
   2. `let [number, setNumber]= useState(()=> 0)`

> 返回一个数组，数组第一项用于读取此时的 state 值，第二项用于更新 state 函数

```js
mountState(initialState){
    // 获取 hooks
    var hook= mountWorkInprogressHook();
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
        // 返回一个销毁函数 ，比如清除定时器，解绑节点事件等
        // 会在每次组件更新时执行，可以通过传入 deps 来改变执行次数
    }
},deps)
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
        // 返回一个销毁函数 ，比如清除定时器，解绑节点事件等
        // 会在每次组件更新时执行，可以通过传入 deps 来改变执行次数
    }
},deps)
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

   1. useLayoutEffect 用来代替 `componentDidMount`、`componentDidUpdate`生命周期，因为 useLayoutEffect 的 create 函数的调用位置、时机一致，且都是被`同步调用，阻塞浏览器渲染`。
   2. useLayoutEffect 的 destory 函数的调用位置与 `componentWillUnmount`一致，且是同步调用。而 useEffect 的 destroy 函数相当于`componentDidUnmount`（React 没有这个生命周期）
   3. useLayoutEffect 是在 `DOM 更新后，UI渲染前，同步调用`,`会阻塞 UI 渲染`
   4. useEffect 和 useLayoutEffect 在 `Reader 阶段`打上的 `effectTag`不同，导致 useEffect 和 useLayoutEffect 的执行时间不同
   5. useEffect 和 useLayoutEffect 的回调函数和销毁函数在每次更新时都会执行。如果想要只执行一次，在 useEffect 和 useLayoutEffect 的依赖项中传入空数组 `useEffect(()=>{},[])`、`useLayoutEffect(()=>{},[])`
   6. 在`commit 阶段` 分为三个小阶段 `before Mutation`、`Mutation`、`Layout`。
        
        1. 在 `before Mutation 阶段` 会执行`异步调度`useEffect
        2. 在 `commit-Mutation 阶段`会执行`所有 useLayoutEffect 的销毁函数`
        3. 在 `commit-Layout 阶段`会同步执行`useLayoutEffect 的回调函数`，异步执行`useEffect 的销毁函数和回调函数`

### useMemo(nextCreate, deps) 缓存回调返回的值，deps 依赖不变，则缓存值不变

> 使用

```js
const memoValue = useMemo(()=> {a:1}, deps);
// memoValue={a:1}
```

```js
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
```

### useCallback(callback, deps) 缓存函数，deps 依赖不变，则缓存函数不变

> 使用

```js
const callback = useCallback(()=>{
    console.log(111)
}, deps);
// callback = ()=>{console.log(111)}
```

```js
mountCallback(callback, deps){
    const hook = workInProgressHook();
    const nextDeps = deps === undefined?null:deps;
    hook.memoizedState = [callback, nextDeps];
    return callback;
}
```

> useMemo 和 useCallback 的区别

   1. 都是用来缓存，useMemo 用来缓存函数返回的值，不需要再次调用。useCallback 用来缓存函数，使用时需要调用。
   2. useMemo 会执行传入的函数，useCallback 不会执行传入的函数，而是原封不动的返回

### useRef(initialValue) 缓存一个值，在整个生命周期内，ref的值不会改变，同时 ref 值变化不会导致页面的主动渲染

> 使用

`const ref = useRef(null)`

```js
mountRef(initialValue){
    const hook = mountInProgressHook();
    const ref = {current: initialValue};
    hook.memoizedState =ref;
    return ref;
}
```

### useContext(context, observedBits) 

> 通过 `React.createContext`创建出的上下文，在子组件中通过 `useContext` 获取 Provider 提供的内容。`跨组件透传上下文`

> 使用

```js
const MyContext = React.createContext(null);

const Parent = ()=>{
    const [step, setStep] = useState(0);
    const [count, setCount] = useState(0);
    const [number, setNumber] = useState(0);

    return (
        <MyContext.Provider value={{ setStep, setCount, setNumber }}>
            <Child step={step} number={number} count={count} />
        </MyContext.Provider>
    );
}

export default Child((props = {}) => {
    const { setStep, setNumber, setCount } = useContext(MyContext);

    return (
        <div>
            <p>step is : {props.step}</p>
            <p>number is : {props.number}</p>
            <p>count is : {props.count}</p>
            <hr />
            <div>
                <button onClick={() => { setStep(props.step + 1) }}>step ++</button>
                <button onClick={() => { setNumber(props.number + 1) }}>number ++</button>
                <button onClick={() => { setCount(props.step + props.number) }}>number + step</button>
            </div>
        </div>
    );
});
```

```js
// MAX_SIGNED_31_BIT_INT = 1073741823 / Math.pow(2,30)-1

readContext(context, observedBits){
    if (lastContextWithAllBitsObserved === context) {
        // Nothing to do. We already observe everything in this context.
        // 不做任何事，我们已经在 这个 context 中监听了所有内容
    } else if (observedBits === false || observedBits === 0) {
        // Do not observe any updates.
        // 不监听任何更新
    } else {
        let resolvedObservedBits; // Avoid deopting on observable arguments or heterogeneous types.
        if (
            typeof observedBits !== 'number' ||
            observedBits === MAX_SIGNED_31_BIT_INT
        ) {
            // Observe all updates.
            lastContextWithAllBitsObserved = context;
            resolvedObservedBits = MAX_SIGNED_31_BIT_INT;
        } else {
            resolvedObservedBits = observedBits;
        }

        const contextItem = {
            context: context,
            observedBits: resolvedObservedBits,
            next: null,
        };

        if (lastContextDependency === null) {
        invariant(
            currentlyRenderingFiber !== null,
            'Context can only be read while React is rendering. ' +
            'In classes, you can read it in the render method or getDerivedStateFromProps. ' +
            'In function components, you can read it directly in the function body, but not ' +
            'inside Hooks like useReducer() or useMemo().',
        );

        // This is the first dependency for this component. Create a new list.
        lastContextDependency = contextItem;
        currentlyRenderingFiber.dependencies = {
            lanes: NoLanes,
            firstContext: contextItem,
            responders: null,
        };
        } else {
            // Append a new context item.
            lastContextDependency = lastContextDependency.next = contextItem;
        }
    }
  return isPrimaryRenderer ? context._currentValue : context._currentValue2;
}
```

### useImperativeHandle(ref, create, deps)

> 当父组件想要访问子组件内部定义的函数方法时，可以使用 `useImperativeHandle` 在子组件内部进行控制，可以返回任意的内容，避免父组件能够访问到子组件的实例对象

> 使用

```js
Parent = ()=>{
     const parentRef = useRef(null);
    /**
    parentRef.current = {
        handleEvent:()=>{
            // doSomething
        },
        a:'',
        b:'',
        ...
    }
    */  
     return <>
        <Child cRef={parentRef}></Child>
     </>
}
Child=(props)=>{
    const { cRef }= props;
    useImperativeHandle(cRef, ()=>{
        return {
            handleEvent:()=>{
                // doSomething
            },
            a:'',
            b:'',
            ...
        }
    },[])
    return <>
    ....
    </>
}
```

```js
mountImperativeHandle(ref, create, deps){
    const effectDeps = deps !==null && deps !== undefined? deps.concat([ref]):null;
    return mountEffectImpl(
        UpdateEffect,
        HookLayout,
        imperativeHandleEffect.bind(null, create, ref),
        effectDeps
    )
}
mountEffectImpl(fiberFlags, hookFlags, create, deps){
    const hook = mountWorkInProgressHook();
    const nextDeps = deps ===undefined? null:deps;
    currentlyRenderingFiber.flags |= fiberFlags;
    hook.memoizedState = pushEffect(
        HookHasEffect | hookFlags,
        create,
        undefined,
        nextDeps
    )
}
```

### useDeferredValue(value) Concurrent模式(实验版)

> 在 React 17.0.2 版本中，useDeferredValue 只接收一个值，不知道为什么官网中可以接收两个值。

> 使用

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* 保持将当前文本传递给 input */}
      <input value={text} onChange={handleChange} />
      {/* 但在必要时可以将列表“延后” */}
      <MySlowList text={deferredText} />
    </div>
  );
}
```

```js
mountDeferredValue(value){
    const [prevValue, setPrevValue] = mountState(value);
    mountEffect(()=>{
        const prevTransition = ReactCurrentBatchConfig.transition;
        ReactCurrentBatchConfig.transition = 1;
        try{
            setPrevValue(value);
        }finally{
            ReactCurrentBatchConfig.transition = prevTransition;
        }
    },[value])
    return prevValue;
}
```

### useTransition() Concurrent模式(实验版)

> 允许组件在切换到下一个界面之前等待内容加载，从而避免不必要的加载状态。它还允许组件将速度较慢的数据获取更新推迟到随后渲染，以便能够立即渲染更重要的更新

> 使用

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " 加载中..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

```js
mountTransition(){
    const [isPending, setPending] = mountState(false);
    const start = startTranstion.bind(null, setPending);
    mountRef(start);
    return [start, isPending];
}
startTranstion(setPending, callback){

}
```

## 参考

* [React hook](https://zh-hans.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
