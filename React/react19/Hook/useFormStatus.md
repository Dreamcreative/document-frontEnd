# useFormStatus

`useFormStatus` 是一个提供上次表单提交状态信息的 hook

## 实现原理

1. useFormStatus 内部使用 React 调度器 dispatcher
2. 通过 resolveDispatcher() 获取当前的 react 调度器
3. 调用调度器的 useHostTransitionStatus() 获取表单状态

* useFormStatus

```ts
export function useFormStatus():FormStatus{
  const dispatcher = resolveDispatcher();
  return dispatcher.useHostTransitionStatus();
}
```

* useHostTransitionStatus

```ts
function useHostTransitionStatus(): TransitionStatus {
  return readContext(HostTransitionContext);
}
```

* readContext

```ts
export function readContext<T>(context: ReactContext<T>): T {
  if (__DEV__) {
    // This warning would fire if you read context inside a Hook like useMemo.
    // Unlike the class check below, it's not enforced in production for perf.
    if (isDisallowedContextReadInDEV) {
      console.error(
        'Context can only be read while React is rendering. ' +
          'In classes, you can read it in the render method or getDerivedStateFromProps. ' +
          'In function components, you can read it directly in the function body, but not ' +
          'inside Hooks like useReducer() or useMemo().',
      );
    }
  }
  return readContextForConsumer(currentlyRenderingFiber, context);
}
```

* readContextForConsumer

```ts
function readContextForConsumer<T>(
  consumer: Fiber | null,
  context: ReactContext<T>,
): T {
  const value = isPrimaryRenderer
    ? context._currentValue
    : context._currentValue2;

  const contextItem = {
    context: ((context: any): ReactContext<mixed>),
    memoizedValue: value,
    next: null,
  };
  if (lastContextDependency === null) {
    // This is the first dependency for this component. Create a new list.
    lastContextDependency = contextItem;
    consumer.dependencies = __DEV__
      ? {
          lanes: NoLanes,
          firstContext: contextItem,
          _debugThenableState: null,
        }
      : {
          lanes: NoLanes,
          firstContext: contextItem,
        };
    consumer.flags |= NeedsPropagation;
  } else {
    // Append a new context item.
    lastContextDependency = lastContextDependency.next = contextItem;
  }
  return value;
}
```
