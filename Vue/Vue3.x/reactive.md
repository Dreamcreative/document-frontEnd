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

4. `shallowReadonly(target: object)`

> 返回一个`根属性`只读的代理对象

```ts
function shallowReadonly<T extends object>(target: T): Readonly<T> {
  return createReactiveObject({
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  })
}
```

## createReactiveObject()

```ts
createReactiveObject(
  // 目标对象
  target: Target,
  // 是否只读
  isReadonly: boolean,
  // 设置 target 的 get/set/deleteProperty/has/ownKeys 等方法
  baseHandlers: ProxyHandler<any>,

  collectionHandlers: ProxyHandler<any>,
  // 代理集合
  proxyMap: WeakMap<Target, any>
){
  /**
   * 1. target 是原始类型 ，直接返回
   * 2. target 已经是一个响应对象，直接返回
   * 3. 对同一个 target 执行多次 reactive,返回的都是同一个代理对象
   * 4. 对特殊类型的值，不进行代理，直接返回原值
   * 5. 通过 Proxy 劫持 target 对象，使其变成响应式
   */
  // 1
  if(!isObject(target)){
    return target
  }
  // 2
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // 3
  const existingProxy = proxyMap.get(target)
  if(existingProxy){
    return existingProxy
  }
  // 4
  const targetType = getTargetType(target)
  if(targetType === TargetType.INVALID){
    return target
  }
  // 5
  const proxy = new Proxy(target, targetType === TargetType.COLLECTION ? collectionHandlers: baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}
```
