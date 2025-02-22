# useActionState

useActionState 可以根据某个表单动作的结果更新 state 的 hook

## 挂载阶段

```ts
useActionState(
  action,
  initialState,
  permalink
){
  return mountActionState(action, initialState, permalink)
}
```

```ts
function mountActionState(action, initialStateProp, permalink) {
  let initialState = initialStateProp

  // 服务器渲染相关处理 (SSR)
  if(getIsHydrating()){
    const root = getWorkInProgressRoot()
    const ssrFormState = root.formState;
    if (ssrFormState !== null) {
      const isMatching = tryToClaimNextHydratableFormMarkerInstance(
        currentlyRenderingFiber,
      );
      if (isMatching) {
        initialState = ssrFormState[0];
      }
    }
  }

  // 创建 hook
  const stateHook = mountWorkInProgressHook();
  stateHook.memoizedState = stateHook.baseState = initialState;

  // 创建更新队列
  const stateQueue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: actionStateReducer,
    lastRenderedState: initialState,
  };
  stateHook.queue = stateQueue;

  // 创建 setState 函数
  const setState: Dispatch<S | Awaited<S>> = (dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    ((stateQueue: any): UpdateQueue<S | Awaited<S>, S | Awaited<S>>),
  ): any);
  stateQueue.dispatch = setState;

  // 创建 pending 状态
  const pendingStateHook = mountStateImpl((false: Thenable<boolean> | boolean));
  const setPendingState: boolean => void = (dispatchOptimisticSetState. bind(
    null,
    currentlyRenderingFiber,
    false,
    ((pendingStateHook.queue: any): UpdateQueue<
      S | Awaited<S>,
      S | Awaited<S>,
    >),
  ): any);

  // 创建 action 队列
  const actionQueueHook = mountWorkInProgressHook();
  const actionQueue: ActionStateQueue<S, P> = {
    state: initialState,
    dispatch: null, // circular
    action,
    pending: null,
  };
  actionQueueHook.queue = actionQueue;

  // 创建 dispatch
  const dispatch = (dispatchActionState: any).bind(
    null,
    currentlyRenderingFiber,
    actionQueue,
    setPendingState,
    setState,
  );
  actionQueue.dispatch = dispatch;

  return [initialState, dispatch, false];
}
```

## 更新阶段

```ts
function updateActionState<S, P>(
  action: (Awaited<S>, P) => S,
  initialState: Awaited<S>,
  permalink?: string,
): [Awaited<S>, (P) => void, boolean] {
  // 获取当前 hook
  const stateHook = updateWorkInProgressHook();
  const currentStateHook = ((currentHook: any): Hook);
  return updateActionStateImpl(
    stateHook,
    currentStateHook,
    action,
    initialState,
    permalink,
  );
}

function updateActionStateImpl<S, P>(
  stateHook: Hook,
  currentStateHook: Hook,
  action: (Awaited<S>, P) => S,
  initialState: Awaited<S>,
  permalink?: string,
): [Awaited<S>, (P) => void, boolean] {
  /**
   * updateReducerImpl
   * 1. 处理更新队列
   * 2. 计算新状态
   * 3. 处理优先级
   * 4. 维护基础状态
   * 5. 支持优化更新
   */
  // 1. 更新 state 并获取最新的 action 结果
  const [actionResult] = updateReducerImpl<S | Thenable<S>, S | Thenable<S>>(
    // 当前工作的 hook
    stateHook,
    // 当前 hook
    currentStateHook,
    // reducer 函数
    actionStateReducer,
  );
  // 2. 获取 isPending 状态
  const [isPending] = updateState(false);

  // This will suspend until the action finishes.
  // 3. 处理 action 函数
  let state: Awaited<S>;
  if (
    typeof actionResult === 'object' &&
    actionResult !== null &&
    // $FlowFixMe[method-unbinding]
    typeof actionResult.then === 'function'
  ) {
    try {
      // 如果结果是一个 Promise
      state = useThenable(((actionResult: any): Thenable<Awaited<S>>));
    } catch (x) {
      if (x === SuspenseException) {
        // If we Suspend here, mark this separately so that we can track this
        // as an Action in Profiling tools.
        throw SuspenseActionException;
      } else {
        throw x;
      }
    }
  } else {
    // 普通值 直接返回
    state = (actionResult: any);
  }
  // 获取 action 队列和 dispatch
  const actionQueueHook = updateWorkInProgressHook();
  const actionQueue = actionQueueHook.queue;
  const dispatch = actionQueue.dispatch;

  // Check if a new action was passed. If so, update it in an effect.
  // 检查 action 值是否变化，变化就更新
  const prevAction = actionQueueHook.memoizedState;
  if (action !== prevAction) {
    currentlyRenderingFiber.flags |= PassiveEffect;
    pushSimpleEffect(
      HookHasEffect | HookPassive,
      createEffectInstance(),
      actionStateActionEffect.bind(null, actionQueue, action),
      null,
    );
  }

  return [state, dispatch, isPending];
}
```
