# vue&react 异同

## 相同

### 都使用虚拟 DOM 提高性能

### 都有 props 的概念，允许组件间传值

### 鼓励组件化应用

## 不同

### 数据流

#### vue 使用双向数据绑定。react 使用单向数据流

### 虚拟 DOM

#### vue 在实例化时将每个属性都进行了监听，跟踪每个组件的依赖关系。不需要重新渲染整个组件树

#### react 每当数据改变时，全部子组件都将重新渲染

### 组件化

#### vue 使用 HTML 魔板

#### react 使用 jsx 语法

### 数据监听方式

#### vue 通过 Object.defineProperty()进行数据劫持

#### react 通过比较引用的方式实现，如果不进行手动优化，可能导致大量 VDOM 的重新渲染

### 构建工具

#### vue vue-cli

#### react create react app

### 组件的拓展方式

#### vue 使用 mixin

#### react 使用高阶组件
