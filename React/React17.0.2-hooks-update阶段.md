# React 17.0.2 hooks update 更新阶段

> hooks 是一个环形链表结构，使用 next 指向下一个 hook，所以 hook 只能在函数组件的顶级作用域中使用

## update 阶段

### 基础结构 typeScript 定义

```ts
type ReactPriorityLevel=99| 98| 97| 96| 95| 90;
// 使用位运算 二进制格式
type Lane = number;
const NoLanes: Lanes = 0b0000000000000000000000000000000;
const NoLane: Lane = 0b0000000000000000000000000000000;

type Update = {
  lane: Lane, // 当前更新的过期时间， 用来代替之前的过期时间 expirationTime，
  action: A, // 更新函数
  eagerReducer: ((S, A) => S) | null,
  eagerState: S | null,
  next: Update < S, A >, // 指向下一个 需要更新的 Update
  priority ?: ReactPriorityLevel, // 当前更新的优先级
}

type UpdateQueue={
  pending: Update,
  dispatch: (A => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
}
```

> 公用方法

```js
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y)
  );
}
// 用来判断传入的两个值是否相同
// hooks 的 deps 就是使用这个方法来判断是否有变化
is = objectIs(x, y){
  // 如果 Object.is() 方法存在就使用 Object.is()，不存在就使用自己定义的方法
  return typeof Object.is === 'function'? Object.is : is
}
// update 阶段的 useState 调用 updateReducer 传入的第一个参数
basicStateReducer(state, action){
  return typeof action === 'function'? action(state): action;
}
// 判断 hooks 的依赖是否相同
// 遍历 nextDeps 和 prevDeps 中的每一个值，判断是否相等，
areHookInputsEqual(nextDeps, prevDeps){
  for(let i=0;i<nextDeps.length && i<prevDeps.length ;i++ ){
    if(is(nextDeps[i], prevDeps[i])){
      continue;
    }
    return false;
  }
  return true;
}
```

### useState(initialState)

```js
useState(initialState){
  return updateReducer(basicStateReducer, initialState);
}
updateReducer(reducer, initialArg, init){
  // 获取当前正在工作的 hook
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  queue.lastRenderedReducer = reducer;
  const current= currentHook;
  // 执行中的更新队列
  let baseQueue = current.baseQueue;
  // 上一次未被执行的更新队列
  const pendingQueue= queue.pending;
  if(pendingQueue !== null){
    // reRender阶段 ：当前更新周期又产生了新的更新，就继续执行这些更新，直到当前渲染周期中没有更新为止

    // 我们有尚未处理的更新队列
    // 将它们添加到当前的更新队列中
    if(baseQueue !== null){
      // 将上一次未被执行的更新队列与此次更新队列进行合并
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
      current.baseQueue = baseQueue = pendingQueue;
      queue.pending = null;
    }
  }
  if(baseQueue !==null){
    // 如果是正常的 render 阶段(非 reRender)，对每个更新判断其优先级，如果不是当前整体更新优先级内的更新会跳过。第一个跳过的 Update 会变成新的 baseUpdate,它记录了在之后所有的 Update,即便是优先级比它高的，需要保证后续的更新要在它更新之后的基础上执行

    // 合并之后 先更新上一次未被执行的更新队列
    const first = baseQueue.next;
    let newState = current.baseState;
    let newBaseState = null;
    let newBaseQueueFirst =null;
    let newBaseQueueLast = null;
    let update = first;
    do{
      const updateLane = update.lane;
      if(!isSubsetOfLanes(renderLanes, updateLane)){
        // 如果这是第一次跳过更新，如果优先级不够，跳过此次更新，
        const clone:Update = {
          lane:updateLane,
          action: update.action,
          eagerReducer: update.eagerReducer,
          eagerState: update.eagerState,
          next: null,
        }
        if(newBaseQueueList === null){
          newBaseQueueFirst = newBaseQueueList = clone;
          newBaseState = newState;
        }else{
          newBaseQueueList = newBaseQueueList.next = clone;
        }
        // 更新队列中的剩余优先级
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        markSkippedUpdateLanes(updateLane);
      }else{
        // 此更新具有足够的优先级
        if(newBaseQueueLast !== null){
          const clone:Update = {
            // 这次更新我们不想跳过它，使用优先级最高的 NoLane
            lane: NoLane,
            action: update.action,
            eagerReducer: update.eagerReducer,
            eagerState: update.eagerState,
            next:null,
          }
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        // 执行这次更新
        if(update.eagerReducer === reducer){
          newState = update.eagerState;
        }else{
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      // 此次更新执行完毕之后，马上进入下一个更新
      update = update.next;
    }while(update !== null && update !== first)
    if(newBaseQueueLast === null){
      newBaseState = newState;
    }else{
      newBaseQueueLast.next = newBaseQueueFirst;
    }
    // 只有当 新的 state和之前的 state 不同时，fiber 才进行工作
    if(!is(newState, hook.memoizedState)){
      markWorkInProgressReceivedUpdate();
    }
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }
  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
```

### useReducer(reducer, initialArg, init)

```js
useReducer(reducer, initialArg, init){
  updateReducer(reducer, initialArg, init);
}
```

### useEffect(create, deps) ，执行副作用函数，副作用就是 `可能会产生更新的操作`

```js
useEffect(create, deps){
  updateEffect(create, deps)
}
updateEffect(create, deps){
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}
updateEffectImpl(fiberFlags, hookFlags, create, deps){
  // 获取当前 hook
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined? null:deps;
  let destroy = undefined;
  if(currentHook === null){
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if(nextDeps !==null){
      const prevDeps = prevEffect.deps;
      if(areHookInputsEqual(nextDeps, prevDeps)){
        pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps,
  );
}
// 向当前的 Fiber 节点添加 effectTag,并且会创建 updateQueue
// useEffect 添加 UpdateEffect|PassiveEffect
// useLayoutEffect 添加 UpdateEffect
// useImperativeHandle 添加 UpdateEffect|PassiveEffect
pushEffect(tag, create, destroy, deps){
  const effect = {
    tag,
    create,
    destroy,
    deps,
    next:null
  };
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue;
  if(componentUpdateQueue ===null){
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  }else{
    const lastEffect = componentUpdateQueue.lastEffect;
    if(lastEffect === null){
      componentUpdateQueue.lastEffect = effect.next = effect;
    }else{
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

```js
useLayoutEffect(create, deps){
  return updateLayoutEffect(create, deps);
}
updateLayoutEffect(create, deps){
  return updateEffectImpl(UpdateEffect, HookLayout, create, deps);
}
```

### useMemo(create, deps)

```js
useMemo(create, deps){
  return updateMemo(create, deps);
}
/**
  更新阶段的 useMemo
  判断 当前传入的 deps 与上一次传入的 deps 是否相同
  如果相同，则直接上一次的值。
  如果不同，则执行一遍传入的方法，返回
*/
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

### useCallback(callback, deps)

```js
useCallback(callback, deps){
  return updateCallback(callback, deps);
}
/**
  更新阶段的 useCallback
  判断当前传入的 deps 与 上一次传入的 deps 是否相同
  如果相同，直接返回上一次的值
  如果不同，则返回 callback
*/
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
```

### useRef(initialValue)

```js
useRef(initialValue){
  return updateRef(initialValue);
}
/**
  更新阶段 useRef
  直接返回 mount 阶段初始化时的值
*/
updateRef(initialValue){
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```

### useContext()

```js
useContext(context, observedBits){
  return readContext(context, observedBits);
}
readContext(context, observedBits){

}
```

### useImperativeHandle(ref, create, deps)

```js
useImperativeHandle(ref, create, deps){
  return updateImperativeHandle(ref, create, deps);
}
updateImperativeHandle(ref, create, deps){
  const effectDeps = deps !== null && deps !== undefined? deps.concat([ref]):null;
  return updateEffectImpl(
    UpdateEffect,
    HookLayout,
    imperativeHandleEffect.bind(null, create, ref),
    nextDeps
  )
}
/**
  更新阶段
  为当前 fiber 节点打上与 useEffect 相同的 effectTag
*/
updateEffectImpl(fiberFlags, hookFlags, create, deps){
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined? null: deps;
  let destroy = undefined;
  if(currentHook !== null){
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if(nextDeps !==null){
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps,
  );
}
```

### useDeferredValue(value)

```js
useDeferredValue(value){
  return updateDeferredValue(value);
}
updateDeferredValue(value){
  const [prevValue, setValue] = updateState(value);
  updateEffect(() => {
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = 1;
    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}
```

### useTransition()

```js
useTransition(){
  return updateTransition()
}
updateTransition(){
  const [isPending] = updateState(false);
  const startRef = updateRef();
  const start = startRef.current;
  return [start, isPending];
}
```

## 参考

> React v17.0.2 /package/react-reconciler/src/ReactFiberHooks.new.js

- [useState](https://react.jokcy.me/book/hooks/hooks-use-state.html)
