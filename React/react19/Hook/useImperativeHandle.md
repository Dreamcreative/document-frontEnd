# useImperativeHandle

`useImperativeHandle(ref, create, deps)`: 向父组件暴露实例

## 注意

1. 不要滥用 ref: 应该是在没法通过 props 来实现的情况下，才使用 ref
2. 如果可以通过 prop 实现，那就不应该使用 ref: 如果能使用 props 实现，尽量使用 props
3. 从 React19 开始，`ref` 可以通过 props 进行传递。React19 之前，只能使用 `forwardRef` 获取 ref

## 挂载阶段

```ts
function mountImperativeHandle<T>(
  // 要修改的 ref
  ref: {current: T | null} | ((inst: T | null) => mixed) | null | void,
  // 需要暴露给父组件的函数
  create: () => T,
  // 依赖数组
  deps: Array<mixed> | void | null,
): void {
  // 将 ref 传入到依赖数组中
  const effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  // 设置 fiberFlag 标记
  let fiberFlags: Flags = UpdateEffect | LayoutStaticEffect;
  // 创建 effect
  mountEffectImpl(
    fiberFlags,
    HookLayout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps,
  );
}
```

## 更新阶段

```ts
function updateImperativeHandle<T>(
  ref: {current: T | null} | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  deps: Array<mixed> | void | null,
): void {
  const effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;
  // 处理 effect
  updateEffectImpl(
    UpdateEffect,
    HookLayout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps,
  );
}
```

## 例子

```ts
useImperativeHandle(ref, () => ({
  focus: () => {
    inputRef.current.focus();
  }
}), []);
```
