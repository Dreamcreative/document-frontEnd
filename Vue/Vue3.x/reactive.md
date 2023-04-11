# 响应式代理

1. `reactive(target: object)`

> 返回一个对象的响应式代理

```ts
function reactive<T extends object>(target: T): UnWrapNestedRefs<T>;

function reactive(target: object){
  // 如果观察的是 只读对象，不监听，直接返回
  if(isReadonly(target)){
    return target
  }
  // 创建一个 响应式对象
  return createReactiveObject({
    // 需要代理的对象
    target,
    // 是否只读
    false,
    // proxy 处理函数
    mutableHandlers,
    mutableCollectionHandlers,
    // 响应对象集合
    reactiveMap
  })
}
```

2.  `shallowReactive(target: object)`

> 返回一个只有根级属性可响应的代理对象

```ts
function shallowReactive<T extends object>(target: T):ShallowReactive<T>{
  return createReactiveObject({
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  })
}
```

3. `readonly(target: object)`

> 返回一个只读的代理对象(无论传入的是一个响应式对象，还是一个 ref)

```ts
function readonly<T extends object>(target: T): DeepReadonly<UnwrapNestedRefs<T>> {
  return createReactiveObject({
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  })
}
```
