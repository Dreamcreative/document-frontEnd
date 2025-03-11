# effectScope

effectScope 是 Vue3 中用于管理副作用（effects）的作用域机制

## 主要好处

1. 内存管理：自动清理响应式效果，避免内存泄漏
2. 代码组织：将相关的响应式逻辑组织在一起，提高代码的可维护性
3. 生命周期解耦：可以独立于组件生命周期管理响应式效果
4. 嵌套作用域：支持作用域嵌套，子作用域停止时不影响父作用域
5. 性能优化：批量停止多个响应式效果，比单独清理每个效果更高效
6. 可复用性：使用组合式函数更加模块化，可以完全控制其生命周期

## effectScope(detached: boolean)

参数
1. detached: 
   1. 默认值：false
   2. 表示创建的作用域是否嵌套到当前活动的作用域中
      1. false: 表示创建的作用域嵌套到当前作用域，当前作用域被销毁时，effectScope 创建的作用域也会被销毁
      2. true: 表示创建的作用域不会嵌套到当前作用域，当前作用域被销毁时，effectScope 创建的作用域不会被销毁，需要手动调用`.stop()`来进行销毁

## onScopeDispose()

在当前活跃的作用域中注册一个处理回调函数，当相关的 effect 作用域停止时，会调用这个回调函数，相当于组件中的 `onUnmounted`

### 与 onUnmounted 的区别

1. onUnmounted: 主要用于组件的卸载
2. onScopeDispose: 更通用，可用在任何作用域结束时触发，包括`组件卸载`、`自定义作用域 stop() 时`

### 主要用途

1. 当组件卸载时，或者 effectScope 创建的作用域停止时，自动调用，主要用于清理副作用（事件监听、定时器、订阅等）
2. 释放资源
3. 防止内存泄漏

## getCurrentScope()

获取当前活跃的作用域,如果存在

```ts
// 当前激活的作用域
let activeEffectScope = null

class EffectScope {
  effects: ReactiveEffect[] = []
  cleanups: (() => void)[] = []
  scopes: EffectScope[] | undefined
  parent: EffectScope | undefined
  constructor(detached = false) {
    this.active = true
    // 存储该作用域下的所有副作用函数
    this.effects = []
    // 存储嵌套的子作用域
    this.scopes = []
    // 如果不是分离的作用域,则将自己添加到父作用域
    if (!detached && activeEffectScope) {
      activeEffectScope.scopes.push(this)
    }
  }

  // 运行副作用函数
  run(fn) {
    if (this.active) {
      try {
        // 设置当前激活的作用域
        activeEffectScope = this
        // 运行副作用函数,期间创建的响应式效果都会被收集到当前作用域
        return fn()
      } finally {
        // 恢复之前的作用域
        activeEffectScope = null
      }
    }
  }

  // 停止该作用域及其所有子作用域
  stop() {
    if (this.active) {
      this.active = false
      // 清理所有副作用
      this.effects.forEach(effect => effect.stop())
      // 清理所有子作用域
      this.scopes.forEach(scope => scope.stop())
    }
  }
}

// 创建一个作用域
export function effectScope(detached) {
  return new EffectScope(detached)
}

```
