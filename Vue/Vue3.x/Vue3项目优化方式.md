# Vue3项目优化方式

## 代码层面优化

1. 利用 Vue3 默认优化
   1. 静态提升：Vue3 自动将静态节点提升到渲染函数外部，只创建一次，无需 `DOM diff`
   2. 动态标记：编译时为动态节点打标签，diff 时只对比必要的部分
   3. tree-shaking：只引入使用到的功能，减少了打包体积
2. 使用 `v-once`、`v-memo`
   1. v-once: 标记静态内容，只渲染一次，后续不再更新
   2. v-memo: 缓存一段模板，仅当依赖项改变时才重新渲染
3. 合理拆分组件
   1. 大组件拆成小组件：更细粒度的更新，避免大组件整体重新渲染
   2. 将频繁更新的部分抽离：比如列表项、动态表单字段等
4. 优化 v-for 和 key
5. 使用 computed 和 watch 优化
   1. computed: 缓存计算属性，避免重复计算
   2. watch：避免监听过多数据，

## 代码与结构优化

1. 组件懒加载（异步组件）

使用 `defineAsyncComponent` 或配合路由懒加载，减少首屏资源体积

```js
const AsyncComponent = defineAsyncComponent(() => import('./AsyncComponent.vue'))
```

2. 路由懒加载

结合 Vue Router，按需加载路由组件

```js
const Home = ()=> import('./Home.vue')
```

3. 使用 Composition API 合理组织逻辑
   1. 按功能拆分逻辑，避免一个 setup 过于庞大
   2. 复用逻辑抽离，避免重复编写
   3. 将逻辑抽离为独立的模块，方便维护和测试

4. 减少不必要的响应式数据
   1. 对于不会变化的数据，使用`ref`或`reactive`要适度，或者直接使用普通JS变量
   2. 大型列表/对象如不需要响应式，可用 `markRaw` 跳过响应

## 构建与打包优化

1. 使用vite 、webpack 等打包工具时，设置 mode 为 production，开启默认的`代码压缩`、`tree-shaking`等特性
2. 代码分割（code-splitting）
   1. 通过路由懒加载、动态 import 自动实现
   2. 第三方库按需引入（如 Element Plus 等）
3. 使用 CDN 引入第三方库
   1. CDN 引入第三方库，可以减少项目依赖，加快加载速度
4. `Tree-shaking` 与按需引入
   1. 使用支持 `Tree-shaking`的库（比如 lodash-es）
   2. 按需引入组件，避免全量引入

## 状态管理优化（比如使用 Pinia）

1. 避免大而全的 store,按模块拆分 store
2. 避免频繁 commit/dispatch,合并状态变更
3. 使用 getter 缓存计算状态，避免模板中重复计算
