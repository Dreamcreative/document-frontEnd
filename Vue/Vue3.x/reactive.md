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
  // Set、Map、WeakSet、WeakMap的 处理函数与 Object、Array 的处理函数不同
  const proxy = new Proxy(target, targetType === TargetType.COLLECTION ? collectionHandlers: baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}
```

## createReactiveObject() 处理普通对象和 Map/Set/WeakMap/WeakSet 的区别

```ts
const proxy = new Proxy(target, targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers);
```

### mutableHandlers : 处理 Array/Object 普通对象的方法

```ts
const mutableHandlers: ProxyHandler<object> = {
  get: createGetter,
  set: createSetter,
  deleteProperty,
  has,
  ownKeys
};
function createGetter(isReadonly: boolean) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    // target是否 数组
    const targetIsArray = isArray(target);
    if (!isReadonly) {
      // 不是只读
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === 'hasOwnProperty') {
        return hasOwnProperty;
      }
    }
    // 获取到的 结果
    const res = Reflect.get(target, key, receiver);
    // 如果是内置方法，不需要另外进行代理
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    // 不是只读 收集依赖
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key);
    }
    // 浅代理：只代理对象的根属性 ，直接返回结果，不需要收集依赖
    if (shallow) {
      return res;
    }
    // 如果结果是 ref 返回 ref.value
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    // 如果结果是对象 对结果也进行 响应代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    // 如果结果是基本类型，直接返回
    return res;
  };
}
function createSetter(shallow: false) {
  return function set(target: Target, key: string | symbol, value: unknown, receiver: object): boolean {
    // 获取旧值
    let oldValue = (target as any)[key];
    // 旧值是只读 ref 新增不是 ref
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    // 不是浅响应
    if (!shallow) {
      // 新值 不是浅代理、不是只读
      if (!isShallow(value) && !isReadonly(value)) {
        // 获取 旧值、新值的 原对象
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      // 目标对象 不是数组 并且 旧值是 ref ,新值不是 ref
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        // 将新值 直接设置给 旧值  oldValue.value = value
        oldValue.value = value;
        return true;
      }
    } else {
      // 浅响应模式下，无论是否有反应，对象都会按原样设置
      // in shallow mode, objects are set as-is regardless of reactive or not
    }
    // 原始对象中是否有新赋值的这个 key
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    // 通过 reflect 获取 原始的 set 行为
    const result = Reflect.set(target, key, value, receiver);
    // don't trigger if target is something up in the prototype chain of original
    // 操作原型链上的 数据，不做任何触发监听函数的行为
    // 是操作 对象本身
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        // 是新增值 触发 新增操作
        trigger(target, TriggerOpTypes.ADD, key, value);
      } else if (hasChanged(value, oldValue)) {
        // 是修改值 触发修改值 操作
        trigger(target, TriggerOpTypes.SET, key, value, oldValue);
      }
    }
    return result;
  };
}
```

### mutableCollectionHandlers ：处理 Map/Set/WeakMap/WeakSet 的方法

> 由于 Proxy 无法代理 `Map/Set/WeakMap/WeakSet` 类型，Vue3 使用劫持 `get、has、add、set、delete、clear、forEach` 等方法调用来实现响应式

```ts
const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  // 只有一个 get 方法 因为 Set、Map、WeakSet、WeakMap 的内部机制限制，其修改、删除的操作通过内部的方法来完成，无法通过 设置 Proxy 设置 set 来完成
  get: createInstrumentationGetter(false, false)
};
function createInstrumentationGetter(isReadonly: boolean, shallow: boolean) {
  // 获取最终的处理函数
  const instrumentations = shallow
    ? isReadonly
      ? shallowReadonlyInstrumentations
      : shallowInstrumentations
    : isReadonly
    ? readonlyInstrumentations
    : mutableInstrumentations;
  return (target: CollectionTypes, key: string | symbol, receiver: CollectionTypes) => {
    // 对内部 key 的处理
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.RAW) {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
```
