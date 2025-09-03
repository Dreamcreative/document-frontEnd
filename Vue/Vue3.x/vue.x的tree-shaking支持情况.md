# vue 各版本的tree-shaking支持情况

`tree-shaking` 是构建工具（如 webpack、rollup等）在打包时，移除 JavaScript 上下文中未引用代码的一种优化技术

## Vue2 tree-shaking


1. Vue2 的模块设计与打包机制

vue2 是一个包含了完整功能（如响应式系统、模版编译、组件系统等）的库，其核心功能与额外能力（比如指令、过度效果等）都打包在一个大模块中，没有按功能拆分成独立的 `ES Module`

2. Vue2 的导出方式

Vue2 主要采用 CommonJS 和 UMD 的模块格式，而不是 `ES Module`格式，主流的 `tree-shaking` 依赖的是 `ES Module` 的静态结构

3. 结论：`Vue2 不支持 tree-shaking`

由于 Vue2 并非基于 `ES Module` 设计，且整体打包，因此在使用诸如 Webpack 等工具时，无法自动剔除未使用的 Vue 功能，因此无法使用 `tree-shaking` 技术


## Vue3 tree-shaking

1. Vue3 的模块设计

Vue3 采用 `Composition API`，并将核心功能拆分为多个独立模块，例如响应式系统、虚拟DOM等，均以 `ES Module` 形式组织

2. Vue3 的导出方式

Vue3 默认导出为 `ES Module`，支持按需引入，构建工具可以识别哪些模块被实际使用，从而剔除未使用代码

3. 结论：`Vue3 支持 tree-shaking`

Vue3 采用 `ES Module` 和模块化设计，支持 `tree-shaking`,能够有效减少打包体积
