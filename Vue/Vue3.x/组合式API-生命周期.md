# 组合式API-生命周期

1. onMounted
   1. 组件挂载后执行
2. onUpdated
   1. 组件更新后执行
3. onUnmounted
   1. 组件卸载后执行
4. onBeforeMount
   1. 组件挂载前执行
5. onBeforeUpdate
   1. 组件更新前执行
6. onBeforeUnmount
   1. 组件卸载前执行
7. onErrorCaptured
   1. 捕获后代组件传递的错误时调用
   2. 捕获的错误类型
      1. 组件渲染
      2. 事件处理器
      3. 生命周期钩子
      4. `setup()`函数
      5. 侦听器
      6. 自定义指令钩子
      7. 过度钩子
8. onRenderTracked
   1. 调试钩子，组件渲染过程中追踪到响应式依赖时调用，`仅在开发环境`
9.  onRenderTriggered
    1. 调试钩子，组件渲染过程中响应式依赖触发后调用，`仅在开发环境`
10. onActivated
    1. keepAlive 组件特有，组件激活后执行
11. onDeActivated
    1. keepAlive 组件特有，组件失活后执行
12. onServerPrefetch
    1. 异步执行，组件在服务器上被渲染之前执行
