# ref、shallowRef、triggerRef、customRef、toRaw、markRaw

接收一个值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`

## 为什么 ref 需要通过 `.value` 获取值

因为 ref 通过代理 `value` 来实现响应式的

## triggerRef

强制触发一个 `shallowRef`，通常在对浅引用的内部值进行深度变更后使用

```ts
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 触发该副作用第一次应该会打印 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 这次变更不应触发副作用，因为这个 ref 是浅层的
shallow.value.greet = 'Hello, universe'

// 强行触发 shallowRef 使其变更
triggerRef(shallow)
```

## customRef

创建一个自定义 ref,显示声明其依赖追踪和更新触发的控制方式

```ts
import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void,
) => {
  get: () => T
  set: (value: T) => void
}
function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}
```

## toRaw

根据一个 Vue 创建的代理返回其原始对象

## markRaw

将一个对象标记为不可被转为代理，返回该对象本身。（主要用来处理第三方实例或 vue 组件对象）

```ts
function markRaw<T extends object>(value: T): Raw<T> {
  if (!hasOwn(value, ReactiveFlags.SKIP) && Object.isExtensible(value)) {
    def(value, ReactiveFlags.SKIP, true)
  }
  return value
}
```

```ts
function ref(value?: unknown) {
  return createRef(value, false)
}
function shallowRef(value?: unknown) {
  return createRef(value, true)
}
function createRef(rawValue: unknown, shallow: boolean) {
  // 如果已经是一个 ref 对象，直接返回
  if (isRef(rawValue)) {
    return rawValue
  }
  // 否则创建一个 ref 对象
  return new RefImpl(rawValue, shallow)
}
// 强制触发 shallowRef 的深层变更
function triggerRef(ref: Ref):void {
  if ((ref as unknown as RefImpl).dep) {
    (ref as unknown as RefImpl).dep.trigger()
  }
}
// ref 实例
class RefImpl {
  private _value;
  private _rawValue;
  // 依赖收集
  dep: Dep = new Dep()
  public readonly __v_isRef = true;
  /**
   * @param value any 原始值
   * @param __v_isShallow boolean 是否浅 ref
   */
  constructor(value, public readonly __v_isShallow = false) {
    // 原始值
    this._rawValue = __v_isShallow ? value : toRaw(value);

    // 如果是 浅 ref 直接将值赋值，
    // 如果不是浅 ref 将值转为 reactive 响应式值
    // ref 值
    this._value = __v_isShallow ? value : toReactive(value);
  }
  
  get value() {
    // 获取 value
    trackRefValue(this);
    // 收集依赖
    this.dep.track()
    return this._value;
  }
  
  set value(newVal) {
    // 设置 value
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
      // 触发依赖
      this.dep.trigger()
    }
  }
}
// 判断值是否改变
// 调用 Object.is() 
const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

```
