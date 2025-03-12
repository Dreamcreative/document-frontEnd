# `<script setup>`和`setup()`的区别

## 总结

1. `<script setup>` 提供了更简洁的语法和更好的类型推断，适合简单和中等复杂度的组件
2. `setup()` 提供了更大的灵活性和与选项式API的兼容性，适合需要复杂逻辑或与旧代码兼容的场景


## `<script setup>`

`<script setup>` 是 vue3.2 引入的一种语法糖，它使得在单文件组件（SFC）中编写组件逻辑更加简洁和直观，

* 主要特点
  * 简化语法：不需要显示地定义 `setup()`,所有顶层变量和函数都会自动被视为组件的响应式状态和方法
  * 更好的类型推断：在使用 Typescript 时，`<script setup>` 提供了更好的类型推断
  * 自动导入：在`<script setup>`中，Vue 的响应式API, `ref`、`reactive`等可以自动导入，无需手动引入
  * 更少的样板代码：减少了样板代码，使得代码更加简洁、易懂

* `<script setup>`格式的单组件文件，在 Vue `packages/compiler-sfc/src/parse.ts` 文件中针对 SFC 单文件组件进行编译解析

## setup(props,context: {attrs, slots, emit, expose})

`setup()`是 Vue3 中引入的组合式API的一部分，它允许你在函数中定义组件的逻辑，`setup()`在组件实例创建之前调用，并且它的返回值会暴露给模板使用

* 主要特点
  * 显式定义：需要显式地定义 `setup()`,并返回一个对象，其中包含了模板所需的变量和方法
  * 更灵活：可以在 `setup()` 中使用更多的组合式API和逻辑
  * 与选项式API兼容：可以与 vue2 中的选项式 API 一起使用，便于渐进式迁移
