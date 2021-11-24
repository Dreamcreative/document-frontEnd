# React 17.0.2 hooks update 更新阶段

> hooks 是一个环形链表结构，使用 next 执行下一个 hook，所以 hook 只能在函数组件的顶级作用域中使用 

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