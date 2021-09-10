# vue&react 异同

## 相同

### 都使用虚拟DOM提高性能

### 都有 props的概念，允许组件间传值

### 鼓励组件化应用

## 不同

### 数据流

#### vue使用双向数据绑定。react使用单向数据流

### 虚拟DOM

#### vue在实例化时将每个属性都进行了监听，跟踪每个组件的依赖关系。不需要重新渲染整个组件树

#### react每当数据改变时，全部子组件都将重新渲染

### 组件化

#### vue使用HTML魔板

#### react使用jsx语法

### 数据监听方式

#### vue通过Object.defineProperty()进行数据劫持

#### react通过比较引用的方式实现，如果不进行手动优化，可能导致大量VDOM的重新渲染

### 构建工具

#### vue  vue-cli

#### react create react app

### 组件的拓展方式

#### vue  使用 mixin

#### react 使用高阶组件
