# computed

接受一个 `getter` 函数，返回一个只读的响应式 ref 对象。本质上是一个 `effect`

1. 懒计算：只在访问计算属性时才会执行计算
2. 缓存机制：计算结果会被缓存，只有依赖变化时才会被重新计算
3. 响应式依赖追踪：自动收集计算过程中访问到的响应式数据作为依赖

## 工作流程

1. 初始化阶段
   1. 创建 ComputeRefImpl 实例,是 `Subscriber(effect)` 的实现 
   2. 将 `getter` 包装为 ReactiveEffect
   3. 初始状态标记 `_dirty = true`,表示需要更新
2. 访问计算属性
   1. 当访问 `.value`时，检查 `_dirty`
   2. 如果是脏值，执行 `effect.run()`,重新计算，并返回结果
   3. 将 `_dirty = false`
   4. 通过 `track` 收集当前正在运行的 `effect` 依赖 
3. 依赖更新
   1. 当 computed 内部依赖的响应是数据发生变化时
   2. 调用 scheduler 将 `_dirty = true`
   3. 触发依赖于这个 computed 的更新

```ts
// 调试选项
interface DebuggerOptions {
  // 依赖收集
  onTrack?: (event: DebuggerEvent) => void
  // 触发依赖
  onTrigger?: (event: DebuggerEvent) => void
}
function computed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRef<T>

interface WritableComputedOptions<T, S = T> {
  get: ComputedGetter<T>
  set: ComputedSetter<S>
}

function computed<T, S = T>(
  options: WritableComputedOptions<T, S>,
  debugOptions?: DebuggerOptions,
): WritableComputedRef<T, S>

function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false,
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T> | undefined
  // 如果是函数 表示传入的是一个 getter 函数
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  } else {
    // 否则传入的配置可能拥有 getter 和 setter 函数
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  // 创建一个ref 对象
  const cRef = new ComputedRefImpl(getter, setter, isSSR)

  if (__DEV__ && debugOptions && !isSSR) {
    // 在开发环境 拥有调试的能力，线上环境不生效
    cRef.onTrack = debugOptions.onTrack
    cRef.onTrigger = debugOptions.onTrigger
  }

  return cRef as any

}

class ComputedRefImpl<T = any> implements Subscriber {
  _value: any = undefined
  readonly dep: Dep = new Dep(this)
  readonly __v_isRef = true
  // TODO isolatedDeclarations ReactiveFlags.IS_REF
  readonly __v_isReadonly: boolean
  // TODO isolatedDeclarations ReactiveFlags.IS_READONLY
  // A computed is also a subscriber that tracks other deps
  deps?: Link = undefined
  depsTail?: Link = undefined
  flags: EffectFlags = EffectFlags.DIRTY
  globalVersion: number = globalVersion - 1
  isSSR: boolean
  next?: Subscriber = undefined

  // for backwards compat
  effect: this = this
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  constructor(
    public fn: ComputedGetter<T>,
    private readonly setter: ComputedSetter<T> | undefined,
    isSSR: boolean,
  ) {
    this[ReactiveFlags.IS_READONLY] = !setter
    this.isSSR = isSSR
  }

  notify(): true | void {
    this.flags |= EffectFlags.DIRTY
    if (
      !(this.flags & EffectFlags.NOTIFIED) &&
      // avoid infinite self recursion
      activeSub !== this
    ) {
      batch(this, true)
      return true
    }
  }

  get value(): T {
    refreshComputed(this)
    return this._value
  }

  set value(newValue) {
    if (this.setter) {
      this.setter(newValue)
    }
  }
}
```
