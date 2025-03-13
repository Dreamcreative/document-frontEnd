# 生命周期-选项式API

1. beforeCreate
   1. 组件实例初始化之后立即调用
2. created
   1. 组件实例处理完所有与状态相关选项后调用
3. beforeMount
   1. 组件挂载前调用
4. mounted 
   1. 组件挂载后调用
5. beforeUpdate
   1. 组件更新前调用
6. updated
   1. 组件更新后调用
7. beforeUnmount
   1. 组件卸载前调用
8. unmounted
   1. 组件卸载后调用
9. errorCaptured
   1. 捕获后代组件传递的错误时调用
   2. 捕获的错误类型
      1. 组件渲染
      2. 事件处理器
      3. 生命周期钩子
      4. setup() 函数
      5. 侦听器
      6. 自定义指令钩子
      7. 过度钩子
10. renderTracked
    1. 在一个响应式依赖追踪后调用，`仅在开发环境`
11. renderTriggered
    1. 在一个响应式依赖触发后调用，`仅在开发环境`
12. activated
    1. keepAlive 组件特有，组件激活后调用
13. deactivated
    1. keepAlive 组件特有，组件失活后调用
14. serverPrefetch
    1. 组件在服务器上被渲染之前`异步调用`
