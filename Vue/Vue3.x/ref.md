# ref、shallowRef

接收一个值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`

## 为什么 ref 需要通过 `.value` 获取值

因为 ref 通过代理 `value` 来实现响应式的

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
