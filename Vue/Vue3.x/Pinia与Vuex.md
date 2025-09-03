# Pinia 与 Vuex

## Pinia 设计理念

1. 设计目标：专为 Vue3设计，拥抱 Composition API,简化状态管理
2. 核心概念：state、getters、actions
   1. state: 定义全局共享数据，类似组件中的 data()
   2. getters: 基于 state 的计算属性，类似组件中的 computed
   3. actions: 处理业务逻辑、异步操作，类似组件中的 methods
3. 状态修改方式：可直接修改 state,
4. API 风格：更加函数式，更灵活，贴合 Vue3 Composition API
5. TypeScript 支持：原生支持，类型推导完善
6. 模块化方式：每个 Store 独立，按功能组织，更自然

## Pinia 更新流程

`组件 -> 直接调用 Action 或直接修改 state -> Action 或 state 修改数据 -> 触发视图更新`

## Vuex 设计理念

1. 设计目标：专为 Vue2 设计，虽然也支持 Vue3
2. 核心概念：有 state、getters、actions、mutation、modules、getters
   1. state：存储全局变量
   2. getters: 基于 state 的计算属性，类似组件中的 computed
   3. actions: 处理业务逻辑、异步操作
   4. mutations: 同步修改 state（Vuex 中 唯一修改 state 的方式）
   5. modules: 模块化拆分 store ,便于管理
3. 状态修改方式：只能通过 mutation 修改 state, 不能直接修改 state
4. API 风格：更偏向于 Object-based,强调流程控制
5. TypeScript 支持：TypeScript 支持较弱，类型定义复杂
6. 模块化方式：通过 `modules` 划分模块，结构固定
7. 数据流向：推崇严格的单向数据流（只能通过 mutation 修改 state）

## Vuex 推崇的 "单向数据流" ,更新流程

`组件 -> 调用 Action -> 调用 Mutation -> 修改 State -> 触发视图更新`
