# useTransition

useTransition 让你可以在后台渲染部分 UI

## 挂载阶段

```ts
type StartTransitionOptions = {
  name?: string,
};
function mountTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  const stateHook = mountStateImpl((false: Thenable<boolean> | boolean));
  // The `start` method never changes.
  const start = startTransition.bind(
    null,
    currentlyRenderingFiber,
    stateHook.queue,
    true,
    false,
  );
  const hook = mountWorkInProgressHook();
  hook.memoizedState = start;
  return [false, start];
}

function startTransition<S>(
  fiber: Fiber,
  queue: UpdateQueue<S | Thenable<S>, BasicStateAction<S | Thenable<S>>>,
  pendingState: S,
  finishedState: S,
  callback: () => mixed,
  options?: StartTransitionOptions,
): void {
  // 获取当前优先级
  const previousPriority = getCurrentUpdatePriority();
  // 设置高优先级给 transition
  setCurrentUpdatePriority(
    higherEventPriority(previousPriority, ContinuousEventPriority),
  );

  const prevTransition = ReactSharedInternals.T;
  const currentTransition: BatchConfigTransition = {};

  // We don't really need to use an optimistic update here, because we
  // schedule a second "revert" update below (which we use to suspend the
  // transition until the async action scope has finished). But we'll use an
  // optimistic update anyway to make it less likely the behavior accidentally
  // diverges; for example, both an optimistic update and this one should
  // share the same lane.
  ReactSharedInternals.T = currentTransition;
  // 触发更新
  dispatchOptimisticSetState(fiber, false, queue, pendingState);

  if (enableTransitionTracing) {
    if (options !== undefined && options.name !== undefined) {
      currentTransition.name = options.name;
      currentTransition.startTime = now();
    }
  }

 

  try {
    // 执行 transition 回调
    const returnValue = callback();
    const onStartTransitionFinish = ReactSharedInternals.S;
    if (onStartTransitionFinish !== null) {
      onStartTransitionFinish(currentTransition, returnValue);
    }

    // Check if we're inside an async action scope. If so, we'll entangle
    // this new action with the existing scope.
    //
    // If we're not already inside an async action scope, and this action is
    // async, then we'll create a new async scope.
    //
    // In the async case, the resulting render will suspend until the async
    // action scope has finished.
    // 处理异步 transition
    if (
      returnValue !== null &&
      typeof returnValue === 'object' &&
      typeof returnValue.then === 'function'
    ) {
      const thenable = ((returnValue: any): Thenable<mixed>);
      // Create a thenable that resolves to `finishedState` once the async
      // action has completed.
      const thenableForFinishedState = chainThenableValue(
        thenable,
        finishedState,
      );
      dispatchSetStateInternal(
        fiber,
        queue,
        (thenableForFinishedState: any),
        requestUpdateLane(fiber),
      );
    } else {
      // 处理同步 transition
      dispatchSetStateInternal(
        fiber,
        queue,
        finishedState,
        requestUpdateLane(fiber),
      );
    }
  } catch (error) {
    // This is a trick to get the `useTransition` hook to rethrow the error.
    // When it unwraps the thenable with the `use` algorithm, the error
    // will be thrown.
    // 处理 错误
    const rejectedThenable: RejectedThenable<S> = {
      then() {},
      status: 'rejected',
      reason: error,
    };
    dispatchSetStateInternal(
      fiber,
      queue,
      rejectedThenable,
      requestUpdateLane(fiber),
    );
  } finally {
    // 恢复上一次状态
    setCurrentUpdatePriority(previousPriority);

    ReactSharedInternals.T = prevTransition;
  }    
}
```

## 更新阶段

```ts
function updateTransition(): [
  boolean,
  (callback: () => void, options?: StartTransitionOptions) => void,
] {
  const [booleanOrThenable] = updateState(false);
  const hook = updateWorkInProgressHook();
  // 获取缓存
  const start = hook.memoizedState;
  const isPending =
    typeof booleanOrThenable === 'boolean'
      ? booleanOrThenable
      : // This will suspend until the async action scope has finished.
        useThenable(booleanOrThenable);
  return [isPending, start];
}
```
